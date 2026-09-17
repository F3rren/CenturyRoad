package centuryroad.auth.controller;

import centuryroad.auth.config.RequestCorrelationFilter;
import centuryroad.auth.dto.ApiEnvelope;
import centuryroad.auth.dto.CreateUserRequest;
import centuryroad.auth.dto.DeletedUserResponse;
import centuryroad.auth.dto.UpdateUserRequest;
import centuryroad.auth.dto.UserListPayload;
import centuryroad.auth.dto.UserRegisterAck;
import centuryroad.auth.dto.UserSummaryDto;
import centuryroad.auth.dto.UserUpdateAck;
import centuryroad.auth.exception.ResourceNotFoundException;
import centuryroad.auth.model.User;
import centuryroad.auth.service.AuthService;
import centuryroad.auth.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User administration - admin only. @RequestBody throughout, not @ModelAttribute: a
 * password must never sit in a URL, where it would reach access logs, browser history
 * and any Referer header sent afterwards.
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private static final String USER_ID_POSITIVE = "L'ID dell'utente deve essere un numero positivo.";

    private final AuthService authService;
    private final UserService userService;

    public AdminUserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    private String sessionId() {
        return RequestCorrelationFilter.current();
    }

    @PostMapping
    public ResponseEntity<ApiEnvelope<UserRegisterAck>> register(@Valid @RequestBody CreateUserRequest request) {
        User user = authService.register(request);
        return new ResponseEntity<>(
                ApiEnvelope.success("Utente registrato con successo dall'amministratore",
                        new UserRegisterAck(user), sessionId()),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiEnvelope<UserListPayload>> getAllUsers() {
        List<UserSummaryDto> users = authService.getAllUsers().stream()
                .map(UserSummaryDto::of)
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                ApiEnvelope.success("Lista utenti recuperata con successo", new UserListPayload(users), sessionId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiEnvelope<UserUpdateAck>> updateUser(
            @PathVariable("id") @Positive(message = USER_ID_POSITIVE) Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        User updated = authService.updateUser(id, request);
        return ResponseEntity.ok(
                ApiEnvelope.success("Utente aggiornato con successo dall'amministratore",
                        new UserUpdateAck(updated), sessionId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiEnvelope<DeletedUserResponse>> deleteUser(
            @PathVariable("id") @Positive(message = USER_ID_POSITIVE) Long id) {
        if (userService.findById(id) == null) {
            throw new ResourceNotFoundException("No user with id " + id,
                    String.format("L'utente con ID %d non esiste.", id));
        }
        userService.deleteById(id);
        return ResponseEntity.ok(ApiEnvelope.success("Utente eliminato con successo", new DeletedUserResponse(id), sessionId()));
    }
}

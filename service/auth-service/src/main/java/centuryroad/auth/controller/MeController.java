package centuryroad.auth.controller;

import centuryroad.auth.config.RequestCorrelationFilter;
import centuryroad.auth.dto.ApiEnvelope;
import centuryroad.auth.dto.UserSummaryDto;
import centuryroad.auth.exception.ResourceNotFoundException;
import centuryroad.auth.model.User;
import centuryroad.auth.security.AppPrincipal;
import centuryroad.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The caller's own profile. Trusts the AppPrincipal JwtAuthFilter already put in the
 * SecurityContext rather than re-deriving anything from the request, and still hits the
 * database once: the token's claims are enough to authorize, but a profile view should
 * reflect the current row (an admin could have disabled the account since the token was
 * issued), not a snapshot from whenever it was signed.
 */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final UserService userService;

    public MeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiEnvelope<UserSummaryDto>> getMe(@AuthenticationPrincipal AppPrincipal principal) {
        User user = userService.findById(principal.id());
        if (user == null) {
            throw new ResourceNotFoundException("No user with id " + principal.id(),
                    "L'utente richiesto non esiste.");
        }
        return ResponseEntity.ok(ApiEnvelope.success(null, UserSummaryDto.of(user), RequestCorrelationFilter.current()));
    }
}

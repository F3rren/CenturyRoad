package centuryroad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * A request from an admin to create a new user. @RequestBody, not @ModelAttribute: a
 * password must never sit in a URL, where it would reach access logs, browser history
 * and any Referer header sent afterwards - the same reasoning classroom-backend's
 * AdminUserController documents at the same two endpoints this was ported from.
 */
public record CreateUserRequest(
        @NotBlank(message = "L'email e' obbligatoria.")
        @Email(message = "Il formato dell'email non e' valido.")
        String email,

        @NotBlank(message = "La password e' obbligatoria.")
        @Size(min = 8, message = "La password deve essere di almeno 8 caratteri.")
        String password,

        @Pattern(regexp = "(?i)admin|user", message = "Il ruolo deve essere 'admin' o 'user'.")
        String role) {
}

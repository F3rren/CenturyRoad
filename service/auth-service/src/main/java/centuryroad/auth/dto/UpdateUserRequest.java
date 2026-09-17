package centuryroad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

/**
 * A request from an admin to update an existing user. password is optional: null or
 * blank means "leave it unchanged" - see AuthService.updateUser.
 */
public record UpdateUserRequest(
        @Email(message = "Il formato dell'email non e' valido.")
        String email,

        String password,

        @Pattern(regexp = "(?i)admin|user", message = "Il ruolo deve essere 'admin' o 'user'.")
        String role,

        Boolean enabled) {
}

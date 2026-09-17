package centuryroad.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Il refresh token e' obbligatorio.")
        String refreshToken) {
}

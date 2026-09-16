package centuryroad.auth.dto;

public record RefreshPayload(String token, String refreshToken, String tokenType) {

    public RefreshPayload(String token, String refreshToken) {
        this(token, refreshToken, "Bearer");
    }
}

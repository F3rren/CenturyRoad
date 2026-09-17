package centuryroad.auth.dto;

/** The data half of a successful login, nested under ApiEnvelope.data. */
public record LoginPayload(String token, String refreshToken, UserSummaryDto user, String tokenType) {

    public LoginPayload(String token, String refreshToken, UserSummaryDto user) {
        this(token, refreshToken, user, "Bearer");
    }
}

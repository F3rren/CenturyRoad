package centuryroad.auth.exception;

public class InvalidRequestException extends ApplicationException {
    public InvalidRequestException(String message, String userMessage) {
        super("INVALID_REQUEST", message, userMessage);
    }
}

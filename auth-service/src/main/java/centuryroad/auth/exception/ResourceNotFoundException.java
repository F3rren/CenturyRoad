package centuryroad.auth.exception;

public class ResourceNotFoundException extends ApplicationException {
    public ResourceNotFoundException(String message, String userMessage) {
        super("NOT_FOUND", message, userMessage);
    }
}

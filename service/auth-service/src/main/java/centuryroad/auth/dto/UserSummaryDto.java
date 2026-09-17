package centuryroad.auth.dto;

import centuryroad.auth.model.User;

/**
 * What a user looks like from the outside - never the password. A static factory rather
 * than a Jackson-serialised entity, so adding a field to User later requires a deliberate
 * choice here too instead of it appearing in a response by accident.
 */
public record UserSummaryDto(Long id, String email, String role, boolean enabled, String createdAt) {

    public static UserSummaryDto of(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
    }
}

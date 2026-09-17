package centuryroad.auth.dto;

import centuryroad.auth.model.User;

public record UserUpdateAck(Long id, String email, String role, boolean enabled) {

    public UserUpdateAck(User user) {
        this(user.getId(), user.getEmail(), user.getRole().name(), user.isEnabled());
    }
}

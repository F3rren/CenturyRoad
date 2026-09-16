package centuryroad.auth.dto;

import centuryroad.auth.model.User;

public record UserRegisterAck(Long id, String email, String role) {

    public UserRegisterAck(User user) {
        this(user.getId(), user.getEmail(), user.getRole().name());
    }
}

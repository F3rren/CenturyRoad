package centuryroad.auth.dto;

import java.util.List;

public record UserListPayload(List<UserSummaryDto> users) {
}

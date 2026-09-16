package centuryroad.auth.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginAttemptLimiterUnitTest {

    @Test
    void staysOpenUpToTheConfiguredLimit() {
        LoginAttemptLimiter limiter = new LoginAttemptLimiter(3, 60_000L);

        assertThat(limiter.checkAndRecord("k")).isZero();
        assertThat(limiter.checkAndRecord("k")).isZero();
        assertThat(limiter.checkAndRecord("k")).isZero();
    }

    @Test
    void blocksOnceTheLimitIsExceeded() {
        LoginAttemptLimiter limiter = new LoginAttemptLimiter(2, 60_000L);

        limiter.checkAndRecord("k");
        limiter.checkAndRecord("k");

        assertThat(limiter.checkAndRecord("k")).isGreaterThan(0);
    }

    @Test
    void twoDifferentKeysDoNotShareAQuota() {
        LoginAttemptLimiter limiter = new LoginAttemptLimiter(1, 60_000L);

        limiter.checkAndRecord("ip1|a@test.it");

        assertThat(limiter.checkAndRecord("ip2|a@test.it")).isZero();
    }

    @Test
    void resetClearsTheCounter() {
        LoginAttemptLimiter limiter = new LoginAttemptLimiter(1, 60_000L);

        limiter.checkAndRecord("k");
        limiter.reset("k");

        assertThat(limiter.checkAndRecord("k")).isZero();
    }
}

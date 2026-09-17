-- ============================================================================
-- Users and refresh tokens: the identity this service is the sole owner of.
--
-- The users table mirrors the one backend used to own (email, password, role, enabled,
-- created_at) so the migration off it is a clean cut: same shape, new home. See
-- backend's own migration that drops events.author_id's foreign key to this table -
-- author_id becomes a plain reference to a user id living in a different database, the
-- same pattern refresh_tokens.user_id does NOT need, since both tables live here.
-- ============================================================================

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Refresh tokens: the one piece of server-side state a stateless JWT cannot do without,
-- for handing out a new access token without a fresh login and for revoking one early
-- (logout). token_hash, not the token itself, for the same reason a password is hashed
-- rather than stored in clear: this table is what an attacker who reads this database
-- would want most, and a SHA-256 digest is useless to them without the original.
CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash  VARCHAR(64) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);

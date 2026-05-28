-- Enable PostGIS (idempotent – superuser needed; granted via init-postgis.sql)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Historical events
CREATE TABLE events (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    year        SMALLINT     NOT NULL CHECK (year BETWEEN 1900 AND 2000),
    location    GEOMETRY(POINT, 4326),
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    author_id   BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX events_year_idx      ON events (year);
CREATE INDEX events_location_idx  ON events USING GIST (location);
CREATE INDEX events_status_idx    ON events (status);

-- Event images
CREATE TABLE event_images (
    id        BIGSERIAL PRIMARY KEY,
    event_id  BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    url       TEXT   NOT NULL,
    caption   VARCHAR(255),
    position  SMALLINT NOT NULL DEFAULT 0
);

-- Runs once on DB creation as superuser; enables PostGIS on the app database.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

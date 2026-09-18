# Century Road — Backend

Two Spring Boot services behind an API gateway. `auth-service` owns identity: users,
login, and the JWTs every other service will eventually verify. `gateway` is the single
entry point and routes to it. In production a reverse proxy sits in front of both and
terminates TLS.

```
browser ──HTTPS──▶ proxy (Caddy) ──HTTP──▶ gateway ──HTTP──▶ auth-service ──▶ postgres
                   :443                    :8080             :8081             :5432
                   TLS, HSTS               routing, CORS     identity
```

Only the proxy is published in production. The gateway and `auth-service` talk over the
internal Compose network and are not reachable from outside.

| Path | Served by |
|---|---|
| `/api/auth/**` | login, token refresh, logout |
| `/api/me/**` | the caller's own profile |
| `/api/admin/users/**` | user administration, admin only |
| `/actuator/health`, `/actuator/prometheus` | monitoring |

## Prerequisites

- **Docker** and **Docker Compose** — everything runs in containers.
- **Java 21**, only if you want to build or run the test suite outside Docker. The Maven
  wrapper (`./mvnw`) is committed, so no separate Maven install is needed.

## Configuration

Every variable lives in a single `.env` at the repository root:

```bash
cp .env.example .env
```

`.env` is gitignored and must never be committed. Fill in at least these before the first
start:

| Variable | Why it matters |
|---|---|
| `POSTGRES_PASSWORD` | also used by the services to connect |
| `JWT_SECRET` | see below — the service will not start with a bad one |
| `GRAFANA_PASSWORD` | the Grafana admin login; sign-up is disabled, so this is the only way in |
| `FRONTEND_ORIGIN` | exact origin of the frontend, or the browser blocks every call |
| `PUBLIC_DOMAIN` | production only — must already resolve to the host |

`.env.example` documents the rest inline.

### Generating `JWT_SECRET`

```bash
openssl rand -base64 48
```

The value is **base64-decoded** before use, and the decoded result must be at least 32
bytes for HS256. Both rules bite at startup rather than at the first login: a value that
is not valid base64 fails to decode, and one that decodes to fewer than 32 bytes is
rejected as too weak. "32 characters" is not the bar — 32 bytes *after decoding* is,
which is why the command above asks for 48.

## Local development

```bash
docker compose up
```

`docker-compose.override.yml` is applied automatically and swaps in the dev image
targets: hot reload, the `dev` Spring profile, and published ports. Plain HTTP, no proxy.

| | URL |
|---|---|
| Gateway | http://localhost:8080 |
| auth-service (direct) | http://localhost:8081 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |
| Remote debug | `5006` auth-service, `5007` gateway |

## Production deployment

### 1. Point DNS at the host first

`PUBLIC_DOMAIN` has to resolve to the machine **before** the first start. Caddy obtains
the certificate on startup by answering a challenge on port 80, and a domain that does
not resolve yet simply fails it. Ports **80 and 443 must be reachable from the internet**.

### 2. Fill in the production values

```
PUBLIC_DOMAIN=api.yourdomain.example
FRONTEND_ORIGIN=https://app.yourdomain.example
HSTS_MAX_AGE=300
```

`FRONTEND_ORIGIN` must match exactly — scheme, host and port, no trailing slash.
`https://app.example` and `https://app.example/` are different origins to a browser, and
the symptom of getting it wrong is a blocked request that looks like a network error.

### 3. Start the stack

```bash
docker compose -f docker-compose.yml --profile proxy up -d
```

Two details, both easy to get wrong:

- **`-f docker-compose.yml` is not optional.** Without it Compose also applies
  `docker-compose.override.yml` and you silently deploy the development stack — dev image
  targets, source mounts, debug ports and the `dev` profile.
- **`--profile proxy`** is what starts the reverse proxy. Without it nothing terminates
  TLS and nothing is published at all, since the gateway no longer exposes a port of its
  own in production.

### 4. Create the first administrator

See the section below. Do this before handing the API to anyone.

### 5. Verify TLS and HSTS

```bash
curl -sI https://$PUBLIC_DOMAIN/actuator/health | grep -i strict-transport
```

Expected: `strict-transport-security: max-age=300; includeSubDomains`.

If the header is missing, the request did not reach the proxy over HTTPS, or the proxy is
not running. HSTS is only ever emitted on an HTTPS request — that is deliberate, not a
bug.

### 6. Only later, raise the HSTS window

Once HTTPS has been stable for a few days, set `HSTS_MAX_AGE=31536000` (one year) and
restart the proxy.

Do not skip straight to a year. A browser that has seen this header refuses plain HTTP
for the whole window, so a certificate that breaks during the first rollout becomes a
lockout users cannot click past. At 300 seconds the same accident is a five minute
nuisance.

`preload` is deliberately absent from the Caddyfile. It is not simply a longer max-age:
it asks to be compiled into the browsers themselves, and getting back off that list takes
months. Add it only when every subdomain is permanently HTTPS.

## First administrator

Creating a user requires an admin token, so an empty database has no way to produce its
first administrator on its own. `FirstAdminBootstrap` exists for exactly that gap.

1. Set **both** variables in `.env`:

   ```
   BOOTSTRAP_ADMIN_EMAIL=you@yourdomain.example
   BOOTSTRAP_ADMIN_PASSWORD=<a long random password>
   ```

2. Start the stack. The administrator is created **only** if both values are set and the
   users table is empty — on any other database the mechanism stays inert and logs that
   it did nothing.

3. Log in once to confirm it worked:

   ```bash
   curl -s -X POST https://$PUBLIC_DOMAIN/api/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"you@yourdomain.example","password":"..."}'
   ```

4. **Clear both variables and restart.** They are passed into the container environment,
   so leaving them set keeps a password readable by anyone who can inspect the container,
   for no further benefit — the mechanism will not fire again anyway.

## Tests

```bash
cd service/auth-service && ./mvnw test    # 57 tests
cd service/gateway      && ./mvnw test    #  9 tests
```

`auth-service` runs its integration tests against a real PostgreSQL started through
Testcontainers, so **Docker must be running and able to pull images**. Without it those
tests do not fail on an assertion — the Spring context never starts, and every test in the
five integration classes errors with `Could not find a valid Docker environment`.

That message is misleading: it also appears when Docker is running fine but cannot pull,
or when the daemon rejects the API version the client asks for. When it shows up, read the
`Attempted configurations were:` block just above it — it names the real reason for each
strategy that was tried.

The gateway suite needs no Docker: it stubs its upstream in-process.

## Observability

Both services expose `/actuator/health` and `/actuator/prometheus`. Prometheus scrapes
them and Grafana is provisioned with it as a datasource, so the dashboards come up with
no manual wiring. Configuration lives under `infra/`.

## Security notes

- **The database port is published.** `docker-compose.yml` maps `5432:5432`, which is
  convenient locally but exposes Postgres on the host in production. Remove that mapping,
  or restrict it at the firewall, on any machine reachable from outside.
- **Never commit `.env`.** It holds the JWT signing secret; anyone with it can mint valid
  tokens for any user.
- **`server.forward-headers-strategy` is enabled in the `prod` profile**, so the services
  trust the `X-Forwarded-*` headers they receive. That is safe only because the proxy
  overwrites them rather than passing on what the caller sent. If you ever expose the
  gateway directly, remove that setting first: a caller could otherwise claim any address
  it likes and walk around the login rate limiting.

package centuryroad.gateway;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import reactor.netty.DisposableServer;
import reactor.netty.http.server.HttpServer;

/**
 * A stub stands in for auth-service with reactor-netty (already on the classpath
 * transitively via spring-cloud-starter-gateway) so route resolution can be verified
 * without a real upstream. It is started as a static field initializer, not @BeforeAll,
 * so it is guaranteed listening before Spring resolves @DynamicPropertySource values
 * while building the gateway's ApplicationContext.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GatewayRoutingTest {

	private static final DisposableServer authServiceStub = HttpServer.create()
			.port(0)
			.route(routes -> routes.get("/**",
					(req, res) -> res.header("X-Upstream", "auth-service")
							.header("X-Upstream-Path", req.uri())
							.sendString(Mono.just("auth-service-stub"))))
			.bindNow();

	@LocalServerPort
	private int gatewayPort;

	@DynamicPropertySource
	static void routeToStubs(DynamicPropertyRegistry registry) {
		registry.add("AUTH_SERVICE_URI", () -> "http://localhost:" + authServiceStub.port());
	}

	@AfterAll
	static void stopStubs() {
		authServiceStub.disposeNow();
	}

	private WebTestClient client() {
		return WebTestClient.bindToServer().baseUrl("http://localhost:" + gatewayPort).build();
	}

	@Test
	void routesAuthPathToAuthService() {
		client().get().uri("/api/auth/login")
				.exchange()
				.expectStatus().isOk()
				.expectHeader().valueEquals("X-Upstream", "auth-service");
	}

	@Test
	void routesAdminUsersPathToAuthService() {
		client().get().uri("/api/admin/users")
				.exchange()
				.expectStatus().isOk()
				.expectHeader().valueEquals("X-Upstream", "auth-service");
	}

	@Test
	void routesMePathToAuthService() {
		client().get().uri("/api/me")
				.exchange()
				.expectStatus().isOk()
				.expectHeader().valueEquals("X-Upstream", "auth-service");
	}

	@Test
	void unmatchedApiPathHasNoRoute() {
		client().get().uri("/api/events/123")
				.exchange()
				.expectStatus().isEqualTo(HttpStatus.NOT_FOUND);
	}

	@Test
	void anotherAdminPathIsNotForwardedJustBecauseItStartsWithApiAdmin() {
		// The predicate is /api/admin/users/**, not /api/admin/**: a future admin area
		// belonging to a different service must not be swallowed by this route.
		client().get().uri("/api/admin/settings")
				.exchange()
				.expectStatus().isEqualTo(HttpStatus.NOT_FOUND);
	}

	@Test
	void thePathReachesTheUpstreamUnmodified() {
		// auth-service serves its real /api/... paths, so the gateway deliberately has no
		// path-stripping filter - see the routes comment in application.properties.
		client().get().uri("/api/auth/login")
				.exchange()
				.expectStatus().isOk()
				.expectHeader().valueEquals("X-Upstream-Path", "/api/auth/login");
	}

}

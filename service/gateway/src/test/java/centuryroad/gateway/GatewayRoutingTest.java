package centuryroad.gateway;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import reactor.netty.DisposableServer;
import reactor.netty.http.server.HttpServer;

/**
 * Stubs stand in for auth-service and backend with reactor-netty (already on the
 * classpath transitively via spring-cloud-starter-gateway) so route resolution can be
 * verified without a real upstream. They are started as static field initializers,
 * not @BeforeAll, so they are guaranteed listening before Spring resolves
 * @DynamicPropertySource values while building the gateway's ApplicationContext.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GatewayRoutingTest {

	private static final DisposableServer authServiceStub = HttpServer.create()
			.port(0)
			.route(routes -> routes.get("/**",
					(req, res) -> res.header("X-Upstream", "auth-service").sendString(Mono.just("auth-service-stub"))))
			.bindNow();

	private static final DisposableServer backendStub = HttpServer.create()
			.port(0)
			.route(routes -> routes.get("/**",
					(req, res) -> res.header("X-Upstream", "backend").sendString(Mono.just("backend-stub"))))
			.bindNow();

	@LocalServerPort
	private int gatewayPort;

	@DynamicPropertySource
	static void routeToStubs(DynamicPropertyRegistry registry) {
		registry.add("AUTH_SERVICE_URI", () -> "http://localhost:" + authServiceStub.port());
		registry.add("BACKEND_SERVICE_URI", () -> "http://localhost:" + backendStub.port());
	}

	@AfterAll
	static void stopStubs() {
		authServiceStub.disposeNow();
		backendStub.disposeNow();
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
	void routesUnmatchedApiPathToBackend() {
		client().get().uri("/api/events/123")
				.exchange()
				.expectStatus().isOk()
				.expectHeader().valueEquals("X-Upstream", "backend");
	}

}

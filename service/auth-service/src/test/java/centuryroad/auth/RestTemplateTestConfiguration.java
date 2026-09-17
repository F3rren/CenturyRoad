package centuryroad.auth;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

/**
 * The JDK's HttpURLConnection cannot replay a streamed POST body to retry after a 401
 * ("cannot retry due to server authentication, in streaming mode"), so any test that
 * expects a 401 from a POST/PUT with a body needs TestRestTemplate to buffer the request
 * body instead of streaming it.
 */
@TestConfiguration(proxyBeanMethods = false)
public class RestTemplateTestConfiguration {

    @Bean
    @SuppressWarnings("removal") // no replacement exists before Boot 3.4; this project is pinned to 3.3.4
    RestTemplateBuilder restTemplateBuilder() {
        return new RestTemplateBuilder().requestFactory(() -> {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setOutputStreaming(false);
            return factory;
        });
    }
}

package com.challet.challetapigateway.filter;

import com.challet.challetapigateway.util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<Object> {


    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(Object.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();
            System.out.println(path);

            // /challet-service/auth/와 Swagger 경로들은 토큰 검증을 제외
            if (path.startsWith("/api/challet/auth") ||
                path.startsWith("/api/challet/ws") ||
                path.startsWith("/api/challet/v3/api-docs") ||
                path.startsWith("/api/ch-bank/v3/api-docs") ||
                path.startsWith("/api/kb-bank/v3/api-docs") ||
                path.startsWith("/api/nh-bank/v3/api-docs") ||
                path.startsWith("/api/sh-bank/v3/api-docs") ) {
                return chain.filter(exchange);
            }

            // 토큰 검증 로직
            String header = exchange.getRequest().getHeaders().getFirst("Authorization");

            // 헤더가 없거나 Bearer로 시작하지 않으면 인증실패
            if(header == null || !header.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // 토큰이 유효하지 않거나 accessToken이 아니면 인증실패
            String token = header.substring(7);
            if (!jwtUtil.validateToken(token) || !jwtUtil.isAccessToken(token)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            return chain.filter(exchange);
        };
    }
}

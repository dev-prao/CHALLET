package com.challet.challetapigateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-exp}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-exp}")
    private long refreshTokenExpiration;

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // AccessToken인지 검사
    public boolean isAccessToken(String token) {
        return "access_token".equals(getClaimsFromToken(token).get("type"));
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 토큰으로부터 클레임 추출
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(this.getSecretKey())  // secretKey 사용
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    // 토큰의 만료시간 가져오기
    public Date getExpirationFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(this.getSecretKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
    }

}

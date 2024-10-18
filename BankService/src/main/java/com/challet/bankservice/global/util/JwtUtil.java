package com.challet.bankservice.global.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

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

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // Access Token 발급
    public String generateAccessToken(String phoneNumber) {
        return generateToken(phoneNumber, accessTokenExpiration, "access_token");
    }

    // Refresh Token 발급
    public String generateRefreshToken(String phoneNumber) {
        return generateToken(phoneNumber, refreshTokenExpiration, "refresh_token");
    }

    // 토큰 생성 메서드
    private String generateToken(String phoneNumber, long expiration, String type) {
        return Jwts.builder()
                .setSubject(phoneNumber)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(this.getSecretKey())
                .claim("type", type)
                .compact();
    }

    // Authorization 헤더로 회원 추출
    public String getLoginUserPhoneNumber(String header){
        String token = header.substring(7);
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    // token에서 phoneNumber 추출
    public String getPhoneNumber(String token) throws ExpiredJwtException, JwtException {
        return getClaimsFromToken(token).getSubject();
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
        try {
            return Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey())  // secretKey 사용
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn(e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (JwtException e) {
            logger.error(e.getMessage());
            throw e;
        }
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
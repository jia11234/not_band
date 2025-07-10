package com.not_band.provider;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtProvider {

    private final Key key;

    public JwtProvider(@Value("${secret-key}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String create(String userId) {
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(new Date())
            .setExpiration(expiredDate)
            .signWith(key)
            .compact();
    }

    public String validate(String jwt) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

            return claims.getSubject();
        } catch (Exception exception) {
            log.warn("JWT 검증 실패: {}", exception.getMessage());
            return null;
        }
    }
}

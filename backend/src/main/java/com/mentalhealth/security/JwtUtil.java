package com.mentalhealth.security;

import com.mentalhealth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiration-ms}") long expirationMs) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException exception) {
            keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) { return buildToken(user.getEmail(), expirationMs); }
    public String generateRefreshToken(User user) { return buildToken(user.getEmail(), expirationMs * 7); }

    private String buildToken(String subject, long lifetime) {
        Date now = new Date();
        return Jwts.builder().subject(subject).issuedAt(now)
                .expiration(new Date(now.getTime() + lifetime)).signWith(signingKey).compact();
    }

    public String extractUsername(String token) { return extractClaim(token, Claims::getSubject); }
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    public boolean isTokenExpired(String token) { return extractExpiration(token).before(new Date()); }
    private Date extractExpiration(String token) { return extractClaim(token, Claims::getExpiration); }
    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload());
    }
}
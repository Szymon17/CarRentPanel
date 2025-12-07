package com.AdminPanel.backend.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "fgasddagsADAKsoHNgnoredklsMGNFAYTTYREHfgdDJIKRGNEUIJ";

    public String generateToken(String email){
        return  Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token){
        return  Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJwt(token).getBody().getSubject();
    }

    public  boolean isTokenExpired(String token){
        Date exp = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJwt(token).getBody().getExpiration();

        return exp.before(new Date());
    }

    public boolean validateToken(String token, String email){
        return  extractEmail(token).equals(email) && ! isTokenExpired(token);
    }
}

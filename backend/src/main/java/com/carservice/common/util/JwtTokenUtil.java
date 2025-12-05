package com.carservice.common.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.carservice.entity.User;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtTokenUtil {
    private static final String CLAIM_KEY_UNIONID = "unionid";
    private static final String CLAIM_KEY_OPENID = "openid";
    private static final String CLAIM_KEY_USER_ID = "userId";
    private static final String CLAIM_KEY_ROLE = "role";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC512(secret);
    }

    public String generateToken(User user) {
        return generateToken(user.getUnionid(), user.getOpenid(), user.getUserId(), user.getRoleCode());
    }

    public String generateToken(String unionid, String openid, String userId, String role) {
        return JWT.create()
                .withClaim(CLAIM_KEY_UNIONID, unionid)
                .withClaim(CLAIM_KEY_OPENID, openid)
                .withClaim(CLAIM_KEY_USER_ID, userId)
                .withClaim(CLAIM_KEY_ROLE, role)
                .withIssuedAt(new Date())
                .withExpiresAt(Date.from(LocalDateTime.now()
                        .plusMinutes(expiration)
                        .atZone(ZoneId.systemDefault())
                        .toInstant()))
                .sign(getAlgorithm());
    }

    public DecodedJWT verifyToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm()).build();
            return verifier.verify(token);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        DecodedJWT jwt = verifyToken(token);
        return jwt != null;
    }

    public String getUnionidFromToken(String token) {
        DecodedJWT jwt = verifyToken(token);
        return jwt != null ? jwt.getClaim(CLAIM_KEY_UNIONID).asString() : null;
    }

    public String getOpenidFromToken(String token) {
        DecodedJWT jwt = verifyToken(token);
        return jwt != null ? jwt.getClaim(CLAIM_KEY_OPENID).asString() : null;
    }

    public String getUserIdFromToken(String token) {
        DecodedJWT jwt = verifyToken(token);
        return jwt != null ? jwt.getClaim(CLAIM_KEY_USER_ID).asString() : null;
    }

    public String getRoleFromToken(String token) {
        DecodedJWT jwt = verifyToken(token);
        return jwt.getClaim(CLAIM_KEY_ROLE).asString();
    }
}
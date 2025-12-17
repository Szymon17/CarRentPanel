package com.AdminPanel.backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetails;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetails){
        this.jwtUtil = jwtUtil;
        this.userDetails = userDetails;
    }

    private String getToken(Cookie[] cookies)  {
        for (Cookie cookie : cookies){
            if (cookie.getName().equals("TOKEN")) return cookie.getValue();
        }

        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request){
        String path = request.getServletPath();

        return path.startsWith("/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        String token = getToken(request.getCookies());
        System.out.println("Halo???" + token);
        String userEmail = jwtUtil.extractEmail(token);
        if (token != null && userEmail != null && jwtUtil.validateToken(token, userEmail)){
            UserDetails user = userDetails.loadUserByUsername(userEmail); //tutaj musimy stworzyć customUserDetailsService i ndpisać loadUserByUSername

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

}

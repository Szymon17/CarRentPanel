package com.AdminPanel.backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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

        return path.startsWith("/auth/login");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String token = getToken(request.getCookies());

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String userEmail = jwtUtil.extractEmail(token);

            if (userEmail != null && jwtUtil.validateToken(token, userEmail)) {
                UserDetails user = userDetails.loadUserByUsername(userEmail);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }


}

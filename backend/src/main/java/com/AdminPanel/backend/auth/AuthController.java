package com.AdminPanel.backend.auth;

import com.AdminPanel.backend.auth.dto.LoginRequest;
import com.AdminPanel.backend.auth.dto.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req, HttpServletResponse res){

        try{
            String token = authService.login(req.getEmail(), req.getPassword());
            Cookie cookie = new Cookie("TOKEN", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); //true production
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);

            res.addCookie(cookie);

            return new LoginResponse(req.getEmail(), "logged in");
        } catch (Exception exception){
            res.setStatus(401);
            return new LoginResponse("", "Login failed");
        }
    }

        @GetMapping("/logout")
        public String logout(HttpServletResponse res){
            Cookie cookie = new Cookie("TOKEN", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);

            res.addCookie(cookie);

            return "Log out";
        }

        @GetMapping("/me")
        public LoginResponse auth(@AuthenticationPrincipal UserDetails user, HttpServletResponse res){

            if(user == null) {
                res.setStatus(401);
                return new LoginResponse("", "Auth filed");
            }
            else return new LoginResponse(user.getUsername(), "logged in");
        }

}

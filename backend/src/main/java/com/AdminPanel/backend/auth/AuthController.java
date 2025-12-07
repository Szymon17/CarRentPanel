package com.AdminPanel.backend.auth;

import com.AdminPanel.backend.auth.dto.LoginRequest;
import com.AdminPanel.backend.auth.dto.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);

            res.addCookie(cookie);

            return new LoginResponse("logged in");
        } catch (Exception exception){
            return  new LoginResponse("Login failed");
        }

    }

}

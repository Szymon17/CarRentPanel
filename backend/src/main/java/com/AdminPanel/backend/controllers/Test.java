package com.AdminPanel.backend.controllers;

import com.AdminPanel.backend.auth.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.Request;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class Test {
    @GetMapping("/test")
    public LoginResponse Test(HttpServletRequest req, HttpServletResponse res){
        return  new LoginResponse("test");
    }
}

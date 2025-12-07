package com.AdminPanel.backend.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHasher {
    public static void main(String[] args){
        if (args.length < 1) {
            System.out.println("Provide correct password argument: java PasswordHasher <your password>");
            return;
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String password = args[0];

        String hashedPassword = passwordEncoder.encode(password);

        System.out.println("Your hashed password is: " + hashedPassword);
    }
}

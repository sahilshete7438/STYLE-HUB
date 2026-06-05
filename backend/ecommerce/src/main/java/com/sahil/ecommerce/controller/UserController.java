package com.sahil.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sahil.ecommerce.entity.User;
import com.sahil.ecommerce.repository.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository repo;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return repo.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        User existingUser = repo.findByEmail(user.getEmail());

        if(existingUser != null &&
           existingUser.getPassword().equals(user.getPassword())) {

            return existingUser;
        }

        return null;
    }
}
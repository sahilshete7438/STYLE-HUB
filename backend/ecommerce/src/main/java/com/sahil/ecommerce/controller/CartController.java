package com.sahil.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sahil.ecommerce.entity.Cart;
import com.sahil.ecommerce.repository.CartRepository;

@RestController
@RequestMapping("/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartRepository repo;

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return repo.save(cart);
    }

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public String removeCartItem(@PathVariable Long id) {
        repo.deleteById(id);
        return "Item Removed";
    }
}
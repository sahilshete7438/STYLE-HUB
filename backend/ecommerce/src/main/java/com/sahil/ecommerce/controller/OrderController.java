package com.sahil.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sahil.ecommerce.entity.OrderItem;
import com.sahil.ecommerce.repository.OrderRepository;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @PostMapping
    public OrderItem placeOrder(
            @RequestBody OrderItem order) {

        order.setStatus("Pending");
        
        if (order.getPaymentMethod() == null) {
            order.setPaymentMethod("COD");
        }
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("Pending");
        }

        return repo.save(order);

    }

    @PutMapping("/{id}/{status}")
    public OrderItem updateStatus(
            @PathVariable Long id,
            @PathVariable String status) {

        OrderItem order = repo.findById(id).orElse(null);

        if (order != null) {
            order.setStatus(status);
            return repo.save(order);
        }

        return null;
    }

    @GetMapping
    public List<OrderItem> getAllOrders() {
        return repo.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<OrderItem> getUserOrders(
            @PathVariable Long userId) {

        return repo.findByUserId(userId);
    }
}
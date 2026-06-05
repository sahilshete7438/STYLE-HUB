package com.sahil.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sahil.ecommerce.entity.OrderItem;

public interface OrderRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByUserId(Long userId);
}
package com.sahil.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sahil.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByGender(String gender);
}
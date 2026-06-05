package com.sahil.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sahil.ecommerce.entity.Product;
import com.sahil.ecommerce.repository.ProductRepository;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @GetMapping("/men")
    public List<Product> getMenProducts() {
        return repo.findByGender("Men");
    }

    @GetMapping("/women")
    public List<Product> getWomenProducts() {
        return repo.findByGender("Women");
    }

    @GetMapping("/kids")
    public List<Product> getKidsProducts() {
        return repo.findByGender("Kids");
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setImage(productDetails.getImage());
        product.setCategory(productDetails.getCategory());
        product.setGender(productDetails.getGender());
        product.setStock(productDetails.getStock());
        return repo.save(product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        repo.deleteById(id);
        return "Product Deleted";
    }
}
package com.sahil.ecommerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.sahil.ecommerce.entity.Review;
import com.sahil.ecommerce.repository.ReviewRepository;

@RestController
@RequestMapping("/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewRepository repo;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        if (review.getAuthor() == null || review.getAuthor().trim().isEmpty()) {
            review.setAuthor("Anonymous");
        }
        return repo.save(review);
    }

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return repo.findByProductId(productId);
    }
}

package com.not_band.controller;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;


@RestController
public class ImageRedirectController {

    private static final String PREFIX = "/api/v1/not_band/images";

    @Value("${image.base-url}")
    private String baseUrl;

    @GetMapping(PREFIX + "/**")
    public ResponseEntity<Void> redirect(HttpServletRequest request) {
        String path = request.getRequestURI().substring(PREFIX.length());
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(baseUrl + path))
                .build();
    }
}
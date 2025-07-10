package com.not_band.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {
    
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    //테스트~~~~~
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.debug("Test endpoint was hit.");
        return ResponseEntity.ok("테스트 성공");
    }
}

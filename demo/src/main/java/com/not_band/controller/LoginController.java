package com.not_band.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.entity.LoginEntity;
import com.not_band.service.Login.LoginService;

@RestController
@RequestMapping("/api/v1/not_band/")
public class LoginController {

    @Autowired
    private LoginService loginService;

    // 전체 로그인 기록 조회
    @GetMapping("/login/records")
    public ResponseEntity<List<LoginEntity>> getAllLoginRecords() {
        List<LoginEntity> loginRecords = loginService.getAllLoginRecords();
        return ResponseEntity.ok(loginRecords);
    }
}
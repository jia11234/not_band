package com.not_band.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.entity.LoginHistoryEntity;
import com.not_band.service.history.LoginHistoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/v1/not_band/")
public class LoginHistoryController {

    @Autowired
    private LoginHistoryService loginService;

    // 전체 로그인 기록 조회
    @GetMapping("/login/records")
    @Operation(summary = "전체 로그인 기록 조회", description = "전체 로그인 기록을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "로그인 조회 성공"
    )
    public ResponseEntity<List<LoginHistoryEntity>> getAllLoginRecords() {
        List<LoginHistoryEntity> loginRecords = loginService.getAllLoginRecords();
        return ResponseEntity.ok(loginRecords);
    }
}
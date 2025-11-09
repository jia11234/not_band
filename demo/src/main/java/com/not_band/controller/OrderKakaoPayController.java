package com.not_band.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.not_band.service.order.OrderKakaoPayService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/not_band/pay")
public class OrderKakaoPayController {
    private final OrderKakaoPayService kakaoPayService;

    //결제 준비
    @GetMapping("/ready")
    @Operation(summary = "카카오페이 결제", description = "결제 정보로 카카오페이  결제합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "결제 성공"
    )
    public String kakaoPayReady    (
    @RequestParam("userId") String userId,
    @RequestParam("itemName") String itemName,
    @RequestParam("quantity") int quantity,
    @RequestParam("amount") int amount,
    @RequestParam("ordNo") int ordNo,
    @RequestParam("memId") String memId) {
        return kakaoPayService.kakaoPayReady(userId, itemName, quantity, amount, ordNo, memId);
    }
    
}

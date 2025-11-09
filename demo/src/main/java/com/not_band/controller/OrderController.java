package com.not_band.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.dto.request.order.OrderRequestDto;
import com.not_band.dto.response.order.OrderResponseDto;
import com.not_band.service.order.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/v1/not_band/order")
public class OrderController {
     
    @Autowired
    private OrderService orderService;

    //주문 추가
    @PostMapping("/add")
    @Operation(summary = "주문 하기", description = "주문을 추가합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "주문 추가 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "(주문 번호 반환)"
            )
        )
    )
    public ResponseEntity<Integer> addOrder(@RequestBody OrderRequestDto orderRequestDto) {
        System.out.println("받은 주문 값: " + orderRequestDto);
        int ordNo = orderService.addOrder(orderRequestDto);
        return ResponseEntity.ok(ordNo);
    }

    //사용자 주문 조회
    @Operation(summary = "사용자별 주문 조회", description = "사용자별 주문을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "주문 조회 성공"
    )
    @GetMapping("/user/{memId}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByMemId(@PathVariable("memId") String memId) {
        List<OrderResponseDto> orders = orderService.getOrdersByMemId(memId);
        return ResponseEntity.ok(orders);
    }

    //주문 전체 조회
    @GetMapping("/all")
    @Operation(summary = "주문 전체 조회", description = "주문 전체를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "주문 전체 조회 성공"
    )
    public List<OrderResponseDto> getAllOrders() {
        return orderService.getAllOrders(); 
    }

    //주문 번호로 주문 조회
    @GetMapping("/{ordNo}")
    @Operation(summary = "주문 번호로 주문을 조회합니다.", description = "주문 번호로 주문을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "주문 번호로 주문 조회 성공"
    )
    public ResponseEntity<List<OrderResponseDto>> getOrdersByOrdNo(@PathVariable("ordNo") int ordNo) {
        List<OrderResponseDto> orders = orderService.getOrdersByOrdNo(ordNo);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();  
        }
        return ResponseEntity.ok(orders);  
    }
    
}

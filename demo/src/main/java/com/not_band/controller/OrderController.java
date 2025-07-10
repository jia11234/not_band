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

@RestController
@RequestMapping("/api/v1/not_band/order")
public class OrderController {
     
    @Autowired
    private OrderService orderService;

    //주문 추가
    @PostMapping("/add")
    public ResponseEntity<Integer> addOrder(@RequestBody OrderRequestDto orderRequestDto) {
        System.out.println("받은 주문 값: " + orderRequestDto);
        int ordNo = orderService.addOrder(orderRequestDto);
        return ResponseEntity.ok(ordNo);
    }

    //사용자 주문 조회
    @GetMapping("/user/{memId}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByMemId(@PathVariable("memId") String memId) {
        List<OrderResponseDto> orders = orderService.getOrdersByMemId(memId);
        return ResponseEntity.ok(orders);
    }

    //주문 전체 조회
    @GetMapping("/all")
    public List<OrderResponseDto> getAllOrders() {
        return orderService.getAllOrders(); 
    }

    //주문 번호로 주문 조회
    @GetMapping("/{ordNo}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByOrdNo(@PathVariable("ordNo") int ordNo) {
        List<OrderResponseDto> orders = orderService.getOrdersByOrdNo(ordNo);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();  
        }
        return ResponseEntity.ok(orders);  
    }
    
}

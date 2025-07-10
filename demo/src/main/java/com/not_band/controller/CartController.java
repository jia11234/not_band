package com.not_band.controller;

import com.not_band.dto.request.cart.CartRequestDto;
import com.not_band.service.cart.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/not_band/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // 장바구니에 상품 추가
    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(@RequestBody CartRequestDto cartRequestDto) {
        cartService.addProductToCart(cartRequestDto);
        return ResponseEntity.ok("Product added to cart successfully");
    }

    // 특정 회원의 장바구니 조회
    @GetMapping("/user/{memId}")
    public ResponseEntity<List<CartRequestDto>> getCartByUser(@PathVariable("memId") String memId) {
        List<CartRequestDto> cartItems = cartService.getCartByUser(memId);
        return ResponseEntity.ok(cartItems);
    }

    // 특정 회원의 장바구니 갯수 조회
    @GetMapping("/user/{memId}/count")
    public ResponseEntity<Long> getCartCountByUser(@PathVariable("memId") String memId) {
        Long count = cartService.getCartCountByUser(memId);
        return ResponseEntity.ok(count);
    }

    // 장바구니에서 상품 제거
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeProductFromCart(@RequestBody CartRequestDto cartRequestDto) {
        cartService.removeProductFromCart(cartRequestDto);
        return ResponseEntity.ok("Product removed from cart successfully");
    }

    // 수량 업데이트 (수량 변경)
    @PatchMapping("/updateQuantity")
    public ResponseEntity<String> updateQuantity(@RequestBody CartRequestDto cartRequestDto) {
        cartService.updateQuantity(cartRequestDto);
        return ResponseEntity.ok("Quantity updated successfully");
    }

    // 장바구니 전체 삭제
    @DeleteMapping("/removeAll/{memId}")
    public ResponseEntity<String> removeAllProductsFromCart(@PathVariable("memId") String memId) {
        cartService.removeAllProductsFromCart(memId);
        return ResponseEntity.ok("All products removed from cart successfully");
    }

    // 체크 상태 변경
    @PatchMapping("/cartChecked")
    public ResponseEntity<String> updateCartChecked(@RequestBody CartRequestDto cartRequestDto) {
        try {
            cartService.updateCartChecked(cartRequestDto);
            return ResponseEntity.ok("check updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    //장바구니 전체 체크
    @PutMapping("/cartCheckedAll")
    public ResponseEntity<Void> updateCartCheckedAll(
        @RequestParam("memId") String memId, 
        @RequestParam(value = "selectAll", required = false, defaultValue = "false") Boolean selectAll) {
        cartService.updateCartCheckedAll(memId, selectAll);
        return ResponseEntity.ok().build();
    }
}

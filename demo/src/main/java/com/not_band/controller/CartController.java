package com.not_band.controller;

import com.not_band.dto.request.cart.CartRequestDto;
import com.not_band.service.cart.CartService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

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
    @Operation(summary = "장바구니에 상품 추가", description = "장바구니에 상품을 추가합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "장바구니에 상품 추가 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "장바구니에 상품 추가 성공"
            )
        )
    )
    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(@RequestBody CartRequestDto cartRequestDto) {
        cartService.addProductToCart(cartRequestDto);
        return ResponseEntity.ok("장바구니에 상품 추가 성공");
    }

    // 특정 회원의 장바구니 조회
    @Operation(summary = "아이디별 장바구니 조회", description = "아이디별 장바구니를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "장바구니 조회 성공"
    )
    @GetMapping("/user/{memId}")
    public ResponseEntity<List<CartRequestDto>> getCartByUser(@PathVariable("memId") String memId) {
        List<CartRequestDto> cartItems = cartService.getCartByUser(memId);
        return ResponseEntity.ok(cartItems);
    }

    // 특정 회원의 장바구니 갯수 조회
    @Operation(summary = "아이디별 장바구니 갯수 조회", description = "아이디별 장바구니 갯수를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "장바구니 갯수 조회 성공"
    )
    @GetMapping("/user/{memId}/count")
    public ResponseEntity<Long> getCartCountByUser(@PathVariable("memId") String memId) {
        Long count = cartService.getCartCountByUser(memId);
        return ResponseEntity.ok(count);
    }

    // 장바구니에서 상품 제거
    @Operation(summary = "장바구니에서 상품 제거", description = "장바구니에서 상품을 제거합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "장바구니 삭제 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "장바구니 삭제 성공"
            )
        )
    )
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeProductFromCart(@RequestBody CartRequestDto cartRequestDto) {
        cartService.removeProductFromCart(cartRequestDto);
        return ResponseEntity.ok("장바구니 삭제 성공");
    }

    // 수량 업데이트 (수량 변경)
    @Operation(summary = "장바구니에서 상품 수량 변경", description = "장바구니에서 상품 수량을 변경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "수량 변경 완료",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "수량 변경 완료"
            )
        )
    )
    @PatchMapping("/updateQuantity")
    public ResponseEntity<String> updateQuantity(@RequestBody CartRequestDto cartRequestDto) {
        cartService.updateQuantity(cartRequestDto);
        return ResponseEntity.ok("수량 변경 성공");
    }

    // 장바구니 전체 삭제
    @Operation(summary = "아이디별 장바구니 전체 삭제", description = "아이디별 장바구니 전체 삭제합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "장바구니 전체 삭제 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "장바구니 전체 삭제 성공"
            )
        )
    )
    @DeleteMapping("/removeAll/{memId}")
    public ResponseEntity<String> removeAllProductsFromCart(@PathVariable("memId") String memId) {
        cartService.removeAllProductsFromCart(memId);
        return ResponseEntity.ok("장바구니 전체 삭제 성공");
    }

    // 체크 상태 변경
    @Operation(summary = "장바구니 체크 상태 변경", description = "장바구니 체크 상태를 병경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "체크 상태 변경 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "체크 상태 변경 성공"
            )
        )
    )
    @PatchMapping("/cartChecked")
    public ResponseEntity<String> updateCartChecked(@RequestBody CartRequestDto cartRequestDto) {
        try {
            cartService.updateCartChecked(cartRequestDto);
            return ResponseEntity.ok("체크 상태 변경 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    //장바구니 전체 체크
    @Operation(summary = "장바구니 전체 체크 상태 변경", description = "장바구니 전체 체크 상태를 병경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "전체 체크 상태 변경 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "전체 체크 상태 변경 성공"
            )
        )
    )
    @PutMapping("/cartCheckedAll")
    public ResponseEntity<String> updateCartCheckedAll(
        @RequestParam("memId") String memId, 
        @RequestParam(value = "selectAll", required = false, defaultValue = "false") Boolean selectAll) {
        cartService.updateCartCheckedAll(memId, selectAll);
        return ResponseEntity.ok("전체 체크 상태 변경 성공");
    }
}

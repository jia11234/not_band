package com.not_band.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.not_band.dto.response.product.ProductResponseDto;
import com.not_band.service.product.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/not_band/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    //상품 전체 조회
    @GetMapping
    public List<ProductResponseDto> getAllProducts() {
        return productService.getAllProducts();
    }
    
    //상품 수정
    @PutMapping("/change/{prdNo}")
    public ResponseEntity<String> updateProduct(
            @PathVariable("prdNo") String prdNo,
            @RequestBody ProductResponseDto dto) {
        System.out.println("Received ProductResponseDto: " + dto);
        dto.setPrdNo(prdNo); // 경로변수 → DTO에 세팅
        productService.updateProduct(dto);
        return ResponseEntity.ok("상품 수정 완료");
    }

    //카테고리별 조회
    @GetMapping("/category/{category}")
    public List<ProductResponseDto> getProductsByCategory(
            @PathVariable("category") String category,
            @RequestParam(value = "sortType", required = false) String sortType) {
        if (sortType == null) {
            sortType = ""; // 기본값을 빈 문자열로 설정하거나, null 값으로 처리할 수 있습니다.
        }
        return productService.getProductsByCategory(category, sortType);
    }
    
    //상품 상세 조회
    @GetMapping("/detail/{prdNo}")
    public ProductResponseDto getProductsByPrdNo(@PathVariable("prdNo") String prdNo) {
        return productService.getProductsByPrdNo(prdNo);
    }

    //상품 추가
    @PostMapping("new")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerProduct(@RequestBody ProductResponseDto productResponseDto) {
        productService.registeProduct(productResponseDto);
    }

    //상품 삭제
    @DeleteMapping("delete/{prdNo}")
    public ResponseEntity<?> deleteProduct(@PathVariable("prdNo") String prdNo) {
        productService.deleteProduct(prdNo);
        return ResponseEntity.ok().build();
    }
}

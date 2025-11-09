package com.not_band.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.not_band.common.Swagger.ApiResponseNP;
import com.not_band.common.Swagger.ApiResponseSuccess;
import com.not_band.dto.response.product.ProductResponseDto;
import com.not_band.service.product.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/not_band/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    //상품 전체 조회
    @Operation(summary = "상품 전체 조회", description = "상품 전체 리스트를 출력합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상품 전체 리스트 출력 성공"
    )
    @GetMapping
    public List<ProductResponseDto> getAllProducts() {
        return productService.getAllProducts();
    }
    
    //상품 수정
    @Operation(summary = "상품 수정", description = "상품 번호로 상품을 수정 변경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상품 수정 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "상품 수정 완료"
            )
        )
    )
    @ApiResponseNP
    @PutMapping("/change/{prdNo}")
    public ResponseEntity<String> updateProduct(
            @PathVariable("prdNo") String prdNo,
            @RequestBody ProductResponseDto dto) {
        System.out.println("Received ProductResponseDto: " + dto);
        dto.setPrdNo(prdNo); 
        productService.updateProduct(dto);
        return ResponseEntity.ok("상품 수정 완료");
    }

    //카테고리별 조회
    @Operation(summary = "카테고리별 상품 조회", description = "카테고리별 상품 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상품 조회 성공"
    )
    @GetMapping("/category/{category}")
    public List<ProductResponseDto> getProductsByCategory(
            @PathVariable("category") String category,
            @RequestParam(value = "sortType", required = false) String sortType) {
        if (sortType == null) {
            sortType = ""; 
        }
        return productService.getProductsByCategory(category, sortType);
    }
    
    //상품 상세 조회
    @Operation(summary = "상품 상세 조회", description = "상품 상세를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상품 상세 조회 성공"
    )
    @GetMapping("/detail/{prdNo}")
    public ProductResponseDto getProductsByPrdNo(@PathVariable("prdNo") String prdNo) {
        return productService.getProductsByPrdNo(prdNo);
    }

    //상품 추가
    @Operation(summary = "상품 추가", description = "상품 정보를 입력하여 상품을 추가합니다.")
    @ApiResponseSuccess
    @PostMapping("new")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerProduct(@RequestBody ProductResponseDto productResponseDto) {
        productService.registeProduct(productResponseDto);
    }

    //상품 삭제
    @Operation(summary = "상품 삭제", description = "상품 번호로 해당 상품이 삭제됩니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상품 삭제 완료",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "삭제 완료"
            )
        )
    )
    @DeleteMapping("delete/{prdNo}")
    public ResponseEntity<?> deleteProduct(@PathVariable("prdNo") String prdNo) {
        productService.deleteProduct(prdNo);
        return ResponseEntity.ok("삭제 완료");
    }
}

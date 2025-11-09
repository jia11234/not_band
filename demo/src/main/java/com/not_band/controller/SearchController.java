package com.not_band.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.dto.search.SearchResultDto;
import com.not_band.service.search.SearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/v1/not_band")
public class SearchController {
    @Autowired
    private SearchService searchService;

    // 검색어 하나로 이름, 카테고리, 태그를 모두 검색
    @GetMapping("/search")
    @Operation(summary = "검색", description = "검색어로 이름, 카테고리, 태그등을 검색합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "검색 성공"
    )
    public ResponseEntity<List<SearchResultDto>> searchProducts(
            @RequestParam("keyword") String keyword) {

        // 검색어로 상품을 검색하여 결과 반환
        List<SearchResultDto> result = searchService.searchProducts(keyword);
        return ResponseEntity.ok(result);
    }
}

package com.not_band.controller;


import com.not_band.common.Swagger.ApiResponseNP;
import com.not_band.common.Swagger.ApiResponseVF;
import com.not_band.dto.request.resell.ResellProductRequestDto;
import com.not_band.dto.response.resell.ResellProductResponseDto;
import com.not_band.entity.ResellEntity;
import com.not_band.service.resell.ResellService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/not_band/resell")
@RequiredArgsConstructor
public class ResellController {

    private final ResellService resellService;

    //중고 상품 등록
    @Operation(summary = "중고 상품 등록", description = "중고 상품 등록 성공 여부")
    @ApiResponse(
        responseCode = "200",
        description = "중고 상품 등록 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "등록 완료."
            )
        )
    ) 
    @ApiResponseVF
    @PostMapping("/register")
    public ResponseEntity<?> registerProduct(@RequestBody ResellProductRequestDto dto) {
        resellService.registerResell(dto);
        return ResponseEntity.ok("등록 완료");
    }

    //중고 상품 목록 조회
    @Operation(summary = "중고 상품 전체 리스트", description = "중고 상품 전체 리스트를 출력합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "중고 상품 전체 리스트 출력 성공"
    )
    @GetMapping("/list")
    public ResponseEntity<List<ResellEntity>> getAllResellProducts() {
        List<ResellEntity> resellList = resellService.getAllResellProducts();
        return ResponseEntity.ok(resellList);
    }

    //중고 상품 상세 조회
    @GetMapping("/{resId}")
    @Operation(summary = "중고 상품 번호로 중고 상품 상세 조회", description = "중고 상품 번호로 해당 중고 상품 상세를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "상세 조회 성공"
    )
    public ResellProductResponseDto getResellByResId(@PathVariable("resId")Integer resId){
        return resellService.getResellByResId(resId);
    }

    //조회수
    @Operation(summary = "조회수", description = "조회수 조회 성공 여부")
    @ApiResponse(
        responseCode = "200",
        description = "조회 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "조회 성공."
            )
        )
    ) 
    @ApiResponseVF
    @PostMapping("/view/{resId}")
    public ResponseEntity<?> increaseViewCount(@PathVariable("resId")Integer resId) {
        resellService.increaseViewCount(resId);
        return ResponseEntity.ok().build();
    }

    //중고 사용자별 조회
    @GetMapping("/list/{memId}")
    @Operation(summary = "사용자별 중고 상품 조회", description = "사용자별로 중고 상품을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "중고 상품 조회 성공"
    )
    public ResponseEntity<?> getResellListByMemId(@PathVariable("memId") String memId) {
        List<ResellEntity> resells = resellService.getAllResellProductsByMemId(memId);
        return ResponseEntity.ok(resells);
    }

    //중고 상품 상태 변경
    @PutMapping("/{resId}/status")
    @Operation(summary = "중고 상품 상태 변경", description = "중고 상품 상태를 변경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "리뷰 수정 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "리뷰 수정 성공"
            )
        )
    )
    @ApiResponseNP
    public ResponseEntity<Void> updateResComment(
        @PathVariable("resId") Integer resId,
        @RequestParam("resComment") int resComment
    ) {
        resellService.updateResComment(resId, resComment);
        return ResponseEntity.ok().build();
    }

    //중고 상품 삭제
    @Operation(summary = "중고 상품 삭제", description = "중고 상품 번호로 해당 상품이 삭제됩니다.")
    @ApiResponse(
        responseCode = "200",
        description = "중고 상품 삭제 완료",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "삭제 완료"
            )
        )
    )
    @DeleteMapping("/delete/{resId}")
    public ResponseEntity<String> deleteResellById(@PathVariable("resId") Integer resId) {
        resellService.deleteResellById(resId);
        return ResponseEntity.ok("삭제 완료");
    }
    
    
}
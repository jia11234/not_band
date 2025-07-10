package com.not_band.controller;


import com.not_band.dto.request.resell.ResellProductRequestDto;
import com.not_band.dto.response.resell.ResellProductResponseDto;
import com.not_band.entity.ResellEntity;
import com.not_band.service.resell.ResellService;

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
    @PostMapping("/register")
    public ResponseEntity<?> registerProduct(@RequestBody ResellProductRequestDto dto) {
        resellService.registerResell(dto);
        return ResponseEntity.ok("등록 완료");
    }

    //중고 상품 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<ResellEntity>> getAllResellProducts() {
        List<ResellEntity> resellList = resellService.getAllResellProducts();
        return ResponseEntity.ok(resellList);
    }

    //중고 상품 상세 조회
    @GetMapping("/{resId}")
    public ResellProductResponseDto getResellByResId(@PathVariable("resId")Integer resId){
        return resellService.getResellByResId(resId);
    }

    //조회수
    @PostMapping("/view/{resId}")
    public ResponseEntity<?> increaseViewCount(@PathVariable("resId")Integer resId) {
        resellService.increaseViewCount(resId);
        return ResponseEntity.ok().build();
    }

    //중고 사용자별 조회
    @GetMapping("/list/{memId}")
    public ResponseEntity<?> getResellListByMemId(@PathVariable("memId") String memId) {
        List<ResellEntity> resells = resellService.getAllResellProductsByMemId(memId);
        return ResponseEntity.ok(resells);
    }

    //중고 상품 상태 변경
    @PutMapping("/{resId}/status")
    public ResponseEntity<Void> updateResComment(
        @PathVariable("resId") Integer resId,
        @RequestParam("resComment") int resComment
    ) {
        resellService.updateResComment(resId, resComment);
        return ResponseEntity.ok().build();
    }

    //중고 상품 삭제
    @DeleteMapping("/delete/{resId}")
    public ResponseEntity<String> deleteResellById(@PathVariable("resId") Integer resId) {
        resellService.deleteResellById(resId);
        return ResponseEntity.ok("삭제 완료");
    }
    
    
}
package com.not_band.back.controller;


import com.not_band.back.dto.request.resell.ResellProductRequestDto;
import com.not_band.back.dto.response.resell.ResellProductResponseDto;
import com.not_band.back.entity.ResellEntity;
import com.not_band.back.service.resell.ResellService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/not_band/resell")
@RequiredArgsConstructor
public class ResellController {

    private final ResellService resellService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProduct(@RequestBody ResellProductRequestDto dto) {
        resellService.registerResell(dto);
        return ResponseEntity.ok("등록 완료");
    }

    @GetMapping("/list")
    public ResponseEntity<List<ResellEntity>> getAllResellProducts() {
        List<ResellEntity> resellList = resellService.getAllResellProducts();
        return ResponseEntity.ok(resellList);
    }

    @GetMapping("/{resId}")
    public ResellProductResponseDto getResellByResId(@PathVariable("resId")Integer resId){
        return resellService.getResellByResId(resId);
    }

    @PostMapping("/view/{resId}")
    public ResponseEntity<?> increaseViewCount(@PathVariable("resId")Integer resId) {
        resellService.increaseViewCount(resId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list/{memId}")
    public ResponseEntity<?> getResellListByMemId(@PathVariable("memId") String memId) {
        List<ResellEntity> resells = resellService.getAllResellProductsByMemId(memId);
        return ResponseEntity.ok(resells);
    }

    @PutMapping("/{resId}/status")
    public ResponseEntity<Void> updateResComment(
        @PathVariable("resId") Integer resId,
        @RequestParam("resComment") int resComment
    ) {
        resellService.updateResComment(resId, resComment);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{resId}")
    public ResponseEntity<String> deleteResellById(@PathVariable("resId") Integer resId) {
        resellService.deleteResellById(resId);
        return ResponseEntity.ok("삭제 완료");
    }
    
    
}
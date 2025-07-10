package com.not_band.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.dto.request.wish.WishRequestDto;
import com.not_band.repository.WishRepository;
import com.not_band.service.wish.WishService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/wish")
public class WishController {

    private final WishService wishService;
    private final WishRepository wishRepository;

    //찜 상태 변경
    @PostMapping("/toggle")
    public ResponseEntity<String> toggleWish(@RequestBody WishRequestDto requestDto) {
        boolean isWished = wishService.toggleWish(requestDto.getMemId(), requestDto.getResId());

        if (isWished) {
            return ResponseEntity.ok("찜 추가됨");
        } else {
            return ResponseEntity.ok("찜 삭제됨");
        }
    }

    //찜 목록 조회
    @GetMapping("check")
    public ResponseEntity<Boolean> checkWish(
        @RequestParam(name = "memId") String memId,
        @RequestParam(name = "resId") Integer resId) {
        boolean isWished = wishRepository.findByMemIdAndResId(memId, resId).isPresent();
        return ResponseEntity.ok(isWished);
    }

    //사용자별 찜 목록 조회
    @GetMapping("/{memId}")
    public List<WishRequestDto> getUserWishList(@PathVariable("memId") String memId) {
        return wishService.getUserByWish(memId);
    }
}

package com.not_band.back.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.back.dto.request.wish.WishRequestDto;
import com.not_band.back.repository.WishRepository;
import com.not_band.back.service.wish.WishService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/wish")
public class WishController {

    private final WishService wishService;
    private final WishRepository wishRepository;

    @PostMapping("/toggle")
    public ResponseEntity<String> toggleWish(@RequestBody WishRequestDto requestDto) {
        boolean isWished = wishService.toggleWish(requestDto.getMemId(), requestDto.getResId());

        if (isWished) {
            return ResponseEntity.ok("찜 추가됨");
        } else {
            return ResponseEntity.ok("찜 삭제됨");
        }
    }

    @GetMapping("check")
    public ResponseEntity<Boolean> checkWish(
        @RequestParam(name = "memId") String memId,
        @RequestParam(name = "resId") Integer resId) {
        boolean isWished = wishRepository.findByMemIdAndResId(memId, resId).isPresent();
        return ResponseEntity.ok(isWished);
    }

    @GetMapping("/{memId}")
    public List<WishRequestDto> getUserWishList(@PathVariable("memId") String memId) {
        return wishService.getUserByWish(memId);
    }
}

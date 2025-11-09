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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/wish")
public class WishController {

    private final WishService wishService;
    private final WishRepository wishRepository;

    //찜 상태 변경
    @Operation(summary = "찜 상태 변경", description = "찜 상태를 변경합니다")
    @ApiResponse(
        responseCode = "200",
        description = "상태 변경 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "찜 추가됨 or 찜 삭제됨"
            )
        )
    )
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
    @Operation(summary = "찜 조회", description = "해당 상품의 찜을 눌렀는지 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "조회 성공"
    )
    @GetMapping("check")
    public ResponseEntity<Boolean> checkWish(
        @RequestParam(name = "memId") String memId,
        @RequestParam(name = "resId") Integer resId) {
        boolean isWished = wishRepository.findByMemIdAndResId(memId, resId).isPresent();
        return ResponseEntity.ok(isWished);
    }

    //사용자별 찜 목록 조회
    @Operation(summary = "사용자별 찜 목록 조회", description = "사용자별로 찜 목록을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "조회 성공"
    )
    @GetMapping("/{memId}")
    public List<WishRequestDto> getUserWishList(@PathVariable("memId") String memId) {
        return wishService.getUserByWish(memId);
    }
}

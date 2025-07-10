package com.not_band.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.dto.request.review.ReviewRequestDto;
import com.not_band.dto.response.review.ReviewResponseDto;
import com.not_band.entity.ReviewEntity;
import com.not_band.service.review.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/not_band/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    //리뷰 등록
    @PostMapping("/register")
    public ResponseEntity<?> registerReivew(@RequestBody ReviewRequestDto dto) {
        reviewService.registerReview(dto);
        return ResponseEntity.ok("등록 완료");
    }

    //리뷰 전체 리스트
    @GetMapping("/list")
    public ResponseEntity<List<ReviewEntity>> getAllReview() {
        List<ReviewEntity> resellList = reviewService.getAllReview();
        return ResponseEntity.ok(resellList);
    }

    //리뷰 (리뷰번호)조회
    @GetMapping("/{revNo}")
    public ReviewResponseDto getReviewByRevNo(@PathVariable("revNo")Integer revNo){
        return reviewService.getReviewByRevNo(revNo);
    }

    //사용자별 리뷰 조회
    @GetMapping("/user/{memId}")
    public List<ReviewResponseDto> getReviewsByUser(@PathVariable("memId") String memId) {
        return reviewService.getReviewByUser(memId);
    }

    //상품별 리뷰 조회
    @GetMapping("/product/{prdNo}")
    public List<ReviewResponseDto> getReviewByPrdNo(@PathVariable("prdNo") String prdNo) {
        return reviewService.getReviewByPrdNo(prdNo);
    }

    //리뷰 수정
    @PutMapping("/update/{revNo}")
    public ResponseEntity<?> updateReview(
            @PathVariable Integer revNo,
            @RequestBody ReviewRequestDto dto) {
        reviewService.updateReview(revNo, dto);
        return ResponseEntity.ok("리뷰 수정 완료");
    }

    //리뷰 삭제
    @DeleteMapping("/{revNo}")
    public ResponseEntity<?> deleteReview(@PathVariable("revNo") Integer revNo) {
        reviewService.deleteReview(revNo);
        return ResponseEntity.ok("리뷰 삭제 완료");
    }
    
}

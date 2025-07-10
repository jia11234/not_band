package com.not_band.service.review;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.not_band.dto.request.review.ReviewRequestDto;
import com.not_band.dto.response.review.ReviewResponseDto;
import com.not_band.entity.ReviewEntity;
import com.not_band.entity.UserEntity;
import com.not_band.repository.ReviewRepository;
import com.not_band.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private static final String UPLOAD_DIR = "/upload/review/";
    private final UserRepository userRepository;

    //리뷰 등록
    @Transactional
    public void registerReview(ReviewRequestDto dto) {
        List<String> base64List = dto.getRevImgUrl();
        List<String> imageUrls = new ArrayList<>();


        if (base64List != null) {
            for (int i = 0; i < base64List.size(); i++) {
                String filename = LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + "_" + i + ".png";
                try {
                    String url = saveBase64Image(base64List.get(i), filename);
                    imageUrls.add(url);
                } catch (IOException e) {
                    e.printStackTrace();
                    imageUrls.add(null); // 실패 시 null
                }
            }
        }

        dto.setRevImgUrl(imageUrls); // 이미지 URL로 덮어쓰기
        ReviewEntity entity = new ReviewEntity(dto);
        reviewRepository.save(entity);
    }

    //base64 문자열을 url로 변환
    public String saveBase64Image(String base64Data, String filename) throws IOException {
        String base64Image = base64Data.split(",")[1]; // "data:image/png;base64," 제거
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // 폴더가 없다면 자동 생성
        Files.createDirectories(Paths.get(UPLOAD_DIR));

        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.write(filePath, imageBytes);

        return "/images/review/" + filename; // 프론트에서 불러올 경로
    }

    //리뷰 전체 조회
    public List<ReviewEntity> getAllReview() {
        return reviewRepository.findAll();
    }

    //리뷰 번호로 리뷰 조회
    public ReviewResponseDto getReviewByRevNo(Integer revNo){
        return reviewRepository.findByRevNo(revNo)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("없어요 그냥 없는 중고상품"));
    }

    //리뷰 
    private ReviewResponseDto convertToDTO(ReviewEntity review) {
        List<String> imgUrls = new ArrayList<>();
        if (review.getRevImgUrl1() != null) imgUrls.add(review.getRevImgUrl1());
        if (review.getRevImgUrl2() != null) imgUrls.add(review.getRevImgUrl2());
        if (review.getRevImgUrl3() != null) imgUrls.add(review.getRevImgUrl3());
        if (review.getRevImgUrl4() != null) imgUrls.add(review.getRevImgUrl4());
        if (review.getRevImgUrl5() != null) imgUrls.add(review.getRevImgUrl5());
        
        String nickname = userRepository.findById(review.getMemId())
        .map(UserEntity::getNickname) 
        .orElse("알 수 없음");

        return new ReviewResponseDto(
            review.getRevNo(),
            review.getMemId(),
            nickname,
            review.getPrdNo(),
            review.getOrdNo(),
            review.getRevRating(),
            review.getRevContent(),
            imgUrls,
            review.getRevAdd()
        );
    }
    
//회원별 리뷰 조회
public List<ReviewResponseDto> getReviewByUser(String memId) {
    List<ReviewEntity> reviewEntities = reviewRepository.findByMemId(memId);

    return reviewEntities.stream()
     .map(reviewEntity -> {
        // UserEntity에서 닉네임을 조회
        String nickname = userRepository.findById(reviewEntity.getMemId())
            .map(UserEntity::getNickname)  // 닉네임 조회
            .orElse("알 수 없음"); 

            List<String> imgUrls = new ArrayList<>();
            

            if (reviewEntity.getRevImgUrl1() != null) imgUrls.add(reviewEntity.getRevImgUrl1());
            if (reviewEntity.getRevImgUrl2() != null) imgUrls.add(reviewEntity.getRevImgUrl2());
            if (reviewEntity.getRevImgUrl3() != null) imgUrls.add(reviewEntity.getRevImgUrl3());
            if (reviewEntity.getRevImgUrl4() != null) imgUrls.add(reviewEntity.getRevImgUrl4());
            if (reviewEntity.getRevImgUrl5() != null) imgUrls.add(reviewEntity.getRevImgUrl5());

            return new ReviewResponseDto(
                reviewEntity.getRevNo(),
                nickname,
                reviewEntity.getMemId(),
                reviewEntity.getPrdNo(),
                reviewEntity.getOrdNo(),
                reviewEntity.getRevRating(),
                reviewEntity.getRevContent(),
                imgUrls,
                reviewEntity.getRevAdd()
            );
        })
        .collect(Collectors.toList());
}

//상품별 리뷰 조회
public List<ReviewResponseDto> getReviewByPrdNo(String prdNo) {
    List<ReviewEntity> reviewEntities = reviewRepository.findByPrdNo(prdNo);

    return reviewEntities.stream()
        .map(reviewEntity -> {
            String nickname = userRepository.findById(reviewEntity.getMemId())
            .map(UserEntity::getNickname)  // 닉네임 조회
            .orElse("알 수 없음");
            List<String> imgUrls = new ArrayList<>();

            if (reviewEntity.getRevImgUrl1() != null) imgUrls.add(reviewEntity.getRevImgUrl1());
            if (reviewEntity.getRevImgUrl2() != null) imgUrls.add(reviewEntity.getRevImgUrl2());
            if (reviewEntity.getRevImgUrl3() != null) imgUrls.add(reviewEntity.getRevImgUrl3());
            if (reviewEntity.getRevImgUrl4() != null) imgUrls.add(reviewEntity.getRevImgUrl4());
            if (reviewEntity.getRevImgUrl5() != null) imgUrls.add(reviewEntity.getRevImgUrl5());

            return new ReviewResponseDto(
                reviewEntity.getRevNo(),
                nickname,
                reviewEntity.getMemId(),
                reviewEntity.getPrdNo(),
                reviewEntity.getOrdNo(),
                reviewEntity.getRevRating(),
                reviewEntity.getRevContent(),
                imgUrls,
                reviewEntity.getRevAdd()
            );
        })
        .collect(Collectors.toList());
}

//리뷰 수정
public void updateReview(Integer revNo, ReviewRequestDto dto) {
    ReviewEntity review = reviewRepository.findById(revNo)
        .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

    List<String> base64List = dto.getRevImgUrl();
    List<String> imageUrls = new ArrayList<>();

    if (base64List != null && !base64List.isEmpty()) {
        for (int i = 0; i < base64List.size(); i++) {
            String base64 = base64List.get(i);
            if (base64.startsWith("data:image")) {
                // 새로 업로드된 이미지
                String filename = LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + "_" + i + ".png";
                try {
                    String url = saveBase64Image(base64, filename);
                    imageUrls.add(url);
                } catch (IOException e) {
                    e.printStackTrace();
                    imageUrls.add(null);
                }
            } else {
                // 기존 이미지 유지
                imageUrls.add(base64);
            }
        }
    }

    // 내용 수정
    review.setRevContent(dto.getRevContent());
    review.setRevRating(dto.getRevRating());

    // 이미지 필드 개별로 세팅
    if (imageUrls.size() > 0) review.setRevImgUrl1(imageUrls.get(0));
    if (imageUrls.size() > 1) review.setRevImgUrl2(imageUrls.get(1));
    if (imageUrls.size() > 2) review.setRevImgUrl3(imageUrls.get(2));
    if (imageUrls.size() > 3) review.setRevImgUrl4(imageUrls.get(3));
    if (imageUrls.size() > 4) review.setRevImgUrl5(imageUrls.get(4));

    review.setRevAdd(LocalDateTime.now());

    reviewRepository.save(review);
}


//리뷰 삭제
    @Transactional
    public void deleteReview(Integer revNo) {
        ReviewEntity review = reviewRepository.findById(revNo)
            .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        // 1. 이미지 파일들 삭제
        List<String> imageUrls = getImagesFromReviewEntity(review);
        for (String imageUrl : imageUrls) {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            deleteImageFromServer(filename);
        }

        // 2. 리뷰 자체 삭제
        reviewRepository.delete(review);
    }

    public void deleteImageFromServer(String filename) {
        Path filePath = Paths.get(UPLOAD_DIR + filename);  // 이미지 파일 경로
        try {
            Files.deleteIfExists(filePath);  // 파일 삭제
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 삭제에 실패했습니다.");
        }
    }

    public List<String> getImagesFromReviewEntity(ReviewEntity review) {
        List<String> images = new ArrayList<>();
        if (review.getRevImgUrl1() != null) images.add(review.getRevImgUrl1());
        if (review.getRevImgUrl2() != null) images.add(review.getRevImgUrl2());
        if (review.getRevImgUrl3() != null) images.add(review.getRevImgUrl3());
        if (review.getRevImgUrl4() != null) images.add(review.getRevImgUrl4());
        if (review.getRevImgUrl5() != null) images.add(review.getRevImgUrl5());
        return images;
    }
    
}

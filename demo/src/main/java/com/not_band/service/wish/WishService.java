package com.not_band.service.wish;
import org.springframework.stereotype.Service;

import com.not_band.dto.request.wish.WishRequestDto;
import com.not_band.entity.ResellEntity;
import com.not_band.entity.WishEntity;
import com.not_band.repository.ResellRepository;
import com.not_band.repository.WishRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishService {
    
    private final WishRepository wishRepository;
    private final ResellRepository resellRepository;

    // 찜 상태 토글
    public boolean toggleWish(String memId, Integer resId) {
        Optional<WishEntity> existingWish = wishRepository.findByMemIdAndResId(memId, resId);

        if(existingWish.isPresent()) {
            // 이미 찜한 경우 찜 삭제
            wishRepository.delete(existingWish.get());

            // 중고 상품 찜 수 -1 처리
            ResellEntity resell = resellRepository.findById(resId).orElseThrow();
            int currentLikes = resell.getResLike() != null ? resell.getResLike() : 0;
            resell.setResLike(Math.max(0, currentLikes - 1));
            resellRepository.save(resell);

            return false;
        } else {
            // 찜하지 않은 경우 찜 등록
            WishEntity wish = new WishEntity();
            wish.setMemId(memId);
            wish.setResId(resId);
            wishRepository.save(wish);

            // 중고 상품 찜수 +1 처리
            ResellEntity resell = resellRepository.findById(resId).orElseThrow();
            resell.setResLike(resell.getResLike() + 1);
            resellRepository.save(resell);

            return true;
        }
    }

    // 사용자별 찜 목록 조회
    public List<WishRequestDto> getUserByWish(String memId) {
        return wishRepository.findByMemId(memId).stream()
            .map(WishRequestDto::fromEntity)
            .collect(Collectors.toList());
    }
}

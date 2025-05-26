package com.not_band.back.service.wish;
import org.springframework.stereotype.Service;

import com.not_band.back.dto.request.wish.WishRequestDto;
import com.not_band.back.entity.ResellEntity;
import com.not_band.back.entity.WishEntity;
import com.not_band.back.repository.ResellRepository;
import com.not_band.back.repository.WishRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishService {
    
    private final WishRepository wishRepository;
    private final ResellRepository resellRepository;

    public boolean toggleWish(String memId, Integer resId) {
        Optional<WishEntity> existingWish = wishRepository.findByMemIdAndResId(memId, resId);

        if(existingWish.isPresent()) {
            wishRepository.delete(existingWish.get());

            ResellEntity resell = resellRepository.findById(resId).orElseThrow();

            int currentLikes = resell.getResLike() != null ? resell.getResLike() : 0;
            if(currentLikes > 0) {
                resell.setResLike(currentLikes - 1);
            } else {
                resell.setResLike(0);
            }

            resellRepository.save(resell);
            return false;
        } else {
            WishEntity wish = new WishEntity();
            wish.setMemId(memId);
            wish.setResId(resId);
            wishRepository.save(wish);

            ResellEntity resell = resellRepository.findById(resId).orElseThrow();

            resell.setResLike(resell.getResLike() + 1);
            resellRepository.save(resell);

            return true;
        }
    }

    public List<WishRequestDto> getUserByWish(String memId) {
        return wishRepository.findByMemId(memId).stream()
            .map(WishRequestDto::fromEntity)
            .collect(Collectors.toList());
    }
}
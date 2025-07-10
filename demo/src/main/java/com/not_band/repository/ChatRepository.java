package com.not_band.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.entity.ChatEntity;

public interface ChatRepository extends JpaRepository<ChatEntity, Integer> {
    Optional<ChatEntity> findByResIdAndMemId1AndMemId2(Integer resId, String memId1, String memId2);
    List<ChatEntity> findByMemId1OrMemId2(String memId1, String memId2);
    void deleteByResId(Integer resId);
    void deleteByMemId1(String memId);
    void deleteByMemId2(String memId);
    List<ChatEntity> findByResId(Integer resId);
}

package com.not_band.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.not_band.entity.ReviewEntity;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    Optional<ReviewEntity> findByRevNo(Integer revNo);
    List<ReviewEntity> findByMemId(String memId);
    List<ReviewEntity> findByPrdNo(String prdNo);
    void deleteByMemId(String memId);
}

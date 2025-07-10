package com.not_band.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.not_band.entity.WishEntity;

@Repository
public interface WishRepository extends JpaRepository <WishEntity, Integer>{
    Optional<WishEntity> findByMemIdAndResId(String memId, Integer resId);
    List<WishEntity> findByMemId(String memId);
    int countByResId(Integer resId);
    void deleteByMemId(String memId);
    void deleteByResId(Integer resId);
}

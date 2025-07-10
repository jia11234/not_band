package com.not_band.repository;

import com.not_band.entity.ResellEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResellRepository extends JpaRepository<ResellEntity, Integer> {
    Optional<ResellEntity> findByResId(Integer resId);
    List<ResellEntity> findByMemId(String memId);
    void deleteByMemId(String memId);

    @Query("SELECT r FROM ResellEntity r WHERE (r.resPrd LIKE %:keyword% OR r.resCategory LIKE %:keyword% OR r.resTag1 LIKE %:keyword%)")
    List<ResellEntity> searchByProductNameOrCategoryOrTag(@Param("keyword") String keyword);

    @Query("SELECT r FROM ResellEntity r WHERE r.resPrd LIKE %:keyword% OR r.resCategory LIKE %:keyword%")
    List<ResellEntity> searchByProductNameOrCategory(@Param("keyword") String keyword);

    @Query("SELECT r FROM ResellEntity r WHERE r.resPrd LIKE %:keyword% OR r.resCategory LIKE %:keyword%")
    List<ResellEntity> searchByKeyword(@Param("keyword") String keyword);
}

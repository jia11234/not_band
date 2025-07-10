package com.not_band.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.not_band.entity.CartEntity;
import com.not_band.entity.CartId;

import jakarta.transaction.Transactional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, CartId> {
    List<CartEntity> findByMemId(String memId);
    List<CartEntity> findByMemIdAndPrdNo(String memId, String prdNo); // 하나만 삭제
    Long countByMemId(String memId);

    @Transactional
    @Modifying
    @Query("UPDATE CartEntity c SET c.cartChecked = :selectAll WHERE c.memId = :memId")
    void updateCartCheckedAll(@Param("memId") String memId, @Param("selectAll") Boolean selectAll);    
}
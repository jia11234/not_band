package com.not_band.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.not_band.entity.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    Optional<OrderEntity> findById(int ordNo);
    List<OrderEntity> findByMemId(String memId);
    Optional<OrderEntity> findByMemIdAndOrdNo(String memId, int ordNo);
    void deleteByMemId(@Param("memId") String memId);
    List<OrderEntity> findByOrdNo(int ordNo);
}
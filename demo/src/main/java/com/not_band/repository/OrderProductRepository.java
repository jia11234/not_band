package com.not_band.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.not_band.entity.OrderProductEntity;

public interface OrderProductRepository extends JpaRepository<OrderProductEntity, Long> {
    List<OrderProductEntity> findByOrder_OrdNo(int ordNo);
}

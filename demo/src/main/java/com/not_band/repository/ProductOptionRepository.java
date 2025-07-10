package com.not_band.repository;

import java.util.List;

import com.not_band.entity.OptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOptionRepository extends JpaRepository<OptionEntity, Integer> {
    List<OptionEntity> findByPrdNo(String prdNo);
}


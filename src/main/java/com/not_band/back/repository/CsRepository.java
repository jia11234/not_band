package com.not_band.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.back.entity.CsEntity;

public interface CsRepository extends JpaRepository<CsEntity, Integer> {
    
}

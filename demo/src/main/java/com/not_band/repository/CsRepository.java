package com.not_band.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.entity.CsEntity;

public interface CsRepository extends JpaRepository<CsEntity, Integer> {
    
}

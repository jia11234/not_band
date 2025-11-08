package com.not_band.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.entity.LoginHistoryEntity;

public interface LoginHistoryRepository extends JpaRepository<LoginHistoryEntity, Integer> {
}
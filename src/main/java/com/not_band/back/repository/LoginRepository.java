package com.not_band.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.back.entity.LoginEntity;

public interface LoginRepository extends JpaRepository<LoginEntity, Integer> {
}
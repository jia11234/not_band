package com.not_band.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.entity.LoginEntity;

public interface LoginRepository extends JpaRepository<LoginEntity, Integer> {
}
package com.not_band.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.not_band.entity.UserEntity;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    
    UserEntity findByMemId(String memId);

    boolean existsByMemId(String memId);
}


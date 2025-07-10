package com.not_band.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.not_band.entity.CertificationEntity;


@Repository
public interface CertificationRepository extends JpaRepository<CertificationEntity, String>{
    
    CertificationEntity findByMemId(String memId);

    @Transactional
    void deleteByMemId(String memId);

}

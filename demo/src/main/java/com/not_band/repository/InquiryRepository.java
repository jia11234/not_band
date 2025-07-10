package com.not_band.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.entity.InquiryEntity;

public interface InquiryRepository extends JpaRepository<InquiryEntity, Integer> {
    Optional<InquiryEntity> findByMemIdAndSelId(String memId, String selId);
    List<InquiryEntity> findByMemId(String memId); 
    void deleteByMemId(String memId);
}
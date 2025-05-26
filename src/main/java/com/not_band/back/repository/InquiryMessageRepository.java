package com.not_band.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.not_band.back.entity.InquiryMessageEntity;

public interface InquiryMessageRepository extends JpaRepository<InquiryMessageEntity, Integer> {
    List<InquiryMessageEntity> findByChat_ChatIdOrderBySentAddAsc(Integer chatId);
    void deleteBySenderId(String memId);
}
package com.not_band.service.history;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.entity.LoginHistoryEntity;
import com.not_band.repository.LoginHistoryRepository;

import jakarta.transaction.Transactional;

@Service
public class LoginHistoryService {

    @Autowired
    private LoginHistoryRepository loginRepository;

    // 로그인 기록 조회
    @Transactional
    public List<LoginHistoryEntity> getAllLoginRecords() {
        return loginRepository.findAll();  // 모든 로그인 기록 조회
    }
}
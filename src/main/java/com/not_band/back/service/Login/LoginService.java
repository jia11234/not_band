package com.not_band.back.service.Login;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.back.entity.LoginEntity;
import com.not_band.back.repository.LoginRepository;

import jakarta.transaction.Transactional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    // 로그인 기록 조회
    @Transactional
    public List<LoginEntity> getAllLoginRecords() {
        return loginRepository.findAll();  // 모든 로그인 기록 조회
    }
}
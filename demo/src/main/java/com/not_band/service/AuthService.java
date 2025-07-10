package com.not_band.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.not_band.dto.request.auth.CheckCertificationRequestDto;
import com.not_band.dto.request.auth.EmailCertificationRequestDto;
import com.not_band.dto.request.auth.IdCheckRequestDto;
import com.not_band.dto.request.auth.SignInRequestDto;
import com.not_band.dto.request.auth.SignUpRequestDto;
import com.not_band.dto.response.auth.CheckCertificationResponseDto;
import com.not_band.dto.response.auth.EmailCertificationResponseDto;
import com.not_band.dto.response.auth.IdCheckResponseDto;
import com.not_band.dto.response.auth.SignInResponseDto;
import com.not_band.dto.response.auth.SignUpResponseDto;
import com.not_band.dto.response.auth.UserResponseDto;

public interface AuthService {
    ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    UserResponseDto getUserByMemId(String memId);
    void updateMemberPoint(String memId, Integer memPoint, String operation);
    ResponseEntity<?> updateUserInfo(String memId, String field, String newValue);
    ResponseEntity<?> updateNickname(String memId, String newNickname);
    ResponseEntity<?> updateEmail(String memId, String newEmail);
    ResponseEntity<?> updatePhoneNumber(String memId, String newPhoneNumber);
    ResponseEntity<?> updateAddress(String memId, String newAddress, String newDetailAddress, String newZipCode);
    ResponseEntity<?> updatePassword(String memId, String newPassword);
    ResponseEntity<?> updateName(String memId, String newName);
    ResponseEntity<?> deleteUser(String memId);
    List<UserResponseDto> getAllUsers();
    void playGame(String memId);
    boolean canPlayGame(String memId);
    void resetDailyGameCount();
}



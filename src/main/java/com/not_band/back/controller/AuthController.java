package com.not_band.back.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.back.dto.request.auth.CheckCertificationRequestDto;
import com.not_band.back.dto.request.auth.EmailCertificationRequestDto;
import com.not_band.back.dto.request.auth.IdCheckRequestDto;
import com.not_band.back.dto.request.auth.SignUpRequestDto;
import com.not_band.back.dto.request.auth.SignInRequestDto;
import com.not_band.back.dto.response.auth.CheckCertificationResponseDto;
import com.not_band.back.dto.response.auth.EmailCertificationResponseDto;
import com.not_band.back.dto.response.auth.IdCheckResponseDto;
import com.not_band.back.dto.response.auth.SignUpResponseDto;
import com.not_band.back.dto.response.auth.UserResponseDto;
import com.not_band.back.dto.response.auth.SignInResponseDto;
import com.not_band.back.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/not_band")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
        @RequestBody @Valid IdCheckRequestDto requestBody
    ) {
        ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
        return response;
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertificatin (
        @RequestBody @Valid EmailCertificationRequestDto requestBody   
    ) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
        @RequestBody @Valid CheckCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity <? super SignUpResponseDto> signUp (
        @RequestBody @Valid SignUpRequestDto requestBody
    ){
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn (
        @RequestBody @Valid SignInRequestDto requestBody
    ){
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @GetMapping("/user/{memId}")
    public ResponseEntity<? super UserResponseDto> getUserByMemId(@PathVariable("memId") String memId) {
        UserResponseDto userResponse = authService.getUserByMemId(memId);
        return ResponseEntity.ok(userResponse);
    }
    
    @PutMapping("/point-plus/{memId}")
    public ResponseEntity<String> PlusMemberPoint(@PathVariable("memId") String memId, @RequestParam("memPoint") Integer memPoint) {
            authService.updateMemberPoint(memId, memPoint,"plus");
            return ResponseEntity.ok("회원 포인트가 업데이트되었습니다.");
    }

    @PutMapping("/point-minus/{memId}")
    public ResponseEntity<String> MinusMemberPoint(@PathVariable("memId") String memId, @RequestParam("memPoint") Integer memPoint) {
            authService.updateMemberPoint(memId, memPoint, "minus");
            return ResponseEntity.ok("회원 포인트가 업데이트되었습니다.");
    }
    
    // 회원 정보 수정
    @PutMapping("/user/update")
    public ResponseEntity<?> updateUserInfo(
            @RequestParam("memId")  String memId,    // 회원 ID
            @RequestParam("field")  String field,   // 수정할 필드명 (nickname, email, phoneNumber, address 등)
            @RequestParam("newValue")  String newValue // 새 값
    ) {
        // 서비스의 updateUserInfo 메서드를 호출
        return authService.updateUserInfo(memId, field, newValue);
    }

    @DeleteMapping("/user/delete/{memId}")
    public ResponseEntity<?> deleteUser(@PathVariable("memId") String memId) {
        return authService.deleteUser(memId);
    }

    @GetMapping("user/all")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/play/{memId}")
    public String playGame(@PathVariable("memId") String memId) {
        try {
            // 하루에 한 번만 게임 참여 가능
            boolean canPlay = authService.canPlayGame(memId);

            if (canPlay) {
                // 게임 참여 처리
                authService.playGame(memId);
                return "게임 참여 성공!";
            } else {
                return "하루에 한 번만 게임에 참여할 수 있습니다.";
            }
        } catch (Exception e) {
            return "게임 참여에 실패했습니다: " + e.getMessage();
        }
    }
}

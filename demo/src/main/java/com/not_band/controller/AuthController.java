package com.not_band.controller;

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

import com.not_band.common.Swagger.ApiResponseNP;
import com.not_band.common.Swagger.ApiResponseSuccess;
import com.not_band.common.Swagger.ApiResponseVF;
import com.not_band.dto.request.auth.CheckCertificationRequestDto;
import com.not_band.dto.request.auth.EmailCertificationRequestDto;
import com.not_band.dto.request.auth.IdCheckRequestDto;
import com.not_band.dto.request.auth.SignUpRequestDto;
import com.not_band.dto.request.auth.SignInRequestDto;
import com.not_band.dto.response.auth.CheckCertificationResponseDto;
import com.not_band.dto.response.auth.EmailCertificationResponseDto;
import com.not_band.dto.response.auth.IdCheckResponseDto;
import com.not_band.dto.response.auth.SignUpResponseDto;
import com.not_band.dto.response.auth.UserResponseDto;
import com.not_band.dto.response.auth.SignInResponseDto;
import com.not_band.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/not_band")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    //아이디 중복 확인
    @Operation(
        summary = "아이디 중복 확인", 
        description = "아이디를 입력하면 중복 여부를 확인합니다."
    )  
    @ApiResponseSuccess
    @ApiResponse(
        responseCode = "400",
        description = "아이디 중복",
        content = @Content(
            schema = @Schema(
                example = "{\"code\":\"DI\",\"message\":\"Duplicate Id.\"}"
            )
        )
    )
    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
        @RequestBody @Valid IdCheckRequestDto requestBody
    ) {
        ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
        return response;
    }
    
    //이메일 인증
    @Operation(
        summary = "이메일 인증", 
        description = "아이디와 이메일을 입력하면 이메일 인증 번호가 전송됩니다."
    )
    @ApiResponseSuccess
    @ApiResponseVF
    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertificatin (
        @RequestBody @Valid EmailCertificationRequestDto requestBody   
    ) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    //인증 확인
    @Operation(
        summary = "이메일 인증 번호 확인", 
        description = "아이디, 이메일, 인증번호를 입력하여 인증 번호 맞는지 확인합니다."
    )
    @ApiResponseSuccess
    @ApiResponse(
        responseCode = "401",
        description = "인증 번호 불일치",
        content = @Content(
            schema = @Schema(
                example = "{\"code\":\"DI\",\"message\":\"Certification failed.\"}"
            )
        )
    )
    @ApiResponseVF
    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
        @RequestBody @Valid CheckCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    //회원가입
    @Operation(
        summary = "회원가입", 
        description = "회원 정보를 입력하여 회원가입을 합니다."
    )
    @ApiResponseSuccess
    @ApiResponseVF
    @PostMapping("/sign-up")
    public ResponseEntity <? super SignUpResponseDto> signUp (
        @RequestBody @Valid SignUpRequestDto requestBody
    ){
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;
    }

    //로그인
    @Operation(summary = "로그인", description = "아이디, 비밀번호를 입력하여 로그인 정보를 확인합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "로그인 성공",
        content = @Content(
            schema = @Schema(
                example = "{\"code\":\"SU\",\"message\":\"일반 사용자입니다.\",\"token\":\"eyJ...\",\"expirationTime\":7200}"
            )
        )
    ) 
    @ApiResponse(
        responseCode = "401",
        description = "SNS로 가입했을 때 SNS 유형 안내 및 로그인 정보 맞지 않을 때"
    )
    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn (
        @RequestBody @Valid SignInRequestDto requestBody
    ){
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    //회원 정보 조회
    @Operation(summary = "회원 정보 조회", description = "아이디를 통해 회원 정보를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "회원 정보 조회 성공",
        content = @Content(
            schema = @Schema(implementation = UserResponseDto.class)

        )
    ) 
    @ApiResponseNP
    @GetMapping("/user/{memId}")
    public ResponseEntity<? super UserResponseDto> getUserByMemId(@PathVariable("memId") String memId) {
        UserResponseDto userResponse = authService.getUserByMemId(memId);
        return ResponseEntity.ok(userResponse);
    }
    
    //포인트 플러스
    @ApiResponse(
        responseCode = "200",
        description = "포인트 업데이트 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "회원 포인트가 업데이트되었습니다."
            )
        )
    )
    @ApiResponseNP
    @Operation(summary = "포인트 플러스", description = "아이디를 통해 해당 회원의 포인트를 증가시킨다.")
    @PutMapping("/point-plus/{memId}")
    public ResponseEntity<String> PlusMemberPoint(@PathVariable("memId") String memId, @RequestParam("memPoint") Integer memPoint) {
            authService.updateMemberPoint(memId, memPoint,"plus");
            return ResponseEntity.ok("회원 포인트가 업데이트되었습니다.");
    }

    //포인트 마이너스
    @ApiResponse(
        responseCode = "200",
        description = "포인트 업데이트 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "회원 포인트가 업데이트되었습니다."
            )
        )
    )
    @ApiResponseNP
    @Operation(summary = "포인트 마이너스", description = "아이디를 통해 해당 회원의 포인트를 사용합니다.")
    @PutMapping("/point-minus/{memId}")
    public ResponseEntity<String> MinusMemberPoint(@PathVariable("memId") String memId, @RequestParam("memPoint") Integer memPoint) {
            authService.updateMemberPoint(memId, memPoint, "minus");
            return ResponseEntity.ok("회원 포인트가 업데이트되었습니다.");
    }
    
    // 회원 정보 수정
    @Operation(summary = "회원 정보 수정", description = "아이디와 수정할 필드명(nickname, email, phoneNumber, address, password, name) 및 바꿀 값을 입력해 해당 회원 정보를 수정합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "회원 정보 수정 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "(필드)가(이) 수정되었습니다."
            )
        )
    )
    @PutMapping("/user/update")
    public ResponseEntity<?> updateUserInfo(
            @RequestParam("memId")  String memId,    // 회원 ID
            @RequestParam("field")  String field,   // 수정할 필드명 (nickname, email, phoneNumber, address 등)
            @RequestParam("newValue")  String newValue // 새 값
    ) {
        // 서비스의 updateUserInfo 메서드를 호출
        return authService.updateUserInfo(memId, field, newValue);
    }

    //유저 삭제
    @Operation(summary = "회원 탈퇴", description = "유저 정보를 입력 후 회원 탈퇴 합니다.")
    @ApiResponse(
        responseCode = "404",
        description = "유저 정보가 존재하지 않음",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "유저 정보가 존재하지 않음"
            )
        )
    )
    @ApiResponse(
        responseCode = "200",
        description = "회원 탈퇴 성공",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "회원 탈퇴가 완료되었습니다."
            )
        )
    )
    @DeleteMapping("/user/delete/{memId}")
    public ResponseEntity<?> deleteUser(@PathVariable("memId") String memId) {
        return authService.deleteUser(memId);
    }

    //모든 유저 조회
    @Operation(summary = "모든 유저 조회", description = "모든 유저 정보를 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "모든 유저 조회"
    )
    @GetMapping("user/all")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}

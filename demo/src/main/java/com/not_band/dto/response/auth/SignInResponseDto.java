package com.not_band.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.not_band.common.ResponseCode;
import com.not_band.common.ResponseMessage;
import com.not_band.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class SignInResponseDto extends ResponseDto{

    private String token;
    private int expirationTime;
    private String message;

    private SignInResponseDto (String token, String message) {
        super();
        this.token = token;
        this.expirationTime = 7200;
        this.message = message;
    }

    public static ResponseEntity<SignInResponseDto> success(String token, String message) {
        SignInResponseDto responseBody = new SignInResponseDto(token, message);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> signInFail () {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    } 

    public static ResponseEntity<ResponseDto> signInType (String userType) {
        String typeMessage = userType + "로 가입된 정보가 있습니다. 확인 후 다시 로그인해 주세요 ";
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_TYPE, typeMessage);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

}

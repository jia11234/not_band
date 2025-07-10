package com.not_band.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.not_band.common.ResponseCode;
import com.not_band.common.ResponseMessage;
import com.not_band.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class IdCheckResponseDto extends ResponseDto {
    
    private IdCheckResponseDto(String code, String message) {
        super(code, message);
    }

    public static ResponseEntity<IdCheckResponseDto> success() {
        IdCheckResponseDto responseBody = new IdCheckResponseDto(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        return ResponseEntity.ok(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateId() {
        ResponseDto responseBody = new IdCheckResponseDto(ResponseCode.DUPLICATE_ID, ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}

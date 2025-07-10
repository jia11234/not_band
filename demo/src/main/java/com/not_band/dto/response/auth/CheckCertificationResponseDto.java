package com.not_band.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.not_band.common.ResponseCode;
import com.not_band.common.ResponseMessage;
import com.not_band.dto.response.ResponseDto;

public class CheckCertificationResponseDto extends ResponseDto{

    private CheckCertificationResponseDto() {
        super();
    }

    public static ResponseEntity<CheckCertificationResponseDto> success() {
        CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> certificationFail () {
        ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
    
}

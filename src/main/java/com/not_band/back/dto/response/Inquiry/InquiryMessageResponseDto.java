package com.not_band.back.dto.response.Inquiry;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class InquiryMessageResponseDto {
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Timestamp sentAdd; 
    private Boolean mesRead;
    private String prdNo;
    private String opponentId;
}

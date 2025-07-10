package com.not_band.dto.request.Inquiry;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InquiryMessageRequestDto {
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Boolean mesRead;
    private String prdNo;
    private String token;
}

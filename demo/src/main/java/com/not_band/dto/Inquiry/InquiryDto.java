package com.not_band.dto.Inquiry;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InquiryDto {
    private Integer chatId;
    private String memId;
    private String selId;
    private Timestamp chatAdd;
    private List<InquiryMessageDto> messages;
    private long unreadCount; 
}

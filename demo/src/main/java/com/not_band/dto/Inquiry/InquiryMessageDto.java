package com.not_band.dto.Inquiry;

import java.sql.Timestamp;

import com.not_band.entity.InquiryMessageEntity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class InquiryMessageDto {
    private Integer mesId;
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Timestamp sentAdd;
    private Boolean mesRead;
    private String prdNo;

    public static InquiryMessageDto fromEntity(InquiryMessageEntity entity) {
        InquiryMessageDto dto = new InquiryMessageDto(); 
        dto.setMesId(entity.getMesId());           
        dto.setChatId(entity.getChat().getChatId()); 
        dto.setSenderId(entity.getSenderId());
        dto.setMesContent(entity.getMesContent());
        dto.setSentAdd(entity.getSentAdd());     
        dto.setMesRead(entity.getMesRead());
        dto.setPrdNo(entity.getPrdNo());
        return dto;
    }
}

package com.not_band.dto.chat;

import java.sql.Timestamp;
import com.not_band.entity.ChatMessageEntity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChatMessageDto {
    private Integer mesId;
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Timestamp sentAdd;
    private Boolean mesRead;

    public static ChatMessageDto fromEntity(ChatMessageEntity entity) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setMesId(entity.getMesId());            
        dto.setChatId(entity.getChat().getChatId());
        dto.setSenderId(entity.getSenderId());
        dto.setMesContent(entity.getMesContent());
        dto.setSentAdd(entity.getSentAdd());        
        dto.setMesRead(entity.getMesRead());
        return dto;
    }
}
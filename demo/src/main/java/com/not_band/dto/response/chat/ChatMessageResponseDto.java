package com.not_band.dto.response.chat;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChatMessageResponseDto {
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Timestamp sentAdd; 
    private Boolean mesRead;
    private String opponentId;
}
package com.not_band.dto.request.chat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChatMessageRequestDto {
    private Integer chatId;
    private String senderId;
    private String mesContent;
    private Boolean mesRead;
    private String token;
}

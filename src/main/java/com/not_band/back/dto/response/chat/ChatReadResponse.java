package com.not_band.back.dto.response.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatReadResponse {
    private Integer chatId;
    private String readerId;
    private String message;
}

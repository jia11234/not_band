package com.not_band.back.dto.chat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChatReadDto {
    private Integer chatId;
    private String readerId;
}

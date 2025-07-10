package com.not_band.dto.chat;

import java.sql.Timestamp;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChatDto {
    private Integer chatId;
    private String memId1;
    private String memId2;
    private Integer resId;
    private Timestamp chatAdd;
    private List<ChatMessageDto> messages;
    private long unreadCount;  // 읽지 않은 메시지 개수 추가

    public ChatDto(Integer chatId, String memId1, String memId2, Integer resId, Timestamp chatAdd, List<ChatMessageDto> messages, long unreadCount) {
        this.chatId = chatId;
        this.memId1 = memId1;
        this.memId2 = memId2;
        this.resId = resId;
        this.chatAdd = chatAdd;
        this.messages = messages;
        this.unreadCount = unreadCount;
    }
}

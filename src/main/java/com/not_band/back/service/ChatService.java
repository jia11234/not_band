package com.not_band.back.service;

import java.util.List;
import java.util.Optional;

import com.not_band.back.dto.chat.ChatDto;
import com.not_band.back.dto.request.chat.ChatMessageRequestDto;
import com.not_band.back.dto.response.chat.ChatMessageResponseDto;
import com.not_band.back.entity.ChatEntity;

public interface ChatService {
    ChatMessageResponseDto sendMessage(ChatMessageRequestDto requestDto);
    List<ChatMessageResponseDto> getMessages(Integer chatId, String myId);
    ChatEntity createOrGetChatRoom(Integer resId, String memId1, String memId2);
    Optional<ChatEntity> findChatRoom(Integer resId, String memId1, String memId2);
    List<ChatDto> getChatsByMemId(String memId);
    void updateMessagesToRead(Integer chatId, String readerId);
    
} 

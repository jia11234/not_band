package com.not_band.back.service;

import java.util.List;
import java.util.Optional;

import com.not_band.back.dto.Inquiry.InquiryDto;
import com.not_band.back.dto.request.Inquiry.InquiryMessageRequestDto;
import com.not_band.back.dto.response.Inquiry.InquiryMessageResponseDto;
import com.not_band.back.entity.InquiryEntity;

public interface InquiryService {
    InquiryMessageResponseDto sendMessage(InquiryMessageRequestDto requestDto);
    List<InquiryMessageResponseDto> getMessages(Integer chatId, String myId);
    InquiryEntity createOrGetChatRoom(String memId, String selId);
    Optional<InquiryEntity> findChatRoom(String memId, String selId);
    List<InquiryDto> getChatsByMemId(String memId);
    void updateMessagesToRead(Integer chatId, String readerId);
    List<InquiryDto> getAllChats();
    List<InquiryDto> getInquiryMemId(String memId);
}

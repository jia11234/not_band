package com.not_band.back.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.back.dto.Inquiry.InquiryDto;
import com.not_band.back.dto.request.Inquiry.InquiryMessageRequestDto;
import com.not_band.back.dto.request.chat.ChatReadRequest;
import com.not_band.back.dto.response.Inquiry.InquiryMessageResponseDto;
import com.not_band.back.dto.response.chat.ChatReadResponse;
import com.not_band.back.entity.InquiryEntity;
import com.not_band.back.service.InquiryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/inquiry")
public class InquiryController {
    
    private final InquiryService inquiryService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/message")
    public ResponseEntity<InquiryMessageResponseDto> sendMessage(@RequestBody InquiryMessageRequestDto requestDto) {
        InquiryMessageResponseDto responseDto = inquiryService.sendMessage(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<InquiryMessageResponseDto>> getMessages(
            @PathVariable Integer chatId,
            @RequestParam String senderId,
            @RequestHeader("Authorization") String authorization) {
        System.out.println("나와주라이잉: " + senderId);
        List<InquiryMessageResponseDto> messages = inquiryService.getMessages(chatId, senderId);
        inquiryService.updateMessagesToRead(chatId, senderId); // 조회 후 읽음처리 따로 호출
        return ResponseEntity.ok(messages);
    }

    @MessageMapping("/inquiry/{chatId}")
    @SendTo("/topic/{chatId}")
    public InquiryMessageResponseDto sendChatMessage(@DestinationVariable Integer chatId, 
                                                  @Payload InquiryMessageRequestDto requestDto) {
        System.out.println("이건 됩니다요~~~~~"); 
        return inquiryService.sendMessage(requestDto);
    }

    @PostMapping("/create-room")
    public ResponseEntity<InquiryEntity> createOrGetChatRoom(@RequestBody InquiryDto requestDto) {
        Optional<InquiryEntity> existingRoom = inquiryService.findChatRoom(requestDto.getMemId(), requestDto.getSelId());
    
        if (existingRoom.isPresent()) {
            existingRoom.get().setIsNew(false);
            return ResponseEntity.ok(existingRoom.get());
        }
    
        InquiryEntity newRoom = inquiryService.createOrGetChatRoom(requestDto.getMemId(), requestDto.getSelId());
        newRoom.setIsNew(true);
        return ResponseEntity.ok(newRoom);
    }

    //채팅 목록
    @GetMapping
    public ResponseEntity<List<InquiryDto>> getAllChats() {
        try {
            List<InquiryDto> chats = inquiryService.getAllChats();
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{memId}")
    public ResponseEntity<List<InquiryDto>> getInquiryMemId(@PathVariable("memId") String memId) {
        try {
            List<InquiryDto> chats = inquiryService.getInquiryMemId(memId);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @MessageMapping("/inquiry/{chatId}/read")
    @SendTo("/topic/inquiry/{chatId}/read")
    public ChatReadResponse readMessage(@DestinationVariable Integer chatId, @Payload ChatReadRequest request) {
        System.out.println("이건 됩니다요~~~~~");
        inquiryService.updateMessagesToRead(chatId, String.valueOf(request.getReaderId()));
        ChatReadResponse response = new ChatReadResponse();
        response.setChatId(chatId);
        response.setMessage("메시지가 읽음 처리되었습니다.");
    
        return response;
    }

    @MessageMapping("/inquiry/{chatId}/join")
    public void handleUserJoin(@DestinationVariable Integer chatId, @Payload String userId) {
        System.out.println("새로운 사용자 " + userId + "가 방에 들어옴.");
        String notificationMessage = userId + "님이 채팅방에 입장했습니다!";
        messagingTemplate.convertAndSend("/topic/inquiry/" + chatId + "/join", notificationMessage);
    }
}

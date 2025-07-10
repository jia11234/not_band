package com.not_band.controller;

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

import com.not_band.dto.chat.ChatDto;
import com.not_band.dto.request.chat.ChatMessageRequestDto;
import com.not_band.dto.request.chat.ChatReadRequest;
import com.not_band.dto.response.chat.ChatMessageResponseDto;
import com.not_band.dto.response.chat.ChatReadResponse;
import com.not_band.entity.ChatEntity;
import com.not_band.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/chat")
public class ChatController {
    
    private final ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    //채팅 메세지 전송
    @PostMapping("/message")
    public ResponseEntity<ChatMessageResponseDto> sendMessage(@RequestBody ChatMessageRequestDto requestDto) {
        ChatMessageResponseDto responseDto = chatService.sendMessage(requestDto);
        messagingTemplate.convertAndSend("/topic/chat/" + responseDto.getChatId(), responseDto);
        return ResponseEntity.ok(responseDto);
    }

    //채팅 메세지 조회
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessageResponseDto>> getMessages(
            @PathVariable("chatId") Integer chatId,
            @RequestParam("senderId") String senderId,
            @RequestHeader("Authorization") String authorization) {
        System.out.println("나와주라이잉: " + senderId);
        List<ChatMessageResponseDto> messages = chatService.getMessages(chatId, senderId);
        chatService.updateMessagesToRead(chatId, senderId); // 조회 후 읽음처리 따로 호출
        return ResponseEntity.ok(messages);
    }
    
    //WebSocket으로 메세지 전송
    @MessageMapping("/chat/{chatId}")
    @SendTo("/topic/{chatId}")
    public ChatMessageResponseDto sendChatMessage(@DestinationVariable Integer chatId, 
                                                  @Payload ChatMessageRequestDto requestDto) {
        System.out.println("이건 됩니다요~~~~~"); 
        return chatService.sendMessage(requestDto);
    }

    //채팅방 생성
    @PostMapping("/create-room")
    public ResponseEntity<ChatEntity> createOrGetChatRoom(@RequestBody ChatDto requestDto) {
        Optional<ChatEntity> existingRoom = chatService.findChatRoom(requestDto.getResId(), requestDto.getMemId1(), requestDto.getMemId2());
    
        if (existingRoom.isPresent()) {
            existingRoom.get().setIsNew(false);
            return ResponseEntity.ok(existingRoom.get());
        }
    
        ChatEntity newRoom = chatService.createOrGetChatRoom(requestDto.getResId(), requestDto.getMemId1(), requestDto.getMemId2());
        newRoom.setIsNew(true);
        return ResponseEntity.ok(newRoom);
    }

    //채팅 목록
    @GetMapping("/{memId}")
    public ResponseEntity<List<ChatDto>> getChatsByMemId(@PathVariable("memId") String memId) {
        try {
            List<ChatDto> chats = chatService.getChatsByMemId(memId);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    //읽음
    @MessageMapping("/chat/{chatId}/read")
    @SendTo("/topic/chat/{chatId}/read")
    public ChatReadResponse readMessage(@DestinationVariable Integer chatId, @Payload ChatReadRequest request) {
        System.out.println("이건 됩니다요~~~~~");
        chatService.updateMessagesToRead(chatId, String.valueOf(request.getReaderId()));
        ChatReadResponse response = new ChatReadResponse();
        response.setChatId(chatId);
        response.setMessage("메시지가 읽음 처리되었습니다.");
    
        return response;
    }

    //채팅방 입장 알람
    @MessageMapping("/chat/{chatId}/join")
    public void handleUserJoin(@DestinationVariable Integer chatId, @Payload String userId) {
        System.out.println("새로운 사용자 " + userId + "가 방에 들어옴.");
        String notificationMessage = userId + "님이 채팅방에 입장했습니다!";
        messagingTemplate.convertAndSend("/topic/chat/" + chatId + "/join", notificationMessage);
    }
}
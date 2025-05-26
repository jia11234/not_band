package com.not_band.back.service.Chat;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.not_band.back.dto.chat.ChatDto;
import com.not_band.back.dto.chat.ChatMessageDto;
import com.not_band.back.dto.request.chat.ChatMessageRequestDto;
import com.not_band.back.dto.response.chat.ChatMessageResponseDto;
import com.not_band.back.entity.ChatEntity;
import com.not_band.back.entity.ChatMessageEntity;
import com.not_band.back.repository.ChatMessageRepository;
import com.not_band.back.repository.ChatRepository;
import com.not_band.back.service.ChatService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImplement implements ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public ChatMessageResponseDto sendMessage(ChatMessageRequestDto requestDto) {
        ChatEntity chat = chatRepository.findById(requestDto.getChatId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessageEntity message = new ChatMessageEntity();
        message.setChat(chat);
        message.setSenderId(requestDto.getSenderId());
        message.setMesContent(requestDto.getMesContent());
        message.setSentAdd(new Timestamp(System.currentTimeMillis()));
        message.setMesRead(false);

        ChatMessageEntity saved = chatMessageRepository.save(message);

        String receiverId = chat.getMemId1().equals(requestDto.getSenderId())
                ? chat.getMemId2()
                : chat.getMemId1();

        messagingTemplate.convertAndSend("/topic/chat/" + receiverId, "새 메시지가 도착했습니다");

        ChatMessageResponseDto response = new ChatMessageResponseDto();
        response.setChatId(saved.getChat().getChatId());
        response.setSenderId(saved.getSenderId());
        response.setMesContent(saved.getMesContent());
        response.setSentAdd(saved.getSentAdd());

        return response;
    }

    @Override
    public List<ChatMessageResponseDto> getMessages(Integer chatId, String senderId) {
        ChatEntity chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new RuntimeException("채팅방이 존재하지 않습니다."));
    
        String opponentId;
        if (chat.getMemId1().equals(senderId)) {
            opponentId = chat.getMemId2();
        } else if (chat.getMemId2().equals(senderId)) {
            opponentId = chat.getMemId1();
        } else {
            throw new RuntimeException("현재 사용자는 이 채팅방의 참가자가 아닙니다.");
        }
    
        List<ChatMessageEntity> messages = chatMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chatId);
    
        return messages.stream().map(msg -> {
            ChatMessageResponseDto dto = new ChatMessageResponseDto();
            dto.setChatId(msg.getChat().getChatId());
            dto.setSenderId(msg.getSenderId());
            dto.setMesContent(msg.getMesContent());
            dto.setSentAdd(msg.getSentAdd());
            dto.setMesRead(msg.getMesRead());
            dto.setOpponentId(opponentId); // 상대방 아이디 추가
            return dto;
        }).collect(Collectors.toList());
    }
    
    // 읽음 처리 따로
    @Override
    public void updateMessagesToRead(Integer chatId, String readerId) {
        List<ChatMessageEntity> messages = chatMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chatId);
    
        messages.stream()
            .filter(msg -> !msg.getSenderId().equals(readerId) && !msg.getMesRead())
            .forEach(msg -> {
                msg.setMesRead(true);
                System.out.println("Updating message " + msg.getMesId() + " to read.");
                chatMessageRepository.save(msg);
            });
    }

    @Override
    public ChatEntity createOrGetChatRoom(Integer resId, String memId1, String memId2) {
        Optional<ChatEntity> existingRoom = chatRepository.findByResIdAndMemId1AndMemId2(resId, memId1, memId2);
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        ChatEntity newRoom = new ChatEntity();
        newRoom.setResId(resId);
        newRoom.setMemId1(memId1);
        newRoom.setMemId2(memId2);
        newRoom.setChatAdd(new Timestamp(System.currentTimeMillis())); 

        return chatRepository.save(newRoom);
    }
    
    @Override
    public Optional<ChatEntity> findChatRoom(Integer resId, String memId1, String memId2) {
        return chatRepository.findByResIdAndMemId1AndMemId2(resId, memId1, memId2);
    }

    @Transactional
    @Override
    public List<ChatDto> getChatsByMemId(String memId) {
        List<ChatEntity> chats = chatRepository.findByMemId1OrMemId2(memId, memId);
    
        return chats.stream()
            .map(chat -> {
                // 채팅 메시지들 가져오기
                List<ChatMessageEntity> chatMessages = chatMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chat.getChatId());
    
                // 읽지 않은 메시지 개수 계산
                long unreadCount = chatMessages.stream()
                    .filter(message -> !message.getMesRead())  // mesRead가 false인 메시지 필터링
                    .count();
    
                // 가장 큰 mesId를 가진 메시지 찾기
                ChatMessageEntity latestMessage = chatMessages.stream()
                    .max(Comparator.comparingInt(ChatMessageEntity::getMesId)) // mesId 기준으로 가장 큰 값 찾기
                    .orElse(null);
    
                // 최신 메시지가 있으면 ChatMessageDto로 변환
                List<ChatMessageDto> messageDtos = new ArrayList<>();
                if (latestMessage != null) {
                    messageDtos.add(ChatMessageDto.fromEntity(latestMessage)); // 하나의 최신 메시지만 리스트에 추가
                }
    
                // ChatDto 생성하여 반환
                return new ChatDto(
                    chat.getChatId(),
                    chat.getMemId1(),
                    chat.getMemId2(),
                    chat.getResId(),
                    chat.getChatAdd(),
                    messageDtos,
                    unreadCount  // 읽지 않은 메시지 개수 추가
                );
            })
            .collect(Collectors.toList());
    }
    
}

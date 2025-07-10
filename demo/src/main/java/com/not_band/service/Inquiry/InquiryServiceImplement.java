package com.not_band.service.Inquiry;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.not_band.dto.Inquiry.InquiryDto;
import com.not_band.dto.Inquiry.InquiryMessageDto;
import com.not_band.dto.request.Inquiry.InquiryMessageRequestDto;
import com.not_band.dto.response.Inquiry.InquiryMessageResponseDto;
import com.not_band.entity.InquiryEntity;
import com.not_band.entity.InquiryMessageEntity;
import com.not_band.repository.InquiryMessageRepository;
import com.not_band.repository.InquiryRepository;
import com.not_band.service.InquiryService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryServiceImplement implements InquiryService {
    
    private final InquiryRepository inquiryRepository;
    private final InquiryMessageRepository inquiryMessageRepository;
    
    //메세지 전송 후 저장
    @Override
    public InquiryMessageResponseDto sendMessage(InquiryMessageRequestDto requestDto) {
        //메세지 조회
        InquiryEntity chat = inquiryRepository.findById(requestDto.getChatId())
            .orElseThrow(() -> new IllegalArgumentException("채팅방 없는데엽?"));

        InquiryMessageEntity message = new InquiryMessageEntity();
        message.setChat(chat);
        message.setSenderId(requestDto.getSenderId());
        message.setMesContent(requestDto.getMesContent());
        message.setSentAdd(new Timestamp(System.currentTimeMillis()));
        message.setMesRead(false);
        message.setPrdNo(requestDto.getPrdNo());

        //메세지 저장
        InquiryMessageEntity saved = inquiryMessageRepository.save(message);
        //dto로 변환
        InquiryMessageResponseDto response = new InquiryMessageResponseDto();
        response.setChatId(saved.getChat().getChatId());
        response.setSenderId(saved.getSenderId());
        response.setMesContent(saved.getMesContent());
        response.setSentAdd(saved.getSentAdd());
        response.setPrdNo(saved.getPrdNo());

        return response;
    }

    //채팅방 메세지 조회
    @Override
    public List<InquiryMessageResponseDto> getMessages(Integer chatId, String senderId) {
       //채팅방 존재 여부 확인
        InquiryEntity chat = inquiryRepository.findById(chatId)
            .orElseThrow(() -> new RuntimeException("채팅방이 존재하지 않습니다."));

        //상대방 ID찾기
        String opponentId;
        if (chat.getMemId().equals(senderId)) {
            opponentId = chat.getMemId();
        } else if (chat.getSelId().equals(senderId)) {
            opponentId = chat.getSelId();
        } else {
            throw new RuntimeException("현재 사용자는 이 채팅방의 참가자가 아닙니다.");
        }

        List<InquiryMessageEntity> messages = inquiryMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chatId);

        return messages.stream().map(msg -> {
            InquiryMessageResponseDto dto = new InquiryMessageResponseDto();
            dto.setChatId(msg.getChat().getChatId());
            dto.setSenderId(msg.getSenderId());
            dto.setMesContent(msg.getMesContent());
            dto.setSentAdd(msg.getSentAdd());
            dto.setMesRead(msg.getMesRead());
            dto.setPrdNo(msg.getPrdNo());
            dto.setOpponentId(opponentId);
            return dto;
        }).collect(Collectors.toList());
    }

    //채팅방 생성 만약 존재하면 반환
    @Override
    public InquiryEntity createOrGetChatRoom(String memId, String selId) {
        Optional<InquiryEntity> existingRoom = inquiryRepository.findByMemIdAndSelId(memId, selId);
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        //새 채팅방 생성ㅇ
        InquiryEntity newRoom = new InquiryEntity();
        newRoom.setMemId(memId);
        newRoom.setSelId(selId);
        newRoom.setChatAdd(new Timestamp(System.currentTimeMillis())); 

        //채팅방 저장 후 리턴
        return inquiryRepository.save(newRoom);
    }
    
    //판매자와 문의자로 채팅방 존재 여부 조회
    @Override
    public Optional<InquiryEntity> findChatRoom(String memId, String selId) {
        return inquiryRepository.findByMemIdAndSelId(memId, selId);
    }

    //특정 회원 채팅방 조회 최신 메세지 1개와 읽지않은 개수 까지 반환
    @Transactional
    @Override
    public List<InquiryDto> getChatsByMemId(String memId) {
        List<InquiryEntity> chats = inquiryRepository.findByMemId(memId);

        return chats.stream()
            .map(chat -> {
                // 채팅 메시지들 가져오기
                List<InquiryMessageEntity> chatMessages = inquiryMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chat.getChatId());

                // 읽지 않은 메시지 개수 계산
                long unreadCount = chatMessages.stream()
                    .filter(message -> !message.getMesRead())  // mesRead가 false인 메시지 필터링
                    .count();

                // 가장 큰 mesId를 가진 메시지 찾기
                InquiryMessageEntity latestMessage = chatMessages.stream()
                    .max(Comparator.comparingInt(InquiryMessageEntity::getMesId)) // mesId 기준으로 가장 큰 값 찾기
                    .orElse(null);

                // 최신 메시지가 있으면 ChatMessageDto로 변환
                List<InquiryMessageDto> messageDtos = new ArrayList<>();
                if (latestMessage != null) {
                    messageDtos.add(InquiryMessageDto.fromEntity(latestMessage)); // 하나의 최신 메시지만 리스트에 추가
                }

                // ChatDto 생성하여 반환
                return new InquiryDto(
                    chat.getChatId(),
                    chat.getMemId(),
                    chat.getSelId(),
                    chat.getChatAdd(),
                    messageDtos,
                    unreadCount 
                );
            })
            .collect(Collectors.toList());
    }

    //채팅방 읽음처리
    @Override
    public void updateMessagesToRead(Integer chatId, String readerId) {
        List<InquiryMessageEntity> messages = inquiryMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chatId);
    
        messages.stream()
            .filter(msg -> !msg.getSenderId().equals(readerId) && !msg.getMesRead())
            .forEach(msg -> {
                msg.setMesRead(true);
                System.out.println("Updating message " + msg.getMesId() + " to read.");
                inquiryMessageRepository.save(msg);
            });
    }

    //모든 채팅방 조회
@Transactional
@Override
public List<InquiryDto> getAllChats() {
    List<InquiryEntity> chats = inquiryRepository.findAll(); // 전체 채팅방 조회

    return chats.stream()
        .map(chat -> {
            List<InquiryMessageEntity> chatMessages = inquiryMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chat.getChatId());

            long unreadCount = chatMessages.stream()
                .filter(message -> !message.getMesRead())  // mesRead가 false인 메시지 필터링
                .count();

            InquiryMessageEntity latestMessage = chatMessages.stream()
                .max(Comparator.comparingInt(InquiryMessageEntity::getMesId)) // mesId 기준으로 가장 큰 값 찾기
                .orElse(null);
            List<InquiryMessageDto> messageDtos = new ArrayList<>();
            if (latestMessage != null) {
                messageDtos.add(InquiryMessageDto.fromEntity(latestMessage)); // 하나의 최신 메시지만 리스트에 추가
            }

            return new InquiryDto(
                chat.getChatId(),
                chat.getMemId(),
                chat.getSelId(),
                chat.getChatAdd(),
                messageDtos,
                unreadCount
            );
        })
        .collect(Collectors.toList());
}

//특정 회원 채팅방 목록 조회
@Transactional
@Override
public List<InquiryDto> getInquiryMemId(String memId) {
    List<InquiryEntity> chats = inquiryRepository.findByMemId(memId); // 전체 채팅방 조회

    return chats.stream()
        .map(chat -> {
            List<InquiryMessageEntity> chatMessages = inquiryMessageRepository.findByChat_ChatIdOrderBySentAddAsc(chat.getChatId());

            long unreadCount = chatMessages.stream()
                .filter(message -> !message.getMesRead())  // mesRead가 false인 메시지 필터링
                .count();

            InquiryMessageEntity latestMessage = chatMessages.stream()
                .max(Comparator.comparingInt(InquiryMessageEntity::getMesId)) // mesId 기준으로 가장 큰 값 찾기
                .orElse(null);
            List<InquiryMessageDto> messageDtos = new ArrayList<>();
            if (latestMessage != null) {
                messageDtos.add(InquiryMessageDto.fromEntity(latestMessage)); // 하나의 최신 메시지만 리스트에 추가
            }

            return new InquiryDto(
                chat.getChatId(),
                chat.getMemId(),
                chat.getSelId(),
                chat.getChatAdd(),
                messageDtos,
                unreadCount
            );
        })
        .collect(Collectors.toList());
}
}

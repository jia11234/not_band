package com.not_band.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.not_band.entity.ChatMessageEntity;

import jakarta.transaction.Transactional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Integer> {
    List<ChatMessageEntity> findByChat_ChatIdOrderBySentAddAsc(Integer chatId);
    void deleteBySenderId(String memId);
    @Transactional
    @Modifying
    @Query("DELETE FROM ChatMessageEntity m WHERE m.chat.chatId = :chatId")
    void deleteByChatId(@Param("chatId") Integer chatId);
}

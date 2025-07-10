package com.not_band.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "chat_message")
public class ChatMessageEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mesId;

    @ManyToOne
    @JoinColumn(name = "chatId", referencedColumnName = "chatId")
    private ChatEntity chat;
    private String senderId;
    private String mesContent;

    @CreationTimestamp
    private Timestamp sentAdd;
    

    private Boolean mesRead;

}

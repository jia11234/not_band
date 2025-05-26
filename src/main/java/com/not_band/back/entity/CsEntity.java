package com.not_band.back.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cs") 
public class CsEntity {
    @Id
    private int csId;  
    private String csTitle;  
    private String csContent; 
    private LocalDateTime csAdd = LocalDateTime.now();  
    private boolean csPin = false;

    public CsEntity(String csTitle, String csContent, boolean csPin) {
        this.csTitle = csTitle;
        this.csContent = csContent;
        this.csPin = csPin;
    }
}

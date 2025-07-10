package com.not_band.entity;

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
    private int csId; //공지사항 번호
    private String csTitle; //공지사항 제목
    private String csContent; //공지사항 내용
    private LocalDateTime csAdd = LocalDateTime.now(); //공지사항 등록 시간
    private boolean csPin = false; //공지사항 고정 여부

    //이건 걍 뺄까?
    public CsEntity(String csTitle, String csContent, boolean csPin) {
        this.csTitle = csTitle;
        this.csContent = csContent;
        this.csPin = csPin;
    }
}

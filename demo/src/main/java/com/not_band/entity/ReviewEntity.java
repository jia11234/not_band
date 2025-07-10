package com.not_band.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.not_band.dto.request.review.ReviewRequestDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "review")
@AllArgsConstructor
public class ReviewEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer revNo;

    private String memId;
    private String prdNo;

    private Integer ordNo;
    private Integer revRating;

    private String revContent;

    private String revImgUrl1;
    private String revImgUrl2;
    private String revImgUrl3;
    private String revImgUrl4;
    private String revImgUrl5;

    private LocalDateTime revAdd = LocalDateTime.now();

    public ReviewEntity(ReviewRequestDto dto) {
        this.memId = dto.getMemId();
        this.ordNo = dto.getOrdNo();
        this.prdNo = dto.getPrdNo();
        this.revRating = dto.getRevRating();
        this.revContent = dto.getRevContent();

        List<String> urls = dto.getRevImgUrl();
        this.revImgUrl1 = urls.size() > 0 ? urls.get(0) : null;
        this.revImgUrl2 = urls.size() > 1 ? urls.get(1) : null;
        this.revImgUrl3 = urls.size() > 2 ? urls.get(2) : null;
        this.revImgUrl4 = urls.size() > 3 ? urls.get(3) : null;
        this.revImgUrl5 = urls.size() > 4 ? urls.get(4) : null;
    }

    public void setRevImgUrl(List<String> urls) {
        this.revImgUrl1 = urls.size() > 0 ? urls.get(0) : null;
        this.revImgUrl2 = urls.size() > 1 ? urls.get(1) : null;
        this.revImgUrl3 = urls.size() > 2 ? urls.get(2) : null;
        this.revImgUrl4 = urls.size() > 3 ? urls.get(3) : null;
        this.revImgUrl5 = urls.size() > 4 ? urls.get(4) : null;
    }
}

package com.not_band.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.not_band.dto.request.resell.ResellProductRequestDto;

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
@Table(name = "resell")
@AllArgsConstructor
public class ResellEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resId;

    private String memId;
    private String resPrd;
    private Integer resPrice;

    private String resImgUrl1;
    private String resImgUrl2;
    private String resImgUrl3;
    private String resImgUrl4;
    private String resImgUrl5;

    private Integer resView = 0;
    private Integer resLike = 0;
    private Integer resComment = 1;

    private LocalDateTime resTime = LocalDateTime.now();

    private String resDelivery;
    private String resAddress;
    private String resDetail;

    private String resTag1;
    private String resTag2;

    private String resCategory;
    private String resDelPrice;
    private String resCondition;

    public void setResLike(Integer resLike) {
        this.resLike = resLike;
    }

    public void setResView(Integer resView) {
        this.resView = resView;
    }

    public ResellEntity(ResellProductRequestDto dto) {
        this.memId = dto.getMemId();
        this.resPrd = dto.getResPrd();
        this.resPrice = dto.getResPrice();

        List<String> urls = dto.getResImgUrl();
        this.resImgUrl1 = urls.size() > 0 ? urls.get(0) : null;
        this.resImgUrl2 = urls.size() > 1 ? urls.get(1) : null;
        this.resImgUrl3 = urls.size() > 2 ? urls.get(2) : null;
        this.resImgUrl4 = urls.size() > 3 ? urls.get(3) : null;
        this.resImgUrl5 = urls.size() > 4 ? urls.get(4) : null;

        this.resDelivery = dto.getResDelivery();
        this.resAddress = dto.getResAddress();
        this.resDetail = dto.getResDetail();

        List<String> tags = dto.getResTag();
        this.resTag1 = tags.size() > 0 ? tags.get(0) : null;
        this.resTag2 = tags.size() > 1 ? tags.get(1) : null;

        this.resCategory = dto.getResCategory();
        this.resDelPrice = dto.getResDelPrice();
        this.resCondition = dto.getResCondition();
    }
}
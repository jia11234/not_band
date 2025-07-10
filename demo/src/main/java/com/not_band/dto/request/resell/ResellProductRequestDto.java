package com.not_band.dto.request.resell;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResellProductRequestDto {
    private String memId;
    private String resPrd;
    private int resPrice;
    private List<String> resImgUrl; // 최대 5개
    private String resDelivery;
    private String resAddress;
    private String resDetail;
    private List<String> resTag;
    private String resCategory;
    private String resDelPrice;
    private String resCondition;
}
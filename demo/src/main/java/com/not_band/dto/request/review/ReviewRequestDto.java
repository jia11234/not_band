package com.not_band.dto.request.review;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewRequestDto {
    private String memId;
    private String prdNo;
    private Integer ordNo;
    private Integer revRating;
    private String revContent;
    private List<String> revImgUrl = new ArrayList<>();
}

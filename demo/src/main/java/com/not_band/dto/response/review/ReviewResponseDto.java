package com.not_band.dto.response.review;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ReviewResponseDto {
    private Integer revNo;

    private String memNick;
    private String memId;
    private String prdNo;

    private Integer ordNo;
    private Integer revRating;

    private String revContent;
    private List<String> revImgUrl;
    private LocalDateTime revAdd;
}

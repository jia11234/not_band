package com.not_band.dto.search;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private String name;
    private Integer price;
    private String type;
    private String category;
    private String tag;
    private String image;
    private String prdNo; // 일반 상품 prdNo
    private Integer resId;
}
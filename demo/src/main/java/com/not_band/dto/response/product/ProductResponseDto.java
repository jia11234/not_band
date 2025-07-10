package com.not_band.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDto {
    private String prdNo;
    private String prdName;
    private String prdModel;
    private String prdBrand;
    private String prdOrigin;
    private String prdFacturer;
    private int prdStock;
    private int prdDiscount;
    private String prdCategory;
    private int prdPrice;
    private Boolean prdRental;
    private String prdUrl;
    private String prdDetailUrl;
    private List<ProductOptionDto> options;
}
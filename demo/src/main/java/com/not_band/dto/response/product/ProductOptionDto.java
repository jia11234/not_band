package com.not_band.dto.response.product;

import com.not_band.entity.OptionEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductOptionDto {
    private String optionValue;
    private int optionStock;
    private String prdNo;
    private String parentPrdNo;

    public ProductOptionDto(OptionEntity option) {
        this.optionValue = option.getOptionValue();
        this.optionStock = option.getOptionStock();
        this.prdNo = option.getPrdNo();
        this.parentPrdNo = option.getOptionValue();
    }
}
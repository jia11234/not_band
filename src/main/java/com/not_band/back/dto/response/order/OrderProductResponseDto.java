package com.not_band.back.dto.response.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductResponseDto {
    private String prdNo;
    private int ordQty;
    private boolean isAddProduct;
    private String colorOpt;
    private String parentPrdNo;
}

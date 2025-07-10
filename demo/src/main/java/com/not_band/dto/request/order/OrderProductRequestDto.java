package com.not_band.dto.request.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderProductRequestDto {
    private Long id;
    private String prdNo;
    private int ordQty;
    private Boolean isAddProduct;
    private String colorOpt;
    private String parentPrdNo;
}

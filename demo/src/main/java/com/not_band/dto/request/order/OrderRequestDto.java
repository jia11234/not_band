package com.not_band.dto.request.order;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequestDto {
    private String memId;
    private String ordName;
    private String ordPhone;
    private String ordAddress;
    private int ordTotal;
    private String ordPaymethod;
    private String ordPaystatus;
    private String ordZipcode;
    private String ordDetailAddress;
    private String ordStatus;
    private String ordMemo;
    private int ordPoint;
    private int ordDelivery;
    private List<OrderProductRequestDto> products;

    public OrderRequestDto( String memId, String ordName, String ordPhone,
                           String ordAddress, int ordTotal, String ordPaymethod, String ordPaystatus,
                           String ordZipcode, String ordDetailAddress, String ordStatus, String ordMemo,
                           int ordPoint, int ordDelivery, List<OrderProductRequestDto> products) {
        this.memId = memId;
        this.ordName = ordName;
        this.ordPhone = ordPhone;
        this.ordAddress = ordAddress;
        this.ordTotal = ordTotal;
        this.ordPaymethod = ordPaymethod;
        this.ordPaystatus = ordPaystatus;
        this.ordZipcode = ordZipcode;
        this.ordDetailAddress = ordDetailAddress;
        this.ordStatus = ordStatus;
        this.ordMemo = ordMemo;
        this.ordPoint = ordPoint;
        this.ordDelivery = ordDelivery;
        this.products = products;
    }
}

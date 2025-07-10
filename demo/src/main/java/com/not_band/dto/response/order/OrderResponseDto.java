package com.not_band.dto.response.order;

import java.sql.Timestamp;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderResponseDto {
    private int ordNo;
    private String memId;
    private String ordName;
    private String ordPhone;
    private String ordAddress;
    private String ordDetailAddress;
    private String ordZipcode;
    private int ordTotal;
    private String ordPaymethod;
    private String ordPaystatus;
    private String ordStatus;
    private String ordMemo;
    private int ordPoint;
    private int ordDelivery;
    private Timestamp ordDate;

    private List<OrderProductResponseDto> products;

    public OrderResponseDto(int ordNo, String memId, String ordName, String ordPhone,
                        String ordAddress, String ordDetailAddress, String ordZipcode,
                        int ordTotal, String ordPaymethod, String ordPaystatus,
                        String ordStatus, String ordMemo, int ordPoint, int ordDelivery,
                        Timestamp ordDate, List<OrderProductResponseDto> products) {
    this.ordNo = ordNo;
    this.memId = memId;
    this.ordName = ordName;
    this.ordPhone = ordPhone;
    this.ordAddress = ordAddress;
    this.ordDetailAddress = ordDetailAddress;
    this.ordZipcode = ordZipcode;
    this.ordTotal = ordTotal;
    this.ordPaymethod = ordPaymethod;
    this.ordPaystatus = ordPaystatus;
    this.ordStatus = ordStatus;
    this.ordMemo = ordMemo;
    this.ordPoint = ordPoint;
    this.ordDelivery = ordDelivery;
    this.ordDate = ordDate;
    this.products = products;
}
    
}


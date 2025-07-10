package com.not_band.dto.request.cart;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartRequestDto {
    private String memId;  
    private String prdNo;   
    private String addPrd1;   
    private String addPrd2;   
    private int ctQty;       
    private Timestamp ctAdd;
    private int add1Qty = 0; 
    private int add2Qty = 0;  
    private String colorOpt = "0"; 
    private Boolean cartChecked = true;

    public CartRequestDto(String memId, String prdNo, String addPrd1, String addPrd2, int ctQty, Timestamp ctAdd, int add1Qty, int add2Qty, String colorOpt, Boolean cartChecked) {
        this.memId = memId;
        this.prdNo = prdNo;
        this.addPrd1 = addPrd1;
        this.addPrd2 = addPrd2;
        this.ctQty = ctQty;
        this.ctAdd = ctAdd;
        this.add1Qty = add1Qty;
        this.add2Qty = add2Qty;
        this.colorOpt = colorOpt;
        this.cartChecked = cartChecked;
    }
}

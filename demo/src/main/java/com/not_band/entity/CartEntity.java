package com.not_band.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "cart")
@Getter
@Setter
@IdClass(CartId.class)  // CartId를 복합키로 사용
public class CartEntity {

    @Id
    private String memId;  // @Id는 복합키에서 memId 사용

    @Id
    private String prdNo;  // @Id는 복합키에서 prdNo 사용

    private String addPrd1;
    private String addPrd2;
    private int ctQty;

    @CreationTimestamp
    private Timestamp ctAdd;

    // 추가된 필드
    private int add1Qty = 0; 
    private int add2Qty = 0;  
    private String colorOpt = "0";  
    private Boolean cartChecked = true;

    public String getMemId() {
        return memId;
    }

    public String getPrdNo() {
        return prdNo;
    }

    public void setCartId(CartId cartId) {
        this.memId = cartId.getMemId();
        this.prdNo = cartId.getPrdNo();
    }
}

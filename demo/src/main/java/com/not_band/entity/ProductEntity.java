package com.not_band.entity;

import com.not_band.dto.response.product.ProductResponseDto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    private String prdNo;

    private String prdModel;
    private String prdName;
    private int prdPrice;
    private String prdBrand;
    private String prdFacturer;
    private String prdOrigin;
    private int prdStock;
    private int prdDiscount;
    private String prdCategory;
    private Boolean prdRental;
    private String prdUrl;
    private String prdDetailUrl;

    public ProductEntity(ProductResponseDto dto) {
        this.prdNo = dto.getPrdNo();
        this.prdModel = dto.getPrdModel();
        this.prdName = dto.getPrdName();
        this.prdPrice = dto.getPrdPrice();
        this.prdBrand = dto.getPrdBrand();
        this.prdFacturer = dto.getPrdFacturer();
        this.prdOrigin = dto.getPrdOrigin();
        this.prdStock = dto.getPrdStock();
        this.prdDiscount = dto.getPrdDiscount();
        this.prdCategory = dto.getPrdCategory();
        this.prdRental = dto.getPrdRental();
        this.prdUrl = dto.getPrdUrl();
        this.prdDetailUrl = dto.getPrdDetailUrl();
    }
}


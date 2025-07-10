package com.not_band.entity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "order_info")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ordNo;
    
    private String memId;

    @CreationTimestamp
    private Timestamp ordDate;
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
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderProductEntity> orderProducts = new ArrayList<>();
}

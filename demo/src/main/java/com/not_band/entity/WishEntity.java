package com.not_band.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "wish")
@Getter
@Setter
public class WishEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer wishId;

    private String memId;

    private Integer resId;

    @CreationTimestamp
    private Timestamp wishAdd;
}
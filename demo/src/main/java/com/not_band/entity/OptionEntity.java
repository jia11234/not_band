package com.not_band.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "prdOption")
public class OptionEntity {
    @Id
    private Integer optionId;

    private String prdNo;
    private String optionValue;
    private int optionStock;
}

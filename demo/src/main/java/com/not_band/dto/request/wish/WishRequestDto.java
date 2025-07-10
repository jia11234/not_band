package com.not_band.dto.request.wish;

import java.sql.Timestamp;

import com.not_band.entity.WishEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishRequestDto {
    private Integer wishId;
    private String memId;
    private Integer resId;
    private Timestamp wishAdd;

    public static WishRequestDto fromEntity(WishEntity wishEntity) {
    WishRequestDto dto = new WishRequestDto();
    dto.setWishId(wishEntity.getWishId());
    dto.setMemId(wishEntity.getMemId());
    dto.setResId(wishEntity.getResId());
    dto.setWishAdd(wishEntity.getWishAdd());
    return dto;
    }
}

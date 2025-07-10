package com.not_band.dto.response.auth;

import java.time.LocalDate;

import com.not_band.entity.UserEntity;

import lombok.Getter;

@Getter
public class UserResponseDto {
    private String memId;
    private String memPasswd;
    private String memName;
    private String memNickname;
    private String memPhone;
    private String memEmail;
    private String memAddress;
    private String memDetailAddress;
    private String memZipcode;
    private Integer memPoint;
    private Integer memGame;
    private LocalDate lastGameDate;
    private LocalDate memAdd;

    public UserResponseDto(UserEntity user) {
        this.memId = user.getMemId();
        this.memPasswd = user.getMemPasswd();
        this.memName = user.getMemName();
        this.memNickname = user.getMemNick();
        this.memPhone = user.getMemPhone();
        this.memEmail = user.getMemEmail();
        this.memAddress = user.getMemAddress();
        this.memDetailAddress = user.getMemDetailAddress();
        this.memZipcode = user.getMemZipcode();
        this.memPoint = user.getMemPoint();
        this.memGame = user.getMemGame();
        this.lastGameDate = user.getLastGameDate();
        this.memAdd = user.getMemAdd();
    }
}
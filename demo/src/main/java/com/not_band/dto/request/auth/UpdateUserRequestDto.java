package com.not_band.dto.request.auth;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateUserRequestDto {
    private String nickName;
    @Pattern(regexp="^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,13}$")
    private String password;
    private String name;
    private String phoneNumber; 
    private String email;
    private String certificationNumber;
    private String zipCode; 
    private String address; 
    private String detailAddress; 
    private String building; 
}
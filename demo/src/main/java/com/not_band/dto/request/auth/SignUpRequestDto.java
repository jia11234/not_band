package com.not_band.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    private String id;

    @NotBlank
    @Pattern(regexp="^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,13}$")
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber; 

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String certificationNumber;

    private String zipCode; 
    private String address; 
    private String detailAddress; 
    private String building; 

    @NotBlank
    private String nickName;
}


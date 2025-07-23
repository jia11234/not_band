package com.not_band.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import com.not_band.dto.request.auth.SignUpRequestDto;
import com.not_band.dto.request.auth.UpdateUserRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="member")
@Table(name="member")
public class UserEntity {

    @Id
    @Column(name = "memId")
    private String memId;
    
    @Column(name = "memPasswd")
    private String memPasswd;
    
    @Column(name = "memName")
    private String memName;
    
    @Column(name = "memPhone")
    private String memPhone;
    
    @Column(name = "memEmail")
    private String memEmail;

    @Column(name = "memZipcode")
    private String memZipcode;
    
    @Column(name = "memAddress")
    private String memAddress;

    @Column(name = "memDetailAddress")
    private String memDetailAddress;

    @Column(name = "memBuilding")
    private String memBuilding;

    @Column(name = "memPoint")
    private Integer memPoint = 0;
    
    @Column(name = "role")
    private String role;

    @Column(name = "type")
    private String type;

    @Column(name = "memNick")
    private String memNick;

    @Column(name = "memGame")
    private Integer memGame=0;

    @Column(name = "memAdd")
    private LocalDate memAdd;

    @PrePersist
    protected void onCreate() {
        if (memAdd == null) {
            this.memAdd = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (memAdd == null) {
            this.memAdd = LocalDate.now();
        }
    }

    @CreationTimestamp
    private LocalDate lastGameDate;

    public UserEntity (SignUpRequestDto dto) {
        this.memId = dto.getId();
        this.memPasswd = dto.getPassword();
        this.memName = dto.getName();
        this.memPhone = dto.getPhoneNumber();
        this.memEmail = dto.getEmail();
        this.memZipcode = dto.getZipCode();
        this.memAddress = dto.getAddress();
        this.memDetailAddress = dto.getDetailAddress();
        this.memBuilding = dto.getBuilding();
        this.memNick = dto.getNickName();
        this.type="app";
        this.role="ROLE_USER";
    }

    public UserEntity (String memId, String memEmail, String type) {
        this.memId = memId;
        this.memPasswd = "pAssWord"; //OAuth 로그인일 경우
        this.memName = "user";
        this.memPhone = "user_phone";
        this.memEmail = memEmail;
        this.type = type; 
        this.role="ROLE_USER";
        this.memNick = memId;
    }

    public void setMemPoint(Integer memPoint) {
        this.memPoint = memPoint;
    }

    public String getNickname() {
        return this.memNick;
    }

    public UserEntity(UpdateUserRequestDto dto) {
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            this.memPasswd = dto.getPassword(); 
        }
        this.memName = dto.getName();
        this.memNick = dto.getNickName();
        this.memPhone = dto.getPhoneNumber();
        this.memEmail = dto.getEmail();
        this.memZipcode = dto.getZipCode();
        this.memAddress = dto.getAddress();
        this.memDetailAddress = dto.getDetailAddress();
        this.memBuilding = dto.getBuilding();
        this.type = "app";  
        this.role = "ROLE_USER";  
    }
}

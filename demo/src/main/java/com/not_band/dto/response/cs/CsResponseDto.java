package com.not_band.dto.response.cs;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CsResponseDto {
    private int csId;  
    private String csTitle;  
    private String csContent; 
    private LocalDateTime csAdd = LocalDateTime.now();  
    private boolean csPin = false;
}

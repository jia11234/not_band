package com.not_band.dto.request.Cs;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CsRequestDto {
    private int csId;  
    private String csTitle;  
    private String csContent; 
    private LocalDateTime csAdd = LocalDateTime.now();  
    private boolean csPin = false;
}

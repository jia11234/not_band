package com.not_band.common.Swagger;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@ApiResponses({
    @ApiResponse(
        responseCode = "202",
        description = "잘못된 경로 요청",
        content = @Content(
            schema = @Schema(
                example = "{\"code\":\"NP\",\"message\":\"No Permission.\"}"
            )
        )
    )
})

public @interface ApiResponseNP {
    
}

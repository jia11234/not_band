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
        responseCode = "400",
        description = "Validation failed",
        content = @Content(
            schema = @Schema(
                example = "{\"code\":\"VF\",\"message\":\"Validation failed.\"}"
            )
        )
    )
})

public @interface ApiResponseVF {
    
}

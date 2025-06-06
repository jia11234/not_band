package com.not_band.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // http://localhost:8080/images/resell/xxx.png 으로 접근 가능하게 설정
        registry.addResourceHandler("/api/v1/not_band/images/resell/**")
                .addResourceLocations("file:///C:/upload/resell/");
        registry.addResourceHandler("/api/v1/not_band/images/review/**")
        .addResourceLocations("file:///C:/upload/review/");
        registry.addResourceHandler("/api/v1/not_band/images/product/**")
                .addResourceLocations("file:///C:/upload/product/");
        registry.addResourceHandler("/api/v1/not_band/images/detail/**")
                .addResourceLocations("file:///C:/upload/detail/");
    }
}   
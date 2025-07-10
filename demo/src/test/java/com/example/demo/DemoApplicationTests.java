package com.example.demo;

import com.not_band.DemoApplication;  // DemoApplication 클래스 임포트
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = DemoApplication.class)  // 명시적으로 DemoApplication 클래스를 지정
class DemoApplicationTests {

    @Test
    void contextLoads() {
        // 이 테스트는 스프링 애플리케이션 컨텍스트가 정상적으로 로드되는지 확인합니다.
    }
}
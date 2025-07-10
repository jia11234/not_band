package com.not_band.service.order;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderKakaoPayService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${KakaoAK}") 
    private String KakaoAK;

    @Value("${spring.kakaoPay.approval-url}") 
    private String approval_url;

    @Value("${spring.kakaoPay.cancel-url}") 
    private String cancel_url;

    @Value("${spring.kakaoPay.fail-url}") 
    private String fail_url;

    public String kakaoPayReady(String itemName, String userId, int quantity, int totalAmount, int ordNo, String memId ) {
        // 파라미터 세팅
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("partner_order_id", "order_id");
        params.add("partner_user_id", userId);
        params.add("item_name", itemName);
        params.add("quantity", String.valueOf(quantity));
        params.add("total_amount", String.valueOf(totalAmount));
        params.add("tax_free_amount", "0");
        params.add("approval_url", approval_url+ "?memId=" + memId + "&ordNo=" + ordNo);
        params.add("cancel_url", cancel_url);
        params.add("fail_url", fail_url);

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization","KakaoAK " + KakaoAK);

        // 요청 생성
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            // 카카오페이 요청
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                request,
                Map.class
            );

            // 응답에서 redirect URL 추출
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("next_redirect_pc_url")) {
                return (String) body.get("next_redirect_pc_url");
            } else {
                throw new RuntimeException("카카오페이 응답에 redirect URL이 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("카카오페이 요청 실패: " + e.getMessage());
        }
    }
}


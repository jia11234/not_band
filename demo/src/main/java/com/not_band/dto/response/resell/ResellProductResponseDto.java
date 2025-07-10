package com.not_band.dto.response.resell;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ResellProductResponseDto {
        private Integer resId;                // 리셀 상품 고유 ID
        private String memNick;
        private String memId;              // 회원 ID
        private String resPrd;             // 상품명
        private Integer resPrice;          // 가격
        private List<String> resImgUrl;    // 이미지 URL 최대 5개
        private Integer resView;           // 조회수
        private Integer resLike;           // 찜 수
        private Integer resComment;        // 댓글 수
        private LocalDateTime resTime;     // 등록 시간
        private String resDelivery;        // 배송 정보 (예: 0원, 별도 등)
        private String resAddress;         // 직거래 주소
        private String resDetail;          // 상세 설명
        private List<String> resTag;      
        private String resCategory;
        private String resDelPrice; 
        private String resCondition;     // 태그 (예: #기타 #새상품)
}
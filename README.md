# 🎵 Not_Band: 3D 악기 체험 커머스 & 커뮤니티 플랫폼

<p align="left">
  <img src="https://github.com/user-attachments/assets/259766c8-1abf-4a7c-b64b-5656d5ab85e1" alt="Not_Band Logo" width="100"/>
</p>

> **음악 장비 커머스**, **중고 거래**, **실시간 채팅**,  
> 그리고 **React Three Fiber 기반 3D 악기 체험**을 결합한 풀스택 웹 프로젝트입니다.

<br/>

## 📍 주요 기능 (Key Features)

- **3D 악기 체험**  
  WebGL 기반 3D 악기 모델(일렉, 베이스, 키보드, 드럼)을 렌더링하여,  
  사용자가 직접 회전/확대하며 악기를 살펴보고 직접 연주도 가능함  
  (React Three Fiber & Three.js)

- **커머스 시스템**  
  상품 조회, 장바구니, KakaoPay 결제, 주문/배송 내역 확인 등 쇼핑몰 핵심 흐름 구현

- **중고 거래 게시판**  
  사용자 간 악기 거래가 가능한 중고 마켓 기능

- **실시간 1:1 채팅**  
  WebSocket 기반 실시간 채팅 (판매자 ↔ 구매자)

- **사용자 인증 및 보안**  
  JWT, OAuth2(Google/Kakao) 기반 인증 시스템

- **커뮤니티 (리뷰 & Q&A)** 
  상품 리뷰 작성, Q&A 게시판 운영

- **관리자 페이지**  
  상품/회원/주문 데이터 관리 전용 대시보드 구현

<br/>

## 🛠️ 기술 스택 (Tech Stack)

### Backend
- Java 17, Spring Boot 3.4.5
- Spring Security / JWT / OAuth2
- Spring Data JPA
- WebSocket / Stomp
- MySQL
- Gradle, Swagger

### Frontend
- React 18 (Vite)
- JavaScript, Axios, Zustand
- Material UI
- React Three Fiber / Three.js
- StompJS / SockJS

### DevOps & Tools
- Docker / Docker Compose
- Git / GitHub
- Postman / VSCode

<br/>

## 👥팀원
### 류지우 (팀장)
-기획부터 프론트엔드 전반 및 백엔드 전체 구현
### B (퍼블리싱)
-프론트엔드 퍼블리싱 일부 담당
### C (3D 및 디자인 담당)
-기획 일부 참여, 디자인 및 3d모델링, 3d 악기체험 구현

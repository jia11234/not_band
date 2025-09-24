# <h1>🎵 NOT_BAND </h1>
![Not_Band Mockup](https://github.com/user-attachments/assets/983e9acb-d67b-47d6-a954-e7b894ea24b0)



## 📍 주요 기능 (Key Features)

- **3D 악기 체험**<br>
  초보자가 자유롭게 악기를 체험할 수 있도록 만든 메뉴이며 각 악기는 초보자들에게 잘 팔리는 상품 및 판매하는 상품으로 모델링했습니다.<br>
  WebGL 기반 3D 악기 모델(일렉, 베이스, 키보드, 드럼)을 렌더링하여,
  사용자가 직접 회전/확대하며 악기를 살펴보는 구경모드와 직접 연주가 가능한 연주 모드가 있습니다.
  악기 별로 연주 모드 기능이 다릅니다.
  -  일렉 : 노트 모드, 코드 모드가 있고 코드 모드는 해당 코드를 누르면 동시에 울리며 조율된 소리가 출력됩니다.
  - 베이스 : 노트 모드, 코드 모드가 있고 코드 모드는 조율된 소리가 출력됩니다.
  - 키보드 : 계이름 ON/OFF가 가능합니다.
  - 드럼 : 악기명 ON/OFF가 가능합니다.
  
  
  ![악기체험](https://github.com/jia11234/not_band/blob/main/gif/3D%20%EC%95%85%EA%B8%B0%20%EC%B2%B4%ED%97%98.gif)<br><br>
- **커머스 시스템**  
  상품 조회, 장바구니, KakaoPay 결제, 주문/배송 내역 확인 등 쇼핑몰 핵심 흐름 구현했습니다.<br><br>
  ![커머스](https://github.com/jia11234/not_band/blob/main/gif/%EC%BB%A4%EB%A8%B8%EC%8A%A4%20%EC%8B%9C%EC%8A%A4%ED%85%9C.gif)<br><br>
  
- **중고 거래 게시판**<br>
  사용자가 부담없이 악기를 시작할 수 있으며,<br>
  중고 커뮤니티를 조성하여 자연스럽게 웹사이트 방문률을 높이는 메뉴입니다.<br>
  사용자 간 악기 거래와
  상품 등록 및 구매가 가능합니다.<br><br>
  ![중고거래](https://github.com/jia11234/not_band/blob/main/gif/%EC%A4%91%EA%B3%A0%EA%B1%B0%EB%9E%98%EA%B2%8C%EC%8B%9C%ED%8C%90.gif)<br><br>
- **실시간 1:1 채팅**  
  WebSocket 기반 실시간 채팅으로 두가지 기능이 있습니다.
  - 문의톡 : 관리자(판매자)한테 1:1 상품 문의가 가능합니다.
  - 중고 거래톡 : 중고를 구매 및 판매할 때 서로 간 대화가 가능합니다.<br>
  
  ![1:1](https://github.com/jia11234/not_band/blob/main/gif/1%EB%8C%801%20%EC%B1%84%ED%8C%85.gif)<br><br>
- **사용자 인증 및 보안**  
  JWT, OAuth2(Google/Kakao)로 로그인이 가능합니다<br><br>
  <img width="300" alt="스크린샷 2025-09-24 162255" src="https://github.com/user-attachments/assets/7c191e2b-6d9f-49b7-92ef-4a79287aebb3" /><br><br>
- **리뷰** <br>
  상품 리뷰 작성할 경우 100P를 획득합니다.<br><br>
  ![리뷰](https://github.com/jia11234/not_band/blob/main/gif/%ED%9B%84%EA%B8%B0.gif)<br><br>
- **관리자 페이지**  
  상품/회원/주문 데이터 관리 및 대시보드 구현했습니다.<br><br>
  ![관리자](https://github.com/jia11234/not_band/blob/main/gif/%EA%B4%80%EB%A6%AC%EC%9E%90.gif)<br><br>
- **미니 게임**<br>
  간단한 카드 짝 맞추기 게임으로 성공할경우 3P를 획득합니다.<br>
  ![미니게임](https://github.com/jia11234/not_band/blob/main/gif/%EA%B2%8C%EC%9E%84.gif)<br><br>

<br/>

## 📄DB ERD
<img width="1440" height="2097" alt="ERD" src="https://github.com/user-attachments/assets/6a18bb94-30db-4632-b36d-b33b9f6517c1" /><br><br>


## 👥팀원
### 류지우 (팀장)
-기획부터 프론트엔드 전반 및 백엔드 전체 구현
### 팀원1 (퍼블리싱)
-프론트엔드 퍼블리싱 일부 담당
### 팀원2 (3D 및 디자인 담당)
-기획 일부 참여, 디자인 및 3d모델링, 3d 악기체험 구현

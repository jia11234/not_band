# 🎵 NOT_BAND  

<img src="https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/overview.jpg" width="1200">


## 🗂️ 폴더 구성

### 📁 백엔드 (demo)  
`demo/src/main/java/com/not_band`  
- config  
- controller  
- dto  
- entity  
- repository  
- service  

### 📁 프론트엔드 (front)  
`front/`

#### 주요 폴더  
- `src/apis/index.js` : ✔️ 모든 API 함수 정리  
- `src/components` : 기능별 JSX 컴포넌트  
  - 3D : 3D 악기 체험 메뉴  
  - Admin : 관리자 기능  
  - Auth : 로그인/회원가입, 검색  
  - Cart : 장바구니  
  - Chat : 채팅  
  - Cs : 고객센터  
  - Event : 이벤트  
  - Game : 게임  
  - Inquiry : 문의  
  - Main : 메인 페이지, 헤더/푸터  
  - Mypage : 마이페이지  
  - Order : 주문  
  - Resell : 중고 마켓  
  - Review : 리뷰  
  - Instrument : 상품 조회  
- `src/components` : 위와 같이 기능별 CSS 폴더  

#### 정적 파일 (public)  
- 3D : glb 모델과 3D 악기 체험 이미지  
- images : 기능별 이미지 폴더  
- music : 악기 소리 파일  

---

## 📍 주요 기능 (Key Features)

### 🛒 온라인 판매 시스템  
상품 조회, 장바구니, 주문 기능을 구현하여 온라인에서 편리하게 제품을 구매할 수 있습니다.

![커머스](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/shop.gif)<br><br>



### 🔁 중고 마켓  
사용자는 상품 등록 및 실시간 채팅으로 거래가 가능합니다.  
부담없이 악기를 시작할 수 있으며,  
중고 커뮤니티를 조성하여 자연스럽게 웹사이트 방문률을 높이는 메뉴입니다.

![중고거래](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%EC%A4%91%EA%B3%A0%20%EB%A7%88%EC%BC%93.gif)<br><br>



### 💬 실시간 1:1 채팅  
WebSocket 기반 실시간 채팅으로 두 가지 기능이 있습니다.  
- 문의톡 : 관리자(판매자)한테 1:1 상품 문의  
- 중고 거래톡 : 중고 구매/판매 시 사용자 간 대화 가능

![실시간 채팅](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/1%EB%8C%801%20%EC%B1%84%ED%8C%85.gif)<br><br>



### 🎹 3D 악기 체험  
초보자가 자유롭게 악기를 체험할 수 있도록 만든 메뉴이며,  
각 악기는 초보자들에게 잘 팔리는 상품 및 판매하는 상품으로 모델링했습니다.  
WebGL 기반 3D 악기 모델(일렉, 베이스, 키보드, 드럼)을 렌더링  
- 구경 모드: 회전/확대 가능  
- 연주 모드: 악기별 기능 다름  
  - 일렉 : 노트 모드, 코드 모드 (해당 코드를 누르면 동시에 울리며 조율된 소리가 출력)  
  - 베이스 : 노트 모드, 코드 모드 (조율된 소리가 출력)  
  - 키보드 : 계이름 ON/OFF 가능  
  - 드럼 : 악기명 ON/OFF 가능

![3D 악기 체험](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/3D%20%EC%95%85%EA%B8%B0%20%EC%B2%B4%ED%97%98.gif)<br><br>



### 🔐 사용자 인증 및 보안  
JWT, OAuth2(Google/Kakao)로 로그인이 가능합니다

<img src="https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%EB%A1%9C%EA%B7%B8%EC%9D%B8.png" width="300"><br><br>


### 📝 리뷰  
상품 리뷰 작성할 경우 100P를 획득합니다.

![리뷰](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%ED%9B%84%EA%B8%B0.gif)<br><br>



### 🧑‍💼 관리자 페이지  
상품/회원/주문 데이터 관리 및 대시보드 구현했습니다

<img src="https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C.png" width="860">

![관리자](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%EA%B4%80%EB%A6%AC%EC%9E%90.gif)<br><br>



### 🃏 미니 게임  
간단한 카드 짝 맞추기 게임으로 성공할 경우 3P를 획득합니다.

![미니게임](https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/%EA%B2%8C%EC%9E%84.gif)<br><br>

---


## 📄 DB ERD  

<img src="https://github.com/jia11234/not_band/blob/main/README%20%EB%A6%AC%EC%86%8C%EC%8A%A4/ERD.png" width="1200"><br><br>

---

## 👥 팀원

###  류지우 (팀장 / 프론트엔드 / 백엔드)  
- 기획 및 DB 구조 설계  

**백엔드**  
- 전체 백엔드 구현 및 REST API 설계  
- Spring Boot 서버 구축 및 MySQL 연동  
- JWT, OAuth2(카카오·네이버) 로그인/회원가입 구현  
- KakaoPay 결제 기능 구현  
- WebSocket 기반 실시간 채팅 구현  

**프론트엔드**  
- 주요 서비스(SHOP, 중고마켓, 마이페이지 등) UI/UX 개발 (약 65% 담당)  
- Axios를 이용한 비동기 통신 및 API 연동  
- 반응형 웹 디자인 구현 (약 70% 담당)  
- 전체 기능 검수 및 최종 버그 수정  
- 미니 카드 게임 구현  
- 3D 악기 체험 중 키보드 렌더링 및 연주 구현  



###  팀원1 (퍼블리싱)  
- 주요 페이지 퍼블리싱  
  - 메인, 마이페이지, 상품 리뷰 등록, 중고 마켓 상세/등록, 이벤트, 고객센터  
- 관리자 페이지 퍼블리싱 (약 35% 담당)  
- 반응형 웹 디자인 구현 (약 10% 담당)  



###  팀원2 (3D / 디자인)  
- 기획 및 3D 모델링(일렉, 베이스, 키보드, 드럼) 제작  
- Three.js 활용한 3D 악기 체험 기능 구현  
- 전체 디자인 및 시각 요소 담당  
- 관리자 페이지 퍼블리싱 (약 30% 담당)  
- 반응형 웹 디자인 구현 (약 20% 담당)

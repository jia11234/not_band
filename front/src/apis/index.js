import axios from 'axios';
import { EmailCertificationRequestDto, IdCheckRequestDto } from "./request/auth";
import { IdCheckResponseDto } from "./response/auth";
import { ResponseDto } from "./response";

const responseHandler = (response) => {
    return response.data;
} //여기서 데이터로 반환하였기 때문에 .data가 필요 없다.

const errorHandler = (error) => {
    if (!error.response || !error.response.data) return null;
    return error.response.data;
}

let DOMAIN;
if (window.location.hostname === 'localhost') {
    DOMAIN = 'http://localhost:8080';
} else {
    DOMAIN = ''; // 아이피 주소
}

const API_DOMAIN = `${DOMAIN}/api/v1`;

export const SNS_SIGN_IN_URL = (type) => `${DOMAIN}/oauth2/authorization/${type}`;
const SIGN_IN_URL = () => `${API_DOMAIN}/not_band/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/not_band/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/not_band/id-check`;
const GET_USER_URL = (memId) => `${API_DOMAIN}/not_band/user/${memId}`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/not_band/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/not_band/check-certification`;
const DELTE_USER_URL = (memId) => `${API_DOMAIN}/not_band/user/delete/${memId}`;
const GET_USER_ALL_URL = () => `${API_DOMAIN}/not_band/user/all`;
const UPDATE_USER_URL = (memId, field, newValue) => `${API_DOMAIN}/not_band/user/update?memId=${memId}&field=${field}&newValue=${encodeURIComponent(newValue)}`
const GET_LOGIN_URL = () => `${API_DOMAIN}/not_band/login/records`;

const ALL_PRODUCTS_URL = () => `${API_DOMAIN}/not_band/products`;
const PRODUCTS_DELTE_URL = (prdNo) => `${API_DOMAIN}/not_band/products/delete/${prdNo}`;
const PRODUCTS_CATEGORY_URL = (category) => `${API_DOMAIN}/not_band/products/category/${category}`;
const PRODUCTS_DETAIL_URL = (prdNo) => `${API_DOMAIN}/not_band/products/detail/${prdNo}`;
const PRODUCTS_NEW_URL = () => `${API_DOMAIN}/not_band/products/new`;
const PRODUCTS_CHANGE_URL = (prdNo) => `${API_DOMAIN}/not_band/products/change/${prdNo}`;

const ADD_TO_CART_URL = () => `${API_DOMAIN}/not_band/cart/add`;
const GET_CART_URL = (memId) => `${API_DOMAIN}/not_band/cart/user/${memId}`;
const GET_CART_COUNT_URL = (memId) => `${API_DOMAIN}/not_band/cart/user/${memId}/count`;
const REMOVE_FROM_CART_URL = () => `${API_DOMAIN}/not_band/cart/remove`;
const REMOVEALL_FROM_CART_URL = (memId) => `${API_DOMAIN}/not_band/cart/removeAll/${memId}`;
const CART_UPDATE_QUANTITY_URL = () => `${API_DOMAIN}/not_band/cart/updateQuantity`;
const CART_UPDATE_CHECKED_URL = () => `${API_DOMAIN}/not_band/cart/cartChecked`;
const CART_UPDATE_CHECKED_ALL_URL = () => `${API_DOMAIN}/not_band/cart/cartCheckedAll`;

const ADD_TO_ORDER_URL = () => `${API_DOMAIN}/not_band/order/add`;
const GET_ORDER_URL = (memId) => `${API_DOMAIN}/not_band/order/user/${memId}`;
const GET_ORDER_ORDNO_URL = (ordNo) => `${API_DOMAIN}/not_band/order/${ordNo}`
const GET_ORDER_ALL_URL = () => `${API_DOMAIN}/not_band/order/all`;

const ADD_TO_RESELL_URL = () => `${API_DOMAIN}/not_band/resell/register`;
const ALL_RESELLS_URL = () => `${API_DOMAIN}/not_band/resell/list`;
const RESELL_USER_URL = (memId) => `${API_DOMAIN}/not_band/resell/list/${memId}`;
const RESELL_DETAIL_URL = (resId) => `${API_DOMAIN}/not_band/resell/${resId}`
const RESELL_VIEW_URL = (resId) => `${API_DOMAIN}/not_band/resell/view/${resId}`
const RESELL_DELTE_URL = (resId) => `${API_DOMAIN}/not_band/resell/delete/${resId}`
const RESELL_STATUS_URL = (resId, newStatus) => `${API_DOMAIN}/not_band/resell/${resId}/status?resComment=${newStatus}`;

const WISH_TOGGLE_URL = () => `${API_DOMAIN}/not_band/wish/toggle`
const GET_WISH_URL = (memId, resId) => `${API_DOMAIN}/not_band/wish/check?memId=${memId}&resId=${resId}`;
const GET_WISH_ALL_URL = (memId) => `${API_DOMAIN}/not_band/wish/${memId}`;

const CHAT_ROOM_URL = () => `${API_DOMAIN}/not_band/chat/create-room`;
const GET_CHAT_ROOM_URL = (memId) => `${API_DOMAIN}/not_band/chat/${memId}`;

const POINT_PLUS_URL = () => `${API_DOMAIN}/not_band/point-plus/`;
const POINT_MINUS_URL = () => `${API_DOMAIN}/not_band/point-minus/`;

const INQUIRY_ROOM_URL = () => `${API_DOMAIN}/not_band/inquiry/create-room`;
const GET_INQUIRY_URL = () => `${API_DOMAIN}/not_band/inquiry`;
const GET_INQUIRY_ROOM_URL = (memId) => `${API_DOMAIN}/not_band/inquiry/${memId}`;

const REVIEW_REGISTRATION_URL = () => `${API_DOMAIN}/not_band/review/register`;
const GET_REVIEW_ALL_URL = () => `${API_DOMAIN}/not_band/review/list`;
const GET_REVIEW_ID_URL = (revNo) => `${API_DOMAIN}/not_band/review/${revNo}`;
const GET_REVIEW_URL = (memId) => `${API_DOMAIN}/not_band/review/user/${memId}`;
const GET_REVIEW_PRODUCT_URL = (prdNo) => `${API_DOMAIN}/not_band/review/product/${prdNo}`;
const UPDATE_REVIEW_URL = (revNo) => `${API_DOMAIN}/not_band/review/update/${revNo}`;
const REMOVE_FROM_REVIEW_URL = (revNo) => `${API_DOMAIN}/not_band/review/${revNo}`;
const SEARCH_URL = (keyword) => `${API_DOMAIN}/not_band/search?keyword=${keyword}`;

const GET_GAME_URL = (memId) => `${API_DOMAIN}/not_band/play/${memId}`;
const GET_CS_URL = () => `${API_DOMAIN}/not_band/cs/all`;
const POST_CS_REGISTER_URL = () => `${API_DOMAIN}/not_band/cs/register`;
const DELETE_CS_URL = (csId) => `${API_DOMAIN}/not_band/cs/delete/${csId}`;
const TOGGLE_PIN_URL = (csId) => `${API_DOMAIN}/not_band/cs/${csId}/togglePin`;

//회원가입
export const signInRequest = async (requestBody) => {
    try {
        const response = await axios.post(SIGN_IN_URL(), requestBody)
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//로그인
export const signUpRequest = async (requestBody) => {
    try {
        const response = await axios.post(SIGN_UP_URL(), requestBody)
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//회원탈퇴
export const deleteUser = async (memId) => {
    try {
        const response = await axios.delete(DELTE_USER_URL(memId))
    } catch (error) {
        console.error("회원 탈퇴 중 오류 발생:", error);
    }
}

//아이디 중복 확인
export const idCheckRequest = async (requestBody) => {
    try {
        const response = await axios.post(ID_CHECK_URL(), requestBody)
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//이메일 인증
export const emailCertificationRequest = async (requestBody) => {
    try {
        const response = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//인증 확인
export const checkCertificationRequest = async (requestBody) => {
    try {
        const response = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

// 회원 정보 조회
export const getUserRequest = async (memId) => {
    try {
        const response = await axios.get(GET_USER_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return errorHandler(error);
    }
};

// 회원 전체 조회
export const getUserAll = async () => {
    try {
        const response = await axios.get(GET_USER_ALL_URL());
        return responseHandler(response);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return errorHandler(error);
    }
};

// 회원 정보 수정
export const updateUserInfo = async (memId, field, newValue) => {
    try {
        const response = await axios.put(UPDATE_USER_URL(memId, field, newValue));
        return response.data;
    } catch (error) {
        console.error("회원 정보 수정 중 오류 발생", error);
        return errorHandler(error);
    }
};


//상품 조회(배열)
export const allProducts = async () => {
    try {
        const response = await axios.get(ALL_PRODUCTS_URL());
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//상품 수정
export const productChange = async (prdNo, dto) => {
    try {
        const response = await axios.put(PRODUCTS_CHANGE_URL(prdNo), dto, {
            headers: {
                'Content-Type': 'application/json',  // 요청의 content type을 JSON으로 설정
            },
        });
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};


//상품 삭제(배열)
export const productDel = async (prdNo) => {
    try {
        const response = await axios.delete(PRODUCTS_DELTE_URL(prdNo));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//상품 카테고리
export const productCategory = async (category, sortType) => {
    try {
        const response = await axios.get(PRODUCTS_CATEGORY_URL(category), {
            params: {
                sortType: sortType
            }
        });
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//상품 디테일
export const productDetail = async (prdNo) => {
    try {
        const response = await axios.get(PRODUCTS_DETAIL_URL(prdNo));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//새로운 상품 추가
export const productNew = async (requestBody) => {
    try {
        const response = await axios.post(PRODUCTS_NEW_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//장바구니 추가
export const addToCartRequest = async (requestBody) => {
    try {
        const response = await axios.post(ADD_TO_CART_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//장바구니 조회
export const getCartRequest = async (memId) => {
    try {
        const response = await axios.get(GET_CART_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return errorHandler(error);
    }
}

//장바구니 갯수 조회
export const getCartCount = async (memId) => {
    try {
        const response = await axios.get(GET_CART_COUNT_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return errorHandler(error);
    }
}


//장바구니 하나만 삭제
export const removeFromCartRequest = async (requestBody) => {
    try {
        const response = await axios.delete(REMOVE_FROM_CART_URL(), { data: requestBody });
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//장바구니 모두 삭제
export const removeAllFromCartRequest = async (memId) => {
    try {
        const response = await axios.delete(REMOVEALL_FROM_CART_URL(memId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

// 장바구니 수량 업데이트
export const cartUpdateQuantity = async (requestBody) => {
    try {
        const response = await axios.patch(CART_UPDATE_QUANTITY_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}//patch는 data:이거 안함


// 장바구니 체크 여부
export const cartUpdateChecked = async (requestBody) => {
    try {
        const response = await axios.patch(CART_UPDATE_CHECKED_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

// 장바구니 전체 체크
export const cartUpdateCheckedAll = async (memId, selectAll) => {
    try {
        const response = await axios.put(`${CART_UPDATE_CHECKED_ALL_URL()}?memId=${memId}&selectAll=${selectAll}`);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};

//주문 추가
export const addToOrder = async (requestBody) => {
    try {
        const response = await axios.post(ADD_TO_ORDER_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//주문 조회
export const getOrderRequest = async (memId) => {
    try {
        const response = await axios.get(GET_ORDER_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error reqeust order:", error);
        return errorHandler(error);
    }
}

//주문 전체 조회
export const getOrderAll = async () => {
    try {
        const response = await axios.get(GET_ORDER_ALL_URL());
        return responseHandler(response);
    } catch (error) {
        console.error("Error reqeust order:", error);
        return errorHandler(error);
    }
}

//주문 아이디 조회
export const getOrderOrdNo = async (ordNo) => {
    try {
        const response = await axios.get(GET_ORDER_ORDNO_URL(ordNo));
        return responseHandler(response);
    } catch (error) {
        console.error("Error reqeust order:", error);
        return errorHandler(error);
    }
}

//중고 등록
export const addToResell = async (requestBody) => {
    try {
        const response = await axios.post(ADD_TO_RESELL_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//중고 전체 조회
export const allResells = async () => {
    try {
        const response = await axios.get(ALL_RESELLS_URL());
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//중고 사용자별 조회
export const resellUser = async (memId) => {
    try {
        const response = await axios.get(RESELL_USER_URL(memId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//중고 상태
export const resellStatus = async (resId, newStatus) => {
    try {
        const response = await axios.put(RESELL_STATUS_URL(resId, newStatus));
        return responseHandler(response);
    } catch (err) {
        console.error("상태 변경 실패", err);
    }
};

//중고 삭제
export const resellDelete = async (resId) => {
    try {
        const response = await axios.delete(RESELL_DELTE_URL(resId));
        return responseHandler(response);
    } catch (err) {
        console.error("상태 변경 실패", err);
    }
};


//중고 상품 디테일 조회
export const resellDetail = async (resId) => {
    try {
        const response = await axios.get(RESELL_DETAIL_URL(resId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//찜 목록 추가 삭제
export const wishToggle = async (requestBody) => {
    try {
        const response = await axios.post(WISH_TOGGLE_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//찜 목록 조회
export const getWishRequest = async (memId, resId) => {
    try {
        const response = await axios.get(GET_WISH_URL(memId, resId));
        return responseHandler(response);
    } catch (error) {
        console.error("진짜 에러 발생:", error);
        return errorHandler(error);
    }
}

//아이디로 찜 목록 조회
export const getWishAllRequest = async (memId) => {
    try {
        const response = await axios.get(GET_WISH_ALL_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error reqeust order:", error);
        return errorHandler(error);
    }
}


//중고상품 조회수
export const viewCount = async (resId) => {
    try {
        const response = await axios.post(RESELL_VIEW_URL(resId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//채팅방 생성
export const chatRoom = async (requestBody) => {
    try {
        const response = await axios.post(CHAT_ROOM_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//포인트 추가
export const pointPlus = async (memId, memPoint) => {
    try {
        const response = await axios.put(`${POINT_PLUS_URL()}${memId}?memPoint=${memPoint}`);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};

//포인트 사용
export const pointMinus = async (memId, memPoint) => {
    try {
        const response = await axios.put(`${POINT_MINUS_URL()}${memId}?memPoint=${memPoint}`);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};

//아이디로 전체 채팅방 조회
export const chatRoomAll = async (memId) => {
    try {
        const response = await axios.get(GET_CHAT_ROOM_URL(memId));
        return responseHandler(response);
    } catch (error) {
        console.error("Error reqeust order:", error);
        return errorHandler(error);
    }
}

//문의방 생성
export const inquiryRoom = async (requestBody) => {
    try {
        const response = await axios.post(INQUIRY_ROOM_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//문의방 조회
export const getInquiry = async (requestBody) => {
    try {
        const response = await axios.get(GET_INQUIRY_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}


//문의방 조회
export const getInquiryRoom = async (memId) => {
    try {
        const response = await axios.get(GET_INQUIRY_ROOM_URL(memId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰 등록
export const reviewRegistration = async (requestBody) => {
    try {
        const response = await axios.post(REVIEW_REGISTRATION_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰 전체 조회
export const getReviewAll = async () => {
    try {
        const response = await axios.get(GET_REVIEW_ALL_URL());
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰 조회
export const getReview = async (memId) => {
    try {
        const response = await axios.get(GET_REVIEW_URL(memId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰 (상품)조회
export const getReviewProduct = async (prdNo) => {
    try {
        const response = await axios.get(GET_REVIEW_PRODUCT_URL(prdNo));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}


//리뷰 (리뷰번호)조회
export const getReviewRevId = async (revNo) => {
    try {
        const response = await axios.get(GET_REVIEW_ID_URL(revNo));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰 수정
export const updateReview = async (revNo, data) => {
    try {
        const response = await axios.put(UPDATE_REVIEW_URL(revNo), data);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//리뷰삭제
export const removeReview = async (revNo) => {
    try {
        const response = await axios.delete(REMOVE_FROM_REVIEW_URL(revNo));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//검색
export const search = async (keyword) => {
    try {
        const response = await axios.get(SEARCH_URL(keyword));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//게임 실행!
export const getGame = async (memId) => {
    try {
        const response = await axios.post(GET_GAME_URL(memId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//공지사항
export const getCs = async () => {
    try {
        const response = await axios.get(GET_CS_URL());
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//로그인 기록 조회
export const getLogin = async () => {
    try {
        const response = await axios.get(GET_LOGIN_URL());
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
}

//cs업로드
export const csRegister = async (requestBody) => {
    try {
        const response = await axios.post(POST_CS_REGISTER_URL(), requestBody);
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};

//cs삭제
export const csDelete = async (csId) => {
    try {
        const response = await axios.delete(DELETE_CS_URL(csId));
        return responseHandler(response);
    } catch (error) {
        return errorHandler(error);
    }
};

//cs고정 토글
export const csTogglePinStatus = async (csId) => {
    try {
        const response = await axios.put(TOGGLE_PIN_URL(csId));
        return responseHandler(response); // 응답 처리 함수
    } catch (error) {
        return errorHandler(error); // 오류 처리 함수
    }
};




import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { productDetail, addToCartRequest, inquiryRoom, getCartCount } from "../../apis";
import "../../css/main/index.css";
import "../../css/instrument/productDetail.css";
import "../../css/instrument/instrument.css";
import ProductDetailTab from "./ProductDetailTab";

export default function ProductDetail({ setCartCount }) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(0); //상품 가격(고정)
  const [price2, setPrice2] = useState(0); //상품 수량 조절
  const [price3, setPrice3] = useState(0); //상품 추가용품1
  const [price4, setPrice4] = useState(0); //상품 토탈
  const [price5, setPrice5] = useState(0); //상품 추가용품2
  const [price6, setPrice6] = useState(0); //추가용품1 수량조절
  const [price7, setPrice7] = useState(0); //추가용품2 수량조절
  const [point, setPoint] = useState(0); //포인트
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [prevDiscount, setPrevDiscount] = useState(0);
  const location = useLocation();
  const prdNo = new URLSearchParams(location.search).get("prdNo");
  const [quantity, setQuantity] = useState(1);
  const [quantityOption, setQuantityOption] = useState(1);
  const [quantityOption2, setQuantityOption2] = useState(1);
  const [option, setOption] = useState([]);
  const [optionPrdNo, setOptionPrdNo] = useState("");
  const [optionPrdNo2, setOptionPrdNo2] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    option1: "",
    option2: "",
  });

  const [dataOption, setDataOption] = useState([]);

  const [dataOption2, setDataOption2] = useState([]);
  const [optionName, setOptionName] = useState("");
  const [optionName2, setOptionName2] = useState("");
  const [optionColor, setOptionColor] = useState("");
  const [optionBoolean, setOptionBoolean] = useState(false);
  const [id, setId] = useState("");

  const handleClose = () => {
    setOpen(false); // 모달 닫기
  };

  const handleClose2 = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band/login");
  };

  const handle2Close = () => {
    setOpen2(false); // 모달 닫기
  };

  const handle2Close2 = () => {
    setOpen2(false); // 모달 닫기
    navigate("/not_band/cart");
  };

  const fetchCartCount = async (id) => {
    const data = await getCartCount(id);
    setCartCount(data);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (prdNo) {
        try {
          const prdData = await productDetail(prdNo);
          setProduct(prdData);
          setPrice(prdData.prdPrice);
          setPrice2(prdData.prdPrice);
          setOption(prdData.options);
          setPoint(prdData.prdPrice * 0.02);
          if (prdData.prdDiscount >= 0) {
            const dis = Math.ceil(
              prdData.prdPrice / (1 - prdData.prdDiscount / 100),
            );
            setDiscount(prdData.prdDiscount);
            setPrevDiscount(dis);
          }

          if (prdData.prdCategory === "GBG") {
            setData((prevData) => ({
              ...prevData,
              option1: "베이스 앰프",
              option2: "관리 용품",
            }));
            setDataOption([
              {
                option:
                  "Darkglass- M500 Combo I 다크글래스 일렉트로닉 디지털 베이스 앰프 인피니티 콤보",
                prdNo: "AMP003",
                prdPrice: 149000,
              },
              {
                option: "이어폰 포켓 미니 베이스 기타 앰프",
                prdNo: "AMP004",
                prdPrice: 55000,
              },
            ]);

            setDataOption2([
              {
                option: "던롭 존 페트루치 재즈 ||| 기타 피크",
                prdNo: "GA001",
                prdPrice: 2200,
              },
              {
                option: "프라노이 명품 스타일 B601 Br 기타 스트랩",
                prdNo: "GA002",
                prdPrice: 120000,
              },
              {
                option: "어니볼 Hybrid 베이스 스트링",
                prdNo: "GA003",
                prdPrice: 33000,
              },
            ]);
          } else if (prdData.prdCategory === "GEG") {
            setData((prevData) => ({
              ...prevData,
              option1: "일렉 앰프",
              option2: "관리 용품",
            }));

            setDataOption([
              {
                option: "콜트 CMV112 일렉  기타 앰프",
                prdNo: "AMP002",
                prdPrice: 600000,
              },
              {
                option: "CHAMPION 50 펜더 기타 앰프",
                prdNo: "AMP001",
                prdPrice: 270000,
              },
            ]);

            setDataOption2([
              {
                option: "던롭 존 페트루치 재즈 ||| 기타 피크",
                prdNo: "GA001",
                prdPrice: 2200,
              },
              {
                option: "프라노이 명품 스타일 B601 Br 기타 스트랩",
                prdNo: "GA002",
                prdPrice: 120000,
              },
              {
                option: "어니볼 Hybrid 베이스 스트링",
                prdNo: "GA003",
                prdPrice: 33000,
              },
            ]);
          } else if (prdData.prdCategory.charAt(0) === "K") {
            setData((prevData) => ({
              ...prevData,
              option1: "악세사리",
            }));
            setDataOption([
              {
                option: "Lawrence 척척 톱니 쌍열스탠드 LMS-19B",
                prdNo: "KA001",
                prdPrice: 30500,
              },
              {
                option: "Lawrence 책상다리 키보드 스탠드",
                prdNo: "KA002",
                prdPrice: 52000,
              },
              {
                option: "카시오 SP-34 서스테인 페달",
                prdNo: "KA003",
                prdPrice: 138000,
              },
            ]);
          } else if (prdData.prdCategory.charAt(0) === "D") {
            setData((prevData) => ({
              ...prevData,
              option1: "악세사리",
            }));
            setDataOption([
              {
                option: "고급 벨벳 원단 카페트 드럼매트",
                prdNo: "DA001",
                prdPrice: 40000,
              },
              {
                option: "스틱캐디 빅퍼스 스틱홀더 VicFirth CADDY",
                prdNo: "DA002",
                prdPrice: 48000,
              },
              {
                option: "VONGOTT 아크릴 드럼쉴드 전용",
                prdNo: "DA003",
                prdPrice: 670000,
              },
            ]);
          }
        } catch (error) {
          console.error("삐용삐용 에러 발생쿠", error);
        }
      } else {
      }
    };

    fetchProduct();
  }, [prdNo]);

  useEffect(() => {
    if (option.length >= 1 && !optionBoolean) {
      setQuantity(0);
    }
    if (price > 0) {
      setPrice4(price * quantity + price6 + price7);
    }
  }, [price, quantity, price3, price5, price6, price7]);

  //가격 수량 변경
  const handlePrice = (value) => {
    setQuantity((prevQuantity) => {
      let newQuantity = prevQuantity;

      if (value === 1) {
        newQuantity = prevQuantity + 1;
      } else if (value === 2 && prevQuantity >= 2) {
        newQuantity = prevQuantity - 1;
      }

      const newPrice2 = price * newQuantity;
      setPrice2(newPrice2);
      setPrice4(newPrice2 + price3);

      return newQuantity;
    });
  };

  //추가상품1 수량 변경
  const handlePriceOption = (value) => {
    setQuantityOption((prevQuantity) => {
      let newQuantity = prevQuantity;

      if (value === 1) {
        newQuantity = prevQuantity + 1;
      } else if (value === 2 && prevQuantity >= 2) {
        newQuantity = prevQuantity - 1;
      }

      const newPrice2 = price3 * newQuantity;
      setPrice6(newPrice2);

      return newQuantity;
    });
  };

  //추가상품2 수량 변경
  const handlePriceOption2 = (value) => {
    setQuantityOption2((prevQuantity) => {
      let newQuantity = prevQuantity;

      if (value === 1) {
        newQuantity = prevQuantity + 1;
      } else if (value === 2 && prevQuantity >= 2) {
        newQuantity = prevQuantity - 1;
      }

      const newPrice2 = price5 * newQuantity;
      setPrice7(newPrice2);

      return newQuantity;
    });
  };

  //옵션 선택하면
  const handleOptionChange = (e) => {
    const option = e.target.value;

    if (option) {
      setQuantity(1);
      setOptionBoolean(true);
      if (option == "추가상품") {
        setOptionColor("");
      }
      setOptionColor(option);
    } else if (!option) {
      setQuantity(0);
      setOptionBoolean(false);
      setOptionColor("");
    }
  };

  //추가상품1 추가 하면
  const handleSelectChange = (e) => {
    const optionPrdNo = e.target.value;
    const option2 = dataOption.find((option) => option.prdNo === optionPrdNo); // prdNo를 이용해 prdPirce값을 찾음

    if (optionBoolean || option.length == 0) {
      if (option2) {
        setPrice3(option2.prdPrice);
        setPrice6(option2.prdPrice);
        setOptionName(option2.option);
        setOptionPrdNo(option2.prdNo);
      } else if (!option2) {
        setPrice3(0);
        setOptionName("");
        setOptionPrdNo("");
      }
    } else {
      alert("옵션을 선택해 주세요");
    }
  };

  //추가상품2 추가 하면
  const handleSelectChange2 = (e) => {
    const optionPrdNo = e.target.value;
    const option2 = dataOption2.find((option) => option.prdNo === optionPrdNo); // prdNo를 이용해 prdPirce값을 찾음

    if (optionBoolean || option.length == 0) {
      if (option2) {
        setPrice5(option2.prdPrice);
        setPrice7(option2.prdPrice);
        setOptionName2(option2.option);
        setOptionPrdNo2(option2.prdNo);
      } else if (!option2) {
        setPrice5(0);
        setOptionName2("");
        setOptionPrdNo2("");
      }
    } else {
      alert("옵션을 선택해 주세요");
    }
  };

  // 토큰에서 memId를 추출
  const getMemIdFromToken = (token) => {
    if (!token) return null;


    // 디코딩
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));

    return decoded.sub;
  };

  // 장바구니에 상품을 추가하는 함수
  const handleAddToCart = async () => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token); // memId 추출

    const generateUniqueId = () => {
      return "opt-" + Math.random().toString(36).substr(2, 9);
    };
    const optId = generateUniqueId();
    if (memId) {
      const cartItem = {
        memId,
        prdNo: product.prdNo,
        addPrd1: optionPrdNo || "",
        addPrd2: optionPrdNo2 || "",
        ctQty: quantity,
        add1Qty: optionPrdNo ? quantityOption : 0,
        add2Qty: optionPrdNo2 ? quantityOption2 : 0,
        colorOpt: optionColor || "",
      };


      try {
        // 장바구니 추가 API 호출
        await addToCartRequest(cartItem);
        setOpen2(true);
        fetchCartCount(memId);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      setOpen(true);
    }
  };

  // 리뷰
  const reviews = [
    {
      username: "하하핳",
      rating: 5,
      isBest: true,
      content: "상품이 생각보다 괜찮아요!",
      image: "/images/resell/img_upload.png",
    },
    {
      username: "최한솔",
      rating: 4,
      content: "배송이 빨라서 좋았어요.",
      image: "",
    },
    {
      username: "김이박",
      rating: 4,
      content: "상품이 생각보다 괜찮아요!",
      image: "/images/resell/img_upload.png",
    },
    {
      username: "최한솔",
      rating: 1,
      content: "배송이 빨라서 좋았어요.",
      image: "",
    },
    {
      username: "김이박",
      rating: 5,
      isBest: true,
      content: "상품이 생각보다 괜찮아요!",
      image: "/images/resell/img_upload.png",
    },
    {
      username: "최한솔",
      rating: 5,
      isBest: true,
      content: "배송이 빨라서 좋았어요.",
      image: "",
    },
    {
      username: "김이박",
      rating: 5,
      isBest: true,
      content: "상품이 생각보다 괜찮아요!",
      image: "/images/resell/img_upload.png",
    },
    {
      username: "최한솔",
      rating: 4,
      content: "배송이 빨라서 좋았어요.",
      image: "",
    },
    {
      username: "김이박",
      rating: 1,
      content: "상품이 생각보다 괜찮아요!",
      image: "/images/resell/img_upload.png",
    },
    {
      username: "최한솔",
      rating: 4,
      content: "배송이 빨라서 좋았어요.",
      image: "",
    },
    {
      username: "남궁민",
      rating: 3,
      content: "기대보다는 조금 아쉬웠어요.",
      image: "/images/resell/img_upload.png",
    },
  ];

  const formatNumber = (number) => {
    return number.toLocaleString("ko-KR"); // 한국식 천단위 콤마
  };

  // BEST 우선 정렬
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isBest && !b.isBest) return -1;
    if (!a.isBest && b.isBest) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleMoveToOrder = async () => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token); // memId 추출

    const generateUniqueId = () => {
      return "opt-" + Math.random().toString(36).substr(2, 9);
    };
    const optId = generateUniqueId();
    if (memId) {
      const cartItem = {
        memId,
        prdNo: product.prdNo,
        addPrd1: optionPrdNo || "",
        addPrd2: optionPrdNo2 || "",
        ctQty: quantity,
        add1Qty: optionPrdNo ? quantityOption : 0,
        add2Qty: optionPrdNo2 ? quantityOption2 : 0,
        colorOpt: optionColor || "",
        cartChecked: true,
      };

      navigate("/not_band/order", { state: cartItem });
    } else {
      setOpen(true);
    }
  };

  const handleInquire = async () => {
    try {
      const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
      const memId = getMemIdFromToken(token);
      if (memId) {
        const response = {
          memId: memId,
          selId: "admin",
        };
        const data = await inquiryRoom(response);
        if (!data.isNew) {
          window.location.href = `/not_band/inquiry?chatId=${data.chatId}&prdNo=${prdNo}`;
        }
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      alert("오류가 발생했습니다");
    }
  };

  return (
    <section className="product_detail">
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>로그인 후에만 사용할 수 있어여</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            닫기
          </Button>
          <Button
            onClick={handleClose2}
            sx={{
              color: "#FF4A01",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            로그인하기
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open2} onClose={handle2Close} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>장바구니에 상품이 추가되었습니다.</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handle2Close}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            닫기
          </Button>
          <Button
            onClick={handle2Close2}
            sx={{
              color: "#FF4A01",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            장바구니 가기
          </Button>
        </DialogActions>
      </Dialog>
      <button onClick={handleInquire}>
        <div>
          <img src="/images/instrument/inquire.png" alt="문의하기" />
          <p>문의하기</p>
        </div>
      </button>
      <div id="detailprd">
        <div className="de_prd_img">
          <img
            src={`http://localhost:8080/api/v1/not_band/images/product/${product.prdNo}.png`}
            alt={`${product.prdNo}`}
          />
        </div>
        <div className="de_prd">
          <div className="de_prd_ct">
            {discount ? (
              <div className="de_prd_top">
                <div className="de_title"> {product.prdName} </div>
                <div className="dis_group">
                  <div className="dis_group_list">
                    <div className="de_title4">
                      {discount.toLocaleString("ko-KR")}%
                    </div>
                    <div className="de_title2">
                      {price.toLocaleString("ko-KR")}원
                    </div>
                    <div className="de_title3">
                      &nbsp;{prevDiscount.toLocaleString("ko-KR")}원&nbsp;
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="de_prd_top">
                <div className="de_title"> {product.prdName} </div>
                <div className="de_title">
                  {price.toLocaleString("ko-KR")}원
                </div>
              </div>
            )}
            <div className="de_prd_mid">
              <div className="mid_desc">
                <div className="mid_list">구매 혜택</div>
                <div className="mid_text">
                  적립 포인트 2% : +{point.toLocaleString("ko-KR")}원
                </div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">배송비</div>
                <div className="mid_text">0원 / 주문시결제(선결제)</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list"></div>
                <div className="mid_text2">택배</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">모델명</div>
                <div className="mid_text">{product.prdModel}</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">브랜드</div>
                <div className="mid_text">{product.prdBrand}</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">제조사</div>
                <div className="mid_text">{product.prdFacturer}</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">원산지</div>
                <div className="mid_text">{product.prdOrigin}</div>
              </div>
              <div className="mid_desc">
                <div className="mid_list">상품재고</div>
                <div className="mid_text">{product.prdStock}개</div>
              </div>
            </div>
            <div className="de_prd_bottom">
              {option.length >= 1 && (
                <div className="bottom_group">
                  <div className="mid_list">옵션</div>
                  <div className="bottom_text">
                    <select name="" id="" onChange={handleOptionChange}>
                      <option value="">색상선택</option>
                      {option.map(
                        (option, index) =>
                          option && (
                            <option key={index} value={option.optionValue}>
                              {option.optionValue}
                            </option>
                          ),
                      )}
                    </select>
                  </div>
                </div>
              )}
              {data.option1 && (
                <div className="bottom_group">
                  <div className="mid_list">{data.option1}</div>
                  <div className="bottom_text">
                    <select name="" id="" onChange={handleSelectChange}>
                      <option value="">추가상품</option>
                      {Object.values(dataOption).map(
                        (option, index) =>
                          option && (
                            <option key={index} value={option.prdNo}>
                              {option.option}&nbsp;&nbsp;&nbsp;+
                              {option.prdPrice.toLocaleString()}
                            </option>
                          ),
                      )}
                    </select>
                  </div>
                </div>
              )}
              {data.option2 && (
                <div className="bottom_group">
                  <div className="mid_list">{data.option2}</div>
                  <div className="bottom_text">
                    <select name="" id="" onChange={handleSelectChange2}>
                      <option value="">추가상품</option>
                      {Object.values(dataOption2).map(
                        (option, index) =>
                          option && (
                            <option key={index} value={option.prdNo}>
                              {option.option}&nbsp;&nbsp;&nbsp;+
                              {option.prdPrice.toLocaleString()}
                            </option>
                          ),
                      )}
                    </select>
                  </div>
                </div>
              )}
              {option.length <= 0 && (
                <div className="bottom_prd">
                  <div className="bottom_prd_name">{product.prdName}</div>
                  <div>
                    <div class="qty_btn">
                      <p>{quantity}</p>
                      <div>
                        <button class="qty_plus" onClick={() => handlePrice(1)}>
                          <img src="/images/instrument/up.png" alt="+" />
                        </button>
                        <button
                          class="qty_minus"
                          onClick={() => handlePrice(2)}
                        >
                          <img src="/images/instrument/down.png" alt="-" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bottom_prd_price">
                    {price2.toLocaleString("ko-KR")}원
                  </div>
                </div>
              )}
              {option.length >= 1 && optionBoolean && (
                <div className="bottom_prd">
                  <div className="bottom_prd_name">
                    {product.prdName}+{optionColor}
                  </div>
                  <div>
                    <div class="qty_btn">
                      <p>{quantity}</p>
                      <div>
                        <button class="qty_plus" onClick={() => handlePrice(1)}>
                          <img src="/images/instrument/up.png" alt="+" />
                        </button>
                        <button
                          class="qty_minus"
                          onClick={() => handlePrice(2)}
                        >
                          <img src="/images/instrument/down.png" alt="-" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bottom_prd_price">
                    {price2.toLocaleString("ko-KR")}원
                  </div>
                </div>
              )}
              {price3 !== 0 && (
                <div className="bottom_prd">
                  <div className="bottom_prd_name">
                    <p>추가 :&nbsp;</p>
                    <p>{optionName}</p>
                  </div>
                  <div>
                    <div class="qty_btn">
                      <p>{quantityOption}</p>
                      <div>
                        <button
                          class="qty_plus"
                          onClick={() => handlePriceOption(1)}
                        >
                          <img src="/images/instrument/up.png" alt="+" />
                        </button>
                        <button
                          class="qty_minus"
                          onClick={() => handlePriceOption(2)}
                        >
                          <img src="/images/instrument/down.png" alt="-" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bottom_prd_price">
                    {price6.toLocaleString("ko-KR")}원
                  </div>
                </div>
              )}
              {price5 !== 0 && (
                <div className="bottom_prd">
                  <div className="bottom_prd_name">
                    <p>추가 :&nbsp;</p>
                    <p>{optionName2}</p>
                  </div>
                  <div>
                    <div class="qty_btn">
                      <p>{quantityOption2}</p>
                      <div>
                        <button
                          class="qty_plus"
                          onClick={() => handlePriceOption2(1)}
                        >
                          <img src="/images/instrument/up.png" alt="+" />
                        </button>
                        <button
                          class="qty_minus"
                          onClick={() => handlePriceOption2(2)}
                        >
                          <img src="/images/instrument/down.png" alt="-" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bottom_prd_price">
                    {price7.toLocaleString("ko-KR")}원
                  </div>
                </div>
              )}
              <div className="total_price">
                <div className="dtl_prd_total">총 합계금액</div>
                <div className="dtl_prd_price">
                  {price4.toLocaleString("ko-KR")}원
                </div>
              </div>
              <div className="dtl_btn">
                <button
                  type="submit"
                  class="dtl_btnWhite"
                  onClick={() => handleAddToCart()}
                >
                  장바구니
                </button>
                <button
                  type="submit"
                  class="dtl_btnRed"
                  onClick={() => handleMoveToOrder()}
                >
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductDetailTab product={product} />
    </section>
  );
}

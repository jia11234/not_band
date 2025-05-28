import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { allProducts, productDetail, addToCartRequest, getOrderAll, getCartCount } from "../../apis";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/main/index.css";
import "../../css/main/main.css";

export default function Index({setCartCount}) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [products, setProducts] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(true);
  const [prd, setPrd] = useState("");
  const [prdNo, setPrdNo] = useState("");
  const [option, setOption] = useState([]);
  const [optionColor, setOptionColor] = useState("");
  const [optionBoolean, setOptionBoolean] = useState(false);
  const [cartClear, setCartClear] = useState(false);
  const [order, setOrder] = useState([]);
  const [order2, setOrder2] = useState([]);
  const [top3Products, setTop3Products] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await allProducts();
    fetchOrder(data);
      const saleProducts = data
        .filter((p) => p.prdDiscount > 0)
        .sort((a, b) => b.prdDiscount - a.prdDiscount)
        .slice(0, 5);
      setProducts(saleProducts);

      const saleProducts2 = data
        .filter((p) => p.prdStock > 0)
        .sort((a, b) => b.prdStock - a.prdStock)
        .slice(0, 5);
      setProducts2(saleProducts2);

      const filtered = data
        .filter(item => item.prdRental === true)
        .slice(0, 8);

      setProducts3(filtered);
    };

    fetchProducts();
  }, []);
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0.1%", 
    responsive: [
      {
        breakpoint: 1440, 
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const sliderSettings_starter = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true, 
    centerMode: true,
    centerPadding: "0.1%", 
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const sliderSettings_banner = {
    dots: false, 
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: false,
  };

  const sliderSettings_title = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: false,
  };

  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const sliderRef_sale = useRef(null);
  const sliderRef_starter = useRef(null);

 const fetchOrder = async (data2) => {
    const data = await getOrderAll(); // 모든 주문 데이터를 가져옴
    setOrder(data);
    const product = data2;

    // prdNo 기반으로 상품 정보를 빠르게 찾기 위해 Map 생성
    const productMap = {};
    product.forEach((p) => {
      productMap[p.prdNo] = {
        prdName: p.prdName,
        prdPrice: p.prdPrice,
        prdDiscount: p.prdDiscount,
      };
    });

    // 상품별 총 판매 금액 계산
    const productSales = {};

    data.forEach((order) => {
      order.products.forEach((p) => {
        const { prdNo, ordQty } = p;
        const productInfo = productMap[prdNo];
        if (!productInfo) return; // 매칭 실패 시 건너뜀

        const { prdName, prdPrice, prdDiscount } = productInfo;
        const totalPrice = prdPrice * ordQty;

        if (productSales[prdNo]) {
          productSales[prdNo].totalAmount += totalPrice;
        } else {
          productSales[prdNo] = {
            prdNo,
            prdName,
            prdPrice,
            prdDiscount,
            totalAmount: totalPrice,
          };
        }
      });
    });

    // 판매 총액 기준 Top 3 추출 + 수량 계산
    const top3Products = Object.values(productSales)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        totalCount: Math.round(p.totalAmount / p.prdPrice),
        prdDiscount: p.prdDiscount,
      }));

    setTop3Products(top3Products);
  };

  const fetchCartCount = async (id) => {
    const data = await getCartCount(id);
    setCartCount(data);
  };

  const StarterItems = [
    {
      name: "마크 제임스 Modern Stand Jazz 재즈 베이스 기타-Black",
      price: 149000,
      image: "BG002",
    },
    {
      name: "카시오 CT-S200 전자피아노",
      price: 230000,
      image: "EK001",
    },
    {
      name: "콜트 CR100 일렉 기타",
      price: 260000,
      image: "EG005",
    },
    {
      name: "헥스 기타 5현 베이스기타-Ivory",
      price: 398000,
      image: "BG003",
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings_best = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0.1%", 
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3, 
        },
      },
    ],
  };

  const sliderSettings_sale = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, 
    centerMode: true,
    centerPadding: "0.1%",
    responsive: [
      {
        breakpoint: 1440, 
        settings: {
          slidesToShow: 3, 
        },
      },
    ],
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCart = async (prd, prd2) => {
    const prdData = await productDetail(prd2);
    setPrd(prd);
    setPrdNo(prd2);
    setOption(prdData.options);
    setOpen(true);
  };

  const getMemIdFromToken = (token) => {
    if (!token) return null;

    // 디코딩
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));

    return decoded.sub;
  };

  const handleAddToCart = async () => {
    const token = cookies.accessToken; 
    const memId = getMemIdFromToken(token); 

    const generateUniqueId = () => {
      return "opt-" + Math.random().toString(36).substr(2, 9);
    };
    const optId = generateUniqueId();
    if (memId == null) {
      setLogin(false);
    }
    if (memId) {
      const cartItem = {
        memId,
        prdNo: prdNo,
        addPrd1: "",
        addPrd2: "",
        ctQty: 1,
        add1Qty: 0,
        add2Qty: 0,
        colorOpt: optionColor || "",
      };


      try {
        await addToCartRequest(cartItem);
        setCartClear(true);
        fetchCartCount(memId);
        setTimeout(() => {
          setOpen(false);
          setCartClear(false);
        }, 2000);
      } catch (error) {
      }
    }
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;

    if (option) {
      setOptionBoolean(true);
      if (option == "추가상품") {
        setOptionColor("");
      }
      setOptionColor(option);
    } else if (!option) {
      setOptionBoolean(false);
      setOptionColor("");
    }
  };

  useEffect(() => {
    if (option.length > 0) {
      handleOptionChange({ target: { value: option[0].optionValue } });
    }
  }, [option]);

  return (
    <section id="main">
      <div className="main_header_box"></div>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { width: "360px", mx: "auto", px: 0 } } }}
      >
        <DialogTitle>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <img
              src={`http://localhost:8080/api/v1/not_band/images/product/${prdNo}.png`}
              alt={`${prdNo}`}
              style={{ width: "100px", height: "100px", marginRight: "20px" }}
            />
            <p style={{ wordBreak: "keep-all" }}>{prd}</p>
          </div>
        </DialogTitle>
        {!login && (
          <p
            style={{
              color: "#FF4A01",
              fontSize: "17px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="material-symbols-outlined">error</span>&nbsp;
            로그인 후 이용가능합니다.
          </p>
        )}
        {cartClear && (
          <p
            style={{
              color: "#FF4A01",
              fontSize: "17px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
            }}
          >
            장바구니에 추가되었습니다.
          </p>
        )}
        <DialogContent>
          {option.length >= 1 && (
            <div className="cart_color_select">
              <div>색상선택</div>
              <div>
                <select name="color" onChange={handleOptionChange}>
                  {option.map(
                    (opt, index) =>
                      opt.optionValue && (
                        <option
                          key={index}
                          value={opt.optionValue}
                          defaultValue={option[0]?.optionValue}
                        >
                          {opt.optionValue}
                        </option>
                      ),
                  )}
                </select>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "130px",
            }}
          >
            취소
          </Button>
          <Button
            sx={{
              color: "#FF4A01",
              fontSize: "19px",
              fontWeight: "500",
              width: "130px",
            }}
            onClick={() => handleAddToCart()}
          >
            장바구니 담기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="main_banner">
        <div className="main_banner_slider">
          {/* 메인베너 */}
          <Slider
            {...sliderSettings_banner}
            ref={(slider) => {
              sliderRef1.current = slider;
              setNav1(slider);
            }}
            asNavFor={nav2}
          >
            <img src="/images/main/m_banner1.png" alt="Main Banner1" />
            <img src="/images/main/m_banner2.png" alt="Main Banner2" />
            <img src="/images/main/m_banner3.png" alt="Main Banner3" />
            <img src="/images/main/m_banner4.png" alt="Main Banner4" />
          </Slider>
        </div>

        {/* 제목 슬라이드 */}
        <div className="main_title_slider">
          <Slider
            {...sliderSettings_title}
            ref={(slider) => {
              sliderRef2.current = slider;
              setNav2(slider);
            }}
            asNavFor={nav1}
          >
            <img
              src="/images/main/m_banner1_title.png"
              alt="Main Banner1 Title"
            />
            <img
              src="/images/main/m_banner2_title.png"
              alt="Main Banner2 Title"
            />
            <img
              src="/images/main/m_banner3_title.png"
              alt="Main Banner3 Title"
            />
            <img
              src="/images/main/m_banner4_title.png"
              alt="Main Banner4 Title"
            />
          </Slider>
        </div>

        <div className="banner_bottom"></div>

        {/* 버튼 */}
        <button
          onClick={() => {
            sliderRef1.current.slickPrev();
            sliderRef2.current.slickPrev();
          }}
          className="m_before"
        ></button>
        <button
          onClick={() => {
            sliderRef1.current.slickNext();
            sliderRef2.current.slickNext();
          }}
          className="m_after"
        ></button>
      </div>

      {/* 3d 메뉴 */}
      <div className="main_3d">
        <Link to={"/"}>
          <div className="main_3d_title">
            <img src="/images/main/3D_text.png" alt="" />
          </div>
        </Link>
        <div className="threeD_menu">
          <Link to="/not_band/bass" className="threeD_menu_icon" />
          <Link to="/not_band/elec" className="threeD_menu_icon" />
          <Link to="/not_band/3d" className="threeD_menu_icon" />
          <Link to="/not_band/drum" className="threeD_menu_icon" />
        </div>
      </div>

      <div className="threeD_info">
        <img src="/images/main/info_bgimg.png"/>
      </div>

      {/* 입문자 */}
      <div className="starter_background">
        <img src="/images/main/background_yellow.png"/>
      </div>
      <div className="startershop_group">
        <div className="starter_title">
          <img src="/images/main/StarterShop.png" alt="" />
          <h1>초보자를 위한 검증된 추천 아이템!</h1>
        </div>
        <div className="starter_slider">
          <Slider ref={sliderRef_starter} {...sliderSettings_starter}>
            {products3.map((num, index) => (
              <div className="starter_prd_group" key={index}>
                <div className="starter_img_cart">
                  <Link to={`/not_band/instrument-detail?prdNo=${num.prdNo}`}>
                    <img
                      src={`http://localhost:8080/api/v1/not_band/images/product/${num.prdNo}.png`}
                      alt={`${num.prdNo}`}
                    />
                  </Link>
                  <button
                    className="bestL_prd_cart"
                    onClick={() => handleCart(num.prdName, num.prdNo)}
                  >
                    <img src="/images/main/best_plus.png" alt="" />
                  </button>
                </div>
                {num.prdDiscount == 0 ? (
                  <>
                    <p>{num.prdName}</p>
                    <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                  </>
                ) : (
                  <>
                    <p>{num.prdName}</p>
                    <div className="main_discount_group">
                      <p>
                        {num.prdDiscount.toLocaleString("ko-KR")} %
                      </p>
                      <div>
                        <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                        <p>
                          {Math.ceil(
                            num.prdPrice / (1 - num.prdDiscount / 100),
                          ).toLocaleString("ko-KR")}
                          원
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* 베스트 */}
      <div className="best_background">
        <picture>
          <source media="(min-width: 1570px)" srcSet="/images/main/background_green.png" />
          <source media="(min-width: 751px) and (max-width: 1569px)" srcSet="/images/main/background_green2.png" />
          <source media="(max-width: 750px)" srcSet="/images/main/background_green3.png" />
          <img src="/images/main/background_green.png" alt="background" />
        </picture>
      </div>
      <div className="best_group">
        <div className="best_title">
          <img src="/images/main/Best_title.png" alt="" />
        </div>
        {isMobile ? (
          // ✅ 모바일: 슬라이드로 보여주기
          <div className="best_slider">
            <Slider {...sliderSettings_best}>
              {top3Products.map((item, index) => (
                <div className="starter_prd_group" key={index}>
                  <div className="starter_img_cart">
                    <Link
                      to={`/not_band/instrument-detail?prdNo=${item.prdNo}`}
                    >
                      <img
                        src={`http://localhost:8080/api/v1/not_band/images/product/${item.prdNo}.png`}
                        alt={item.prdName}
                      />
                    </Link>
                    <button
                      className="bestL_prd_cart"
                      onClick={() => handleCart(item.prdName, item.prdNo)}
                    >
                      <img src="/images/main/best_plus.png" alt="" />
                    </button>
                  </div>
                {item.prdDiscount == 0 ? (
                  <>
                    <p>{item.prdName}</p>
                    <p>{item.prdPrice.toLocaleString("ko-KR")}원</p>
                  </>
                ) : (
                  <>
                    <p>{item.prdName}</p>
                    <div className="main_discount_group">
                      <p>
                        {item.prdDiscount.toLocaleString("ko-KR")} %
                      </p>
                      <div>
                        <p>{item.prdPrice.toLocaleString("ko-KR")}원</p>
                        <p>
                          {Math.ceil(
                            item.prdPrice / (1 - item.prdDiscount / 100),
                          ).toLocaleString("ko-KR")}
                          원
                        </p>
                      </div>
                    </div>
                  </>
                )}
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          // ✅ 데스크탑: 기존 레이아웃
          <div className="best_content_group">
            <div className="best_left">
                {top3Products.length > 0 && top3Products[0] && (
                  <>
                  <div className="best_img_cart">
                    <Link
                      to={`/not_band/instrument-detail?prdNo=${top3Products[0].prdNo}`}
                    >
                      <img
                        src={`http://localhost:8080/api/v1/not_band/images/product/${top3Products[0].prdNo}.png`}
                        alt={top3Products[0].prdNo}
                      />
                    </Link>
                    <button
                      className="bestL_prd_cart2"
                      onClick={() =>
                        handleCart(top3Products[0].prdName, top3Products[0].prdNo)
                      }
                    >
                      <img src="/images/main/best_plus.png" alt="" />
                    </button>
                    </div>
                    {top3Products[0].prdDiscount == 0 ? (
                      <>
                        <p>{top3Products[0].prdName}</p>
                        <p>{top3Products[0].prdPrice.toLocaleString("ko-KR")}원</p>
                      </>
                    ) : (
                      <>
                        <p>{top3Products[0].prdName}</p>
                        <div className="main_discount_group">
                          <p>
                            {top3Products[0].prdDiscount.toLocaleString("ko-KR")} %
                          </p>
                          <div>
                            <p>{top3Products[0].prdPrice.toLocaleString("ko-KR")}원</p>
                            <p>
                              {Math.ceil(
                                top3Products[0].prdPrice / (1 - top3Products[0].prdDiscount / 100),
                              ).toLocaleString("ko-KR")}
                              원
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
            </div>
            <div className="best_right">
              {products2.slice(1).map((num, index) => (
                <div className="best_content_r" key={index}>
                  <div className="best_img_cart">
                    <Link to={`/not_band/instrument-detail?prdNo=${num.prdNo}`}>
                      <img
                        src={`http://localhost:8080/api/v1/not_band/images/product/${num.prdNo}.png`}
                        alt={num.prdName}
                      />
                    </Link>
                    <button
                      className="bestL_prd_cart"
                      onClick={() => handleCart(num.prdName, num.prdNo)}
                    >
                      <img src="/images/main/best_plus.png" alt="" />
                    </button>
                  </div>
                  <p>{num.prdName}</p>
                  <p>{num.prdPrice.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 세일 */}
      <div className="sale_background">
        <img src="/images/main/background_blue.png"/>
      </div>
      <div className="sale_group">
        <div className="content_title_sale">
          <img src="/images/main/Sale_title.png" alt="" />
          <h1>한정 세일 상품을 노려보세요!</h1>
        </div>
        {isMobile ? (
          // ✅ 모바일: 슬라이드 형식
          <div className="sale_slider">
            <Slider ref={sliderRef_sale} {...sliderSettings_sale}>
              {products.map((num, index) => (
                <div className="starter_prd_group" key={index}>
                  <div className="starter_img_cart">
                    <Link to={`/not_band/instrument-detail?prdNo=${num.prdNo}`}>
                      <img
                        src={`http://localhost:8080/api/v1/not_band/images/product/${num.prdNo}.png`}
                        alt={num.prdName}
                      />
                    </Link>
                    <button
                      className="bestL_prd_cart"
                      onClick={() => handleCart(num.prdName, num.prdNo)}
                    >
                      <img src="/images/main/best_plus.png" alt="" />
                    </button>
                  </div>
                  {num.prdDiscount == 0 ? (
                  <>
                    <p>{num.prdName}</p>
                    <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                  </>
                ) : (
                  <>
                    <p>{num.prdName}</p>
                    <div className="main_discount_group">
                      <p>
                        {num.prdDiscount.toLocaleString("ko-KR")} %
                      </p>
                      <div>
                        <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                        <p>
                          {Math.ceil(
                            num.prdPrice / (1 - num.prdDiscount / 100),
                          ).toLocaleString("ko-KR")}
                          원
                        </p>
                      </div>
                    </div>
                  </>
                )}
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          // ✅ 데스크탑: 기존 레이아웃
          <div className="slider_container">
            <Slider ref={sliderRef_sale} {...sliderSettings}>
              {products.map((num, index) => (
                <div className="sale_content" key={index}>
                  <div className="prd_image_area">
                    <Link
                      to={`/not_band/instrument-detail?prdNo=${num.prdNo}`}
                      onClick={(e) => {
                        if (window.isDragging) e.preventDefault();
                      }}
                      onMouseDown={() => (window.isDragging = false)}
                      onMouseMove={() => (window.isDragging = true)}
                    >
                      <img
                        src={`http://localhost:8080/api/v1/not_band/images/product/${num.prdNo}.png`}
                        alt={num.prdName}
                      />
                    </Link>
                    <button
                      className="bestL_prd_cart"
                      onClick={() => handleCart(num.prdName, num.prdNo)}
                    >
                      <img src="/images/main/best_plus.png" alt="" />
                    </button>
                  </div>
                    {num.prdDiscount == 0 ? (
                      <>
                        <p>{num.prdName}</p>
                        <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                      </>
                    ) : (
                      <>
                        <p>{num.prdName}</p>
                        <div className="main_discount_group">
                          <p>
                            {num.prdDiscount.toLocaleString("ko-KR")} %
                          </p>
                          <div>
                            <p>{num.prdPrice.toLocaleString("ko-KR")}원</p>
                            <p>
                              {Math.ceil(
                                num.prdPrice / (1 - num.prdDiscount / 100),
                              ).toLocaleString("ko-KR")}
                              원
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}

export function ErrorComponent() {
  return (
    <div className="not_found">
      <p className="material-symbols-outlined">error</p>
      <h1>찾으시는 페이지가 없습니다.</h1>
      <p>
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        입력하신 경로가 정확한지 다시 한번 확인해 주시기 바랍니다.
      </p>
      <button className="btnRed">
        <Link to="/">홈으로</Link>
      </button>
    </div>
  );
}

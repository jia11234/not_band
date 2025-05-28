import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { productDetail, addToCartRequest, getCartCount } from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/instrument/starter.css";

export default function ProductList({ products, value2, setCartCount }) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [row, setRow] = useState(4);
  const navigate = useNavigate();
  const [starter, setStarter] = useState([]);
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(true);
  const [prd, setPrd] = useState("");
  const [prdNo, setPrdNo] = useState("");
  const [option, setOption] = useState([]);
  const [optionColor, setOptionColor] = useState("");
  const [optionBoolean, setOptionBoolean] = useState(false);
  const [cartClear, setCartClear] = useState(false);

  useEffect(() => {
    const updateRow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRow(1); // 모바일
      } else if (width < 1330) {
        setRow(2); // 태블릿
      } else if (width < 1792) {
        setRow(3);
      } else {
        setRow(4);
      }
    };

    updateRow();
    window.addEventListener("resize", updateRow);
    return () => window.removeEventListener("resize", updateRow);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchCartCount = async (id) => {
    const data = await getCartCount(id);
    setCartCount(data);
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
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token); // memId 추출

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
        // 장바구니 추가 API 호출
        await addToCartRequest(cartItem);
        setCartClear(true);
        fetchCartCount(memId);
        setTimeout(() => {
          setOpen(false);
          setCartClear(false);
        }, 3000);
      } catch (error) {
      }
    }
  };

  const filteredProducts = products.filter((_, index) => {
    if (row === 3) {
      if (value2 === 1) return index >= 0 && index < 18;
      if (value2 === 2) return index >= 18 && index < 36;
      if (value2 === 3) return index >= 36 && index < 48;
    } else {
      if (value2 === 1) return index >= 0 && index < 16;
      if (value2 === 2) return index >= 16 && index < 32;
      if (value2 === 3) return index >= 32 && index < 48;
    }
    return false;
  });

  //옵션 선택하면
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
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { width: "360px", mx: "auto", px: 0 } } }}
        disableScrollLock
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
            <div className="cart_color_select" >
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
              marginLeft: "0px",
            }}
          >
            닫기
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
      <div className="product_group_list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div className="product_group" key={index}>
              <div className="product_img">
                <Link to={`/not_band/instrument-detail?prdNo=${product.prdNo}`}>
                <img src={`http://localhost:8080/api/v1/not_band/images/product/${product.prdNo}.png`} />
                </Link>
              </div>
              <button
                onClick={() => handleCart(product.prdName, product.prdNo)}
                style={{ zIndex: 80 }}
              >
                <img src="/images/main/best_plus.png" alt="" />
              </button>
              {product.prdDiscount == 0 ? (
                <div className="shop_list_group">
                  <h3>{product.prdName}</h3>
                  <p>{product.prdPrice.toLocaleString("ko-KR")}원</p>
                </div>
              ) : (
                <div className="shop_list_group">
                  <h3>{product.prdName}</h3>
                  <div className="shop_discount_group">
                    <p className="shop_discount_group_p">
                      {product.prdDiscount} %
                    </p>
                    <div>
                      <p>{product.prdPrice.toLocaleString("ko-KR")}원</p>
                      <p>
                        {Math.ceil(
                          product.prdPrice / (1 - product.prdDiscount / 100),
                        ).toLocaleString("ko-KR")}
                        원
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>상품이 존재하지 않습니다.</div>
        )}
      </div>
    </>
  );
}

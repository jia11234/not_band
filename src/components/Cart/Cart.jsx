import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; //모달달달
import {
  getCartRequest,
  removeFromCartRequest,
  cartUpdateQuantity,
  removeAllFromCartRequest,
  cartUpdateChecked,
  cartUpdateCheckedAll,
  allProducts,
  getCartCount,
} from "../../apis";
import OrderStep from "../Order/OrderStep";
import CartList from "./CartList";
import CartTotal from "./CartTotal";
import "../../css/main/index.css";
import "../../css/cart/cart.css";

export default function Cart({ setCartCount }) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [cartSelectAll, setCartSelectAll] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]); //상품 목록
  const [selectAll, setSelectAll] = useState(); // 전체 선택
  const [cartSelected, setCartSelected] = useState([]);
  const [open, setOpen] = useState(false); //모달
  const navigate = useNavigate();
  const [orderStep, setOrderStep] = useState(1); //주문단계
  const [memId, setMemId] = useState(null);
  const [change, setChange] = useState(0);
  const [reload, setReload] = useState(false);
  const [changeAll, setChangeAll] = useState(0);
  const [prices, setPrices] = useState({}); // 가격 관리

  const handleClose = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band");
  };

  const handleClose2 = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band/login");
  };

  const fetchCart = async (memId) => {
    try {
      const data = await getCartRequest(memId); // 수정된 API 호출
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await allProducts();
      setProducts(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCartCount = async (id) => {
    const data = await getCartCount(id);
    setCartCount(data);
  };

  const deleteCart = async (memId, deleteCart) => {
    try {
      const deleteCart2 = {
        memId,
        prdNo: deleteCart,
      };
      await removeFromCartRequest(deleteCart2);
      fetchCart(memId);
      fetchCartCount(memId);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAllCart = async (memId) => {
    try {
      const data = await removeAllFromCartRequest(memId); // 수정된 API 호출
      fetchCart(memId);
      fetchCartCount(memId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const cartUpdate = async (memId, prdNo, newQuantity) => {
    try {
      const response = {
        memId,
        prdNo,
        ctQty: newQuantity,
      };
      await cartUpdateQuantity(response);
      fetchCart(memId);
      fetchCartCount(memId);
    } catch (err) {
      setError(err.message);
    }
  };

  const cartCheckedUpdate = async (memId, prdNo, cartChecked) => {
    try {
      const response = {
        memId,
        prdNo,
        cartChecked,
      };
      await cartUpdateChecked(response);
      fetchCart(memId);
    } catch (err) {
      setError(err.message);
    }
  };

  const cartCheckedUpdateAll = async (memId, selectAll) => {
    try {

      await cartUpdateCheckedAll(memId, selectAll);
      fetchCart(memId);
    } catch (err) {
      setError(err.message);
    }
  };

  const getMemIdFromToken = (token) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩
    return decoded.sub; // memId 반환
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchCart(memId);
      fetchProducts();
    } else {
      setOpen(true);
    }
  }, []);

  const getProductName = (prdNo) => {
    const product = products.find((item) => item.prdNo === prdNo);
    return product ? product.prdName : "상품명 없음";
  };

  const getProductName5 = (prdNo) => {
    const product = products.find((item) => item.prdNo === prdNo);
    return product ? product.prdPrice : "상품명 없음";
  }; //상품가격

  const getProductName6 = (prdNo) => {
    const product = products.find((item) => item.prdNo === String(prdNo));

    if (product) {
      const { prdPrice, prdDiscount } = product;
      if (prdDiscount > 0) {
        const discountedPrice = Math.ceil(prdPrice * (1 - prdDiscount / 100));
        return discountedPrice;
      } else {
        return 0;
      }
    }

    return "상품 정보 없음";
  };

  const getProductName2 = (addPrd1) => {
    const product = products.find((item) => item.prdNo === addPrd1); // addPrd1을 사용하여 상품 찾기
    return product ? product.prdName : "상품명 없음";
  };

  const getProductPrice1 = (addPrd1) => {
    const product = products.find((item) => item.prdNo === addPrd1); // addPrd1을 사용하여 상품 가격 찾기
    return product ? product.prdPrice : "상품명 없음";
  };

  const getProductPrice2 = (addPrd2) => {
    const product = products.find((item) => item.prdNo === addPrd2); // addPrd1을 사용하여 상품 가격 찾기
    return product ? product.prdPrice : "상품명 없음";
  };

  const getProductName3 = (addPrd2) => {
    const product = products.find((item) => item.prdNo === addPrd2); // addPrd2을 사용하여 상품 찾기
    return product ? product.prdName : "상품명 없음";
  };

  const toggleSelectAll = (memId, selectAll) => {
    cartCheckedUpdateAll(memId, selectAll);
  };

  const toggleSelectItem = (prdNo, memId, cartChecked) => {
    const updatedItems = cartItems.map((item) =>
      item.prdNo === prdNo ? { ...item, selected: !item.selected } : item,
    );

    const toggledItem = updatedItems.find(
      (item) => item.cartChecked === cartChecked,
    );

    if (toggledItem.cartChecked == true) {
      const newCartChecked = false;
      cartCheckedUpdate(prdNo, memId, newCartChecked);
    } else if (toggledItem.cartChecked == false) {
      const newCartChecked = true;
      cartCheckedUpdate(prdNo, memId, newCartChecked);
    }
  };

  const handleRemoveItem = () => {
    const updatedItems = cartItems.map(
      (item) => (item.selected ? { ...item, selected: false } : item), // 선택된 항목만 selected false로 설정
    );

    setCartItems(updatedItems); // 장바구니 아이템 상태 업데이트
    setCartSelected([]); // 선택된 항목 목록 초기화

  };
  const totalPrice = cartItems.reduce((total, item) => {
    if (item.selected) {
      return total + item.price * item.ctQty;
    }
    return total;
  }, 0);

  //선택된 총 합
  const selectedTotalPrice = cartItems
    .filter((item) => item.cartChecked)
    .reduce((total, item) => {
      const productPrice = prices[item.prdNo]
        ? prices[item.prdNo].originalPrice * (item.ctQty || 1) // 여기 수정
        : Number(getProductName5(item.prdNo)) * (item.ctQty || 1);

      const addPrd1Price = item.addPrd1
        ? Number(item.add1Qty * getProductPrice1(item.addPrd1))
        : 0;
      const addPrd2Price = item.addPrd2
        ? Number(item.add2Qty * getProductPrice2(item.addPrd2))
        : 0;

      return total + productPrice + addPrd1Price + addPrd2Price;
    }, 0);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>장바구니는여 로그인 후에만 사용할 수 있어여</p>
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
      <div className="cart_group">
        <OrderStep orderStep={orderStep} />
        <div className="cart_list_group">
          <CartList
            cartItems={cartItems}
            products={products}
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            toggleSelectItem={toggleSelectItem}
            handleRemoveItem={handleRemoveItem}
            getProductName={getProductName}
            getProductName2={getProductName2}
            getProductName3={getProductName3}
            getProductName5={getProductName5}
            getProductName6={getProductName6}
            deleteCart={deleteCart}
            deleteAllCart={deleteAllCart}
            memId={memId}
            cartUpdate={cartUpdate}
            getProductPrice1={getProductPrice1}
            getProductPrice2={getProductPrice2}
            change={change}
            setReload={setReload}
          />
          <CartTotal
            cartItems={cartItems}
            products={products}
            selectedTotalPrice={selectedTotalPrice}
            memId={memId}
            reload={reload}
          />
        </div>
      </div>
    </div>
  );
}

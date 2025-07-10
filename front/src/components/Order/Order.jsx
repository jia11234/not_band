import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  getCartRequest,
  getUserRequest,
  allProducts,
  addToOrder,
  pointPlus,
  pointMinus,
} from "../../apis";
import "../../css/main/index.css";
import "../../css/order/order.css";
import OrderStep from "./OrderStep";
import axios from "axios";

export default function Order() {
  const { state } = useLocation();
  const {
    prdNo,
    addPrd1,
    addPrd2,
    ctQty,
    add1Qty,
    add2Qty,
    colorOpt,
    cartChecked,
  } = state || {};
  const location = useLocation();
  const { memId } = location.state;
  const [orderStep, setOrderStep] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [user, setUser] = useState(null); //회원 정보
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState({}); // 가격 관리
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orderName, setOrderName] = useState("");
  const [phone1, setPhone1] = useState();
  const [phone2, setPhone2] = useState();
  const [phone3, setPhone3] = useState();
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [ordNo, setordNo] = useState("");
  const [data, setData] = useState({
    zipCode: "",
    address: "",
    detailAddress: "",
  });
  const [memo, setMemo] = useState(false);
  const [deliveryRequest, setDeliveryRequest] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const navigate = useNavigate();

  const fetchUser = async (memId) => {
    try {
      const response = await getUserRequest(memId);
      setUser(response);
      setZipCode(response.memZipcode);
      setAddress(response.memAddress);
      setDetailAddress(response.memDetailAddress);
      setOrderName(response.memName);
      setPhone1(response.memPhone.slice(0, 3));
      setPhone2(response.memPhone.slice(3, 7));
      setPhone3(response.memPhone.slice(7, 11));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCart = async (memId) => {
    try {
      if (!prdNo) {
        const data = await getCartRequest(memId); // 수정된 API 호출
        setCartItems(data);
        setLoading(false);
      } else if (prdNo) {
        const orderItem = {
          prdNo,
          addPrd1,
          addPrd2,
          ctQty,
          add1Qty,
          add2Qty,
          colorOpt,
          cartChecked,
        };
        setCartItems([orderItem]);
      }
    } catch (err) {
      setError(err.message);
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

  const handleAddressSearch = (e) => {
    e.preventDefault();
    new window.daum.Postcode({
      oncomplete: function (data) {
        setData((prevData) => ({
          ...prevData,
          zipCode: data.zonecode,
          address: data.address,
        }));
        setZipCode(data.zonecode);
        setAddress(data.address);
      },
    }).open();
  };

  function dataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const selectedMemo = (e) => {
    setMemo(e.target.checked);
  };

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

  const calculateItemPrice = (item) => {
    const productPrice =
      prices[item.prdNo]?.originalPrice ||
      Number(getProductName5(item.prdNo)) * (item.ctQty || 1);
    const addPrd1Price = item.addPrd1
      ? Number(item.add1Qty * getProductPrice1(item.addPrd1))
      : 0;
    const addPrd2Price = item.addPrd2
      ? Number(item.add2Qty * getProductPrice2(item.addPrd2))
      : 0;

    return productPrice + addPrd1Price + addPrd2Price;
  };

  const selectedTotalPrice = cartItems
    .filter((item) => item.cartChecked)
    .reduce((total, item) => {
      const productPrice =
        prices[item.prdNo]?.originalPrice ||
        Number(getProductName5(item.prdNo)) * (item.ctQty || 1);

      const addPrd1Price = item.addPrd1
        ? Number(item.add1Qty * getProductPrice1(item.addPrd1))
        : 0;
      const addPrd2Price = item.addPrd2
        ? Number(item.add2Qty * getProductPrice2(item.addPrd2))
        : 0;

      return total + productPrice + addPrd1Price + addPrd2Price;
    }, 0);

  const [usedPoint, setUsedPoint] = useState(0);

  // 입력값 변경
  const handleChange = (e) => {
    const value = Number(e.target.value.replace(/,/g, "")); // 숫자만 입력
    if (value >= 0 && value <= user.memPoint) {
      setUsedPoint(value);
    }
  };

  // 전액 사용 버튼 클릭
  const handleUseAllPoints = () => {
    if (usedPoint === user.memPoint) {
      setUsedPoint(0);
    } else {
      setUsedPoint(user.memPoint);
    }
  };

  const createProductsFromCart = (cartItems) => {
    const products = [];

    cartItems.forEach((item) => {
      // cartChecked가 1인 경우에만 처리
      if (item.cartChecked === true) {
        // 기본 상품
        products.push({
          prdNo: item.prdNo,
          ordQty: item.ctQty,
          isAddProduct: false,
          colorOpt: item.colorOpt || "",
        });

        // 추가 상품 1
        if (item.addPrd1) {
          products.push({
            prdNo: item.addPrd1,
            ordQty: item.add1Qty,
            isAddProduct: true,
            colorOpt: "",
            parentPrdNo: item.prdNo || "",
          });
        }

        // 추가 상품 2
        if (item.addPrd2) {
          products.push({
            prdNo: item.addPrd2,
            ordQty: item.add2Qty,
            isAddProduct: true,
            colorOpt: "",
            parentPrdNo: item.prdNo || "",
          });
        }
      }
    });

    return products;
  };

  const handleAddToOrder = async () => {
    const products = createProductsFromCart(cartItems);
    const cartItem = {
      memId,
      ordName: orderName,
      ordPhone: phone1 + phone2 + phone3,
      ordZipcode: zipCode,
      ordAddress: address,
      ordDetailAddress: detailAddress || "",
      ordTotal: selectedTotalPrice,
      ordPaymethod: paymentMethod,
      ordPaystatus: "결제완료",
      ordStatus: "배송완료",
      ordMemo: deliveryRequest,
      ordPoint: usedPoint,
      ordDelivery: deliveryPrice,
      products,
    };

    try {
      if (paymentMethod != "kakao") {
        const ordNo = await addToOrder(cartItem);
        navigate("/not_band/success", {
          state: {
            memId,
            ordNo,
          },
        });
      }

      if (paymentMethod === "kakao") {
        await handleKakaoPay(orderName, cartItems, selectedTotalPrice);
      }
      if (usedPoint > 0) {
        await pointMinus(memId, usedPoint);
      }
      let pluspoint = selectedTotalPrice * 0.02;
      await pointPlus(memId, pluspoint);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleKakaoPay = async (orderName, cartItems, totalAmount) => {
    const quantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    const products = createProductsFromCart(cartItems);
    const cartItem = {
      memId,
      ordName: orderName,
      ordPhone: phone1 + phone2 + phone3,
      ordZipcode: zipCode,
      ordAddress: address,
      ordDetailAddress: detailAddress || "",
      ordTotal: selectedTotalPrice,
      ordPaymethod: paymentMethod,
      ordPaystatus: "결제완료",
      ordStatus: "배송완료",
      ordMemo: deliveryRequest,
      ordPoint: usedPoint,
      ordDelivery: deliveryPrice,
      products,
    };

    const itemName =
      cartItems.length === 1
        ? cartItems[0].prdName
        : `${cartItems[0].prdName} 외 ${cartItems.length - 1}건`;
    try {
      const ordNo = await addToOrder(cartItem);
      const res = await axios.get(
        "http://localhost:8080/api/v1/not_band/pay/ready",
        {
          params: {
            userId: orderName,
            itemName: itemName || prdNo,
            quantity,
            amount: totalAmount,
            ordNo,
            memId,
          },
        },
      );

      const url = `${res.data}?memId=${memId}&ordNo=${ordNo}`;
      window.location.href = url;
    } catch (err) {
      console.error("카카오페이 요청 실패:", err);
    }
  };

  useEffect(() => {
    fetchUser(memId);
    fetchCart(memId);
    fetchProducts();

    const calculateDeliveryPrice = () => {
      if (selectedTotalPrice > 50000) {
        return 0; // 50,000원 초과시 배송비 0원
      } else {
        return 3000; // 50,000원 이하일 경우 배송비 3,000원
      }
    };

    setDeliveryPrice(calculateDeliveryPrice()); // 배송비 계산 후 상태 업데이트
  }, [memId, selectedTotalPrice]);

  return (
    <div className="order_group_all">
      <OrderStep orderStep={orderStep} />
      <div className="order_group">
        <p className="order_title">주문자 정보</p>
        {user && (
          <div className="order_information">
            <div className="orderer_information">
              <div>
                <div>
                  <p>받는 이</p>
                  <input
                    type="text"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                  />
                </div>
                <div>
                  <p>연락처</p>
                  <input
                    type="text"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                  />
                  <input
                    type="text"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                  />
                  <input
                    type="text"
                    value={phone3}
                    onChange={(e) => setPhone3(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="orderer_address">
              <p>주소</p>
              <input
                type="text"
                name="zipCode"
                value={data.zipCode || zipCode}
                onChange={dataChange}
                placeholder="우편 번호"
                readOnly
              />
              <button onClick={handleAddressSearch}>우편번호 찾기</button>
              <br />
              <input
                type="text"
                name="address"
                value={data.address || address}
                onChange={dataChange}
                placeholder="주소"
                readOnly
              />
              <br />
              <input
                type="text"
                name="detailAddress"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소"
              />
            </div>
            <div className="orderer_memo">
              <div>
                <input type="checkbox" onChange={selectedMemo} />{" "}
                <p>배송 요청사항 개별 입력</p>
              </div>
              {memo ? (
                <input
                  type="text"
                  value={deliveryRequest}
                  placeholder="배송 요청사항을 입력해주세요"
                  onChange={(e) => setDeliveryRequest(e.target.value)}
                />
              ) : (
                <select
                  value={deliveryRequest}
                  onChange={(e) => setDeliveryRequest(e.target.value)}
                >
                  <option value="">배송 요청사항을 선택해 주세요</option>
                  <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                  <option value="경비실에 맡겨주세요">
                    경비실에 맡겨주세요
                  </option>
                  <option value="택배함에 넣어주세요">
                    택배함에 넣어주세요
                  </option>
                  <option value="배송 전에 연락 주세요">
                    배송 전에 연락 주세요
                  </option>
                </select>
              )}
            </div>
          </div>
        )}
        <div className="order_title">주문상품</div>
        <div className="order_list_group2">
          {cartItems.map((item, index) => (
            <div className="order_list_group" key={index}>
              {item.cartChecked == true && (
                <table>
                  <tr
                    key={index}
                    className={`order_list_tr ${index === cartItems.length - 1 ? "last-item" : ""}`}
                  >
                    <td className="order_list_product">
                      <div className="order_list_product_group">
                      <img src={`http://localhost:8080/api/v1/not_band/images/product/${item.prdNo}.png`} />
                        <div>
                          <p
                            style={{
                              marginBottom: item.colorOpt ? "2px" : "16px",
                            }}
                          >
                            {getProductName(item.prdNo)} / {item.ctQty}개
                          </p>
                          {item.colorOpt && (
                            <p className="order_color_option">
                              옵션: {item.colorOpt}
                            </p>
                          )}
                          <div>
                            <p>
                              {prices[
                                item.prdNo
                              ]?.originalPrice.toLocaleString() ||
                                Number(
                                  getProductName5(item.prdNo),
                                ).toLocaleString()}
                              원&nbsp;
                              {getProductName6(item.prdNo) > 0 && (
                                <span>
                                  {prices[
                                    item.prdNo
                                  ]?.discountedPrice.toLocaleString() ||
                                    Number(
                                      getProductName6(item.prdNo),
                                    ).toLocaleString()}
                                  원&nbsp;
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>{calculateItemPrice(item).toLocaleString()}원</p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      {(item.addPrd1 || item.addPrd2) && (
                        <div className="order_plus_product_group">
                          <div className="order_plus_product">
                            <div>추가상품</div>
                            <div>
                              <p>
                                {item.addPrd1 &&
                                  `${getProductName2(item.addPrd1)} / ${item.add1Qty}개 (+${Number(item.add1Qty * getProductPrice1(item.addPrd1)).toLocaleString()})`}
                              </p>
                              <p>
                                {item.addPrd2 &&
                                  `${getProductName3(item.addPrd2)} / ${item.add2Qty}개 (+${Number(item.add2Qty * getProductPrice2(item.addPrd2)).toLocaleString()})`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </table>
              )}
            </div>
          ))}
        </div>
        <div className="order_title">보유 포인트</div>
        {user && (
          <div className="order_point">
            <p>보유 {user.memPoint.toLocaleString("ko-KR")}P</p>
            <input
              type="text"
              placeholder="사용하실 포인트를 입력해 주세요"
              value={usedPoint.toLocaleString("ko-KR")}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                const numericValue = Number(onlyNums);

                // 최대 입력 가능한 포인트 제한
                if (numericValue <= user.memPoint) {
                  3;
                  setUsedPoint(numericValue);
                } else {
                  setUsedPoint(user.memPoint);
                }
              }}
            />
            <span>P</span>
            <button onClick={() => handleUseAllPoints(user.memPoint)}>
              전액 사용
            </button>
          </div>
        )}
        <div className="order_title">결제 수단</div>
        <div className="order_payment_group">
          <div className="order_payment">
            <div>
              <input
                type="radio"
                name="payment"
                id="credit_card"
                onChange={() => setPaymentMethod("creditCard")}
                checked={paymentMethod === "creditCard"}
              />
              <label htmlFor="credit_card">
                <span className="radio-custom"></span>
                <span className="radio-custom2"></span>
                <p>신용카드</p>
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="payment"
                id="kakao"
                onChange={() => setPaymentMethod("kakao")}
                checked={paymentMethod === "kakao"}
              />
              <label htmlFor="kakao">
                <span className="radio-custom"></span>
                <span className="radio-custom2"></span>
                <img src="/images/order/kakaopay.png" alt="" />
                <p>카카오페이</p>
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="payment"
                id="deposit"
                onChange={() => setPaymentMethod("deposit")}
                checked={paymentMethod === "deposit"}
              />
              <label htmlFor="deposit">
                <span className="radio-custom"></span>
                <span className="radio-custom2"></span>
                <p>무통장 입금</p>
              </label>
            </div>
          </div>
          {paymentMethod === "creditCard" && (
            <div className="order_credit_group">
              <p>
                신용카드 결제 시 화면 아래 ‘결제하기’버튼을 클릭하시면 신용카드
                결제 창이 나타납니다.
                <br />
                신용카드 결제 창을 통해 입력되는 고객님의 카드 정보는 안전하게
                암호화되어 전송되며,
                <br />
                승인 처리 후 카드 정보는 승인 성공/실패 여부에 상관없이 자동으로
                폐기되므로, 안전합니다.
              </p>
            </div>
          )}
          {paymentMethod === "deposit" && (
            <div className="order_deposit_group">
              <select>
                <option value="">
                  입금 계좌번호 선택해주세요 *반드시 주문자 성함으로
                  입금해주세요*
                </option>
                <option value="">
                  농협중앙회 355-0876-6738-15 (예금주:(주)낫밴드)
                </option>
                <option value="">
                  국민은행 652001-01-472051 (예금주:(주)낫밴드)
                </option>
              </select>
            </div>
          )}
        </div>
        <div className="order_title">결제 금액</div>
        <div className="order_price_group">
          <div>
            <div className="order_price">
              <p>상품 금액</p>
              <p>{Number(selectedTotalPrice).toLocaleString()}원</p>
            </div>
            <div className="order_price">
              <p>배송비</p>
              <p>{deliveryPrice.toLocaleString()}원</p>
            </div>
            <div className="order_price">
              <p>사용 포인트</p>
              <p>{usedPoint.toLocaleString()}P</p>
            </div>
            <div className="order_price">
              <p>포인트 적립 2%</p>
              <p>{(Number(selectedTotalPrice) * 0.02).toLocaleString()}P</p>
            </div>
            <div className="order_price_total">
              <p>총 결제 금액</p>
              <p>
                {(
                  Number(selectedTotalPrice) -
                  Number(usedPoint) +
                  Number(deliveryPrice)
                ).toLocaleString()}
                원
              </p>
            </div>
          </div>
          <button className="btnRed" onClick={handleAddToOrder}>
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

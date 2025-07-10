import React, { useState, useEffect } from "react";

export default function CartList({
  cartItems,
  selectAll,
  toggleSelectAll,
  toggleSelectItem,
  handleRemoveItem,
  getProductName,
  getProductName2,
  getProductName3,
  getProductName5,
  getProductName6,
  deleteCart,
  memId,
  cartUpdate,
  getProductPrice1,
  getProductPrice2,
  deleteAllCart,
  setReload,
}) {
  const [quantities, setQuantities] = useState({}); // 수량 관리
  const [prices, setPrices] = useState({}); // 가격 관리
  const [selectAll2, setSelectAll2] = useState();

  useEffect(() => {
    const checkedCount = cartItems.filter(
      (item) => item.cartChecked === true,
    ).length;
    const checkedCount2 = cartItems.filter((item) => item.prdNo).length;

    if (checkedCount2 >= 1) {
      if (checkedCount === checkedCount2) {
        // 전체 선택
        setSelectAll2(true);
      } else {
        // 전체 선택 해제
        setSelectAll2(false);
      }
    } else {
      setSelectAll2(false);
    }
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.prdNo] = item.ctQty;
    });
    setQuantities(initialQuantities);
  }, [cartItems, toggleSelectAll]);

  const handlePrice = (prdNo, value) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[prdNo] || 1;
      let newQuantity = currentQuantity;

      if (value === 1) {
        newQuantity += 1; // 증가
      } else if (value === -1 && currentQuantity > 1) {
        newQuantity -= 1; // 감소
      }

      const originalPrice = Number(getProductName5(prdNo));
      const discountedPrice = Number(getProductName6(prdNo));
      setPrices((prevPrices) => ({
        ...prevPrices,
        [prdNo]: {
          originalPrice: originalPrice * newQuantity,
          discountedPrice: discountedPrice * newQuantity,
        },
      }));

      cartUpdate(memId, prdNo, newQuantity); //수량 변경

      return {
        ...prevQuantities,
        [prdNo]: newQuantity,
      };
    });
    setReload(true);
  };

  return (
    <div className="cart_table_group">
      <table className="cart_table">
        <tr>
          <td>
            <input
              type="checkbox"
              checked={selectAll2}
              onChange={() => toggleSelectAll(memId, !selectAll2)}
            />
          </td>
          <td colSpan={2}>
            <div>
              <p>전체선택</p>
              <button onClick={() => deleteAllCart(memId)}>전체삭제</button>
            </div>
          </td>
        </tr>
        {cartItems.length === 0 ? (
          <tr>
            <td colSpan="5">장바구니에 담긴 상품이 없습니다.</td>
          </tr>
        ) : (
          cartItems.map((item, index) => (
            <tr
              key={index}
              className={`cart_list_tr ${index === cartItems.length - 1 ? "last-item" : ""}`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={item.cartChecked}
                  onChange={() =>
                    toggleSelectItem(memId, item.prdNo, item.cartChecked)
                  }
                />
              </td>
              <td className="cart_list_product">
                <p style={{ marginBottom: item.colorOpt ? "2px" : "16px" }}>
                  {getProductName(item.prdNo)}
                </p>
                {item.colorOpt && (
                  <p className="cart_color_option">옵션: {item.colorOpt}</p>
                )}
                <div className="cart_list_product_group">
                <img src={`http://localhost:8080/api/v1/not_band/images/product/${item.prdNo}.png`} />
                  <div>
                    <p>
                      {prices[item.prdNo]?.originalPrice.toLocaleString() ||
                        (
                          Number(getProductName5(item.prdNo)) *
                          (item.ctQty || 1)
                        ).toLocaleString()}
                      원&nbsp;
                      {getProductName6(item.prdNo) > 0 && (
                        <span>
                          {prices[
                            item.prdNo
                          ]?.discountedPrice.toLocaleString() ||
                            (
                              Number(getProductName6(item.prdNo)) *
                              (item.ctQty || 1)
                            ).toLocaleString()}
                          원&nbsp;
                        </span>
                      )}
                    </p>
                    <div>
                      <button onClick={() => handlePrice(item.prdNo, -1)}>
                        <p>-</p>
                      </button>
                      {quantities[item.prdNo] || item.ctQty || 1}
                      <button onClick={() => handlePrice(item.prdNo, 1)}>
                        <p>+</p>
                      </button>
                    </div>
                  </div>
                </div>
                {(item.addPrd1 || item.addPrd2) && (
                  <div className="cart_plus_product">
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
                )}
              </td>
              <td>
                <button onClick={() => deleteCart(memId, item.prdNo)}>
                  <img src="/images/cart/cart_x.png" alt="x" />
                </button>
              </td>
            </tr>
          ))
        )}
      </table>
    </div>
  );
}

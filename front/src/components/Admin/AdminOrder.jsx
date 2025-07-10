import React, { useState, useEffect } from 'react';
import { getOrderAll, allProducts, getOrderOrdNo } from '../../apis';
import '../../css/admin/adminOrder.css';
import '../../css/main/index.css';
import Paging from '../Mypage/Paging';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function AdminOrder() {
  const [value2, setValue2] = useState(1);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedOrdNo, setSelectedOrdNo] = useState(null);

  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrderAll();
        const sortedOrders = result.sort((a, b) => Number(b.ordNo) - Number(a.ordNo));
        setOrders(sortedOrders);

        const productsResult = await allProducts();
        setProducts(productsResult);
      } catch (error) {
        console.error("주문 조회 실패:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!selectedOrdNo) return;

    const fetchOrder = async () => {
      try {
        const response = await getOrderOrdNo(selectedOrdNo);
        setOrderData(response?.[0]);
      } catch (error) {
        console.error('주문 정보 불러오기 실패:', error);
      }
    };

    fetchOrder();
  }, [selectedOrdNo]);


  const pagedItems = orders.slice(start, end);

  const getProductNameByNo = (prdNo) => {
    const match = products.find(p => p.prdNo === prdNo);
    return match ? match.prdName : '-';
  };

  const handleMoreClick = (ordNo) => {
    setSelectedOrdNo(ordNo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    window.location.href = "/login";
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 - $2 - $3');
  };

  return (
    <>
      <div className="adminOrder_top">
        <h1>주문 관리</h1>
      </div>

      <div className="adminOrder_group">
        <div className="adminOrder_maintitle">
          <h2>주문 목록</h2>
          <p>{orders.length}<span>개</span></p>
        </div>

        <div className="adminOrder_titleArea">
          <div className="adminOrder_title">
            <p>주문번호</p>
            <p>상품명</p>
            <p>총가격</p>
            <p>구매자</p>
            <p>상태</p>
            <p>주문일</p>
            <p>정보</p>
          </div>
        </div>

        <table>
          <tbody>
            {pagedItems.map((order) => (
              <tr className="adminOrder_Tbody" key={order.ordNo}>
                <td>{order.ordNo}</td>
                <td>
                  {order.products && order.products.length > 0 ? (
                    <>
                      {getProductNameByNo(order.products[0].prdNo)}
                      {order.products.length > 1 && (
                        <span style={{ color: '#8A8A8A', marginLeft: '4px' }}>
                          +외 {order.products.length - 1}
                        </span>
                      )}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{order.ordTotal.toLocaleString()}원</td>
                <td>{order.ordName}</td>
                <td>{order.ordStatus}</td>
                <td>{order.ordDate ? order.ordDate.slice(0, 10).replaceAll('-', '.') : '-'}</td>
                <td>
                  <button onClick={() => handleMoreClick(order.ordNo)} style={{ cursor: 'pointer' }}>더보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="page_change3">
          <Paging page={page} value2={value2} setValue2={setValue2} totalPage={orders.length} />
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} disableScrollLock  maxWidth="md">
        <DialogTitle>주문 정보 더보기</DialogTitle>
        <DialogContent>
          {orderData ? (
            <table className='admin_order_more'>
              <tbody>
                <tr>
                  <td>주문 번호</td>
                  <td>{orderData?.ordNo || '-'}</td>
                </tr>
                {orderData.products && orderData.products.length > 0 ? (
                  orderData.products.map((product, index) => (
                    <React.Fragment key={index}>
                      {!product.addProduct && (
                        <>
                          <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>주문 상품</td>
                          </tr>
                          <tr>
                            <td>주문 상품</td>
                            <td>{getProductNameByNo(product.prdNo)}</td>
                          </tr>
                          <tr>
                            <td>상품 번호</td>
                            <td>{product.prdNo}</td>
                          </tr>
                          <tr>
                            <td>주문 수량</td>
                            <td>{product.ordQty}</td>
                          </tr>
                          <tr>
                            <td>색상 옵션</td>
                            <td>{product.colorOpt || '-'}</td>
                          </tr>
                        </>
                      )}
                      {product.addProduct && (
                        <>
                          <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>추가 상품</td>
                          </tr>
                          <tr>
                            <td>주문 상품</td>
                            <td>{getProductNameByNo(product.prdNo)}</td>
                          </tr>
                          <tr>
                            <td>상품 번호</td>
                            <td>{product.prdNo}</td>
                          </tr>
                          <tr>
                            <td>주문 수량</td>
                            <td>{product.ordQty}</td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>주문 상품 정보 없음</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center' }}>구매자 정보</td>
                </tr>
                <tr>
                  <td>구매자</td>
                  <td>{orderData?.ordName || '-'}</td>
                </tr>
                <tr>
                  <td>구매자 전화번호</td>
                  <td>{formatPhoneNumber(orderData?.ordPhone)}</td>
                </tr>
                <tr>
                  <td>배송지</td>
                  <td>{orderData?.ordAddress || '-'}</td>
                </tr>
                <tr>
                  <td>총가격</td>
                  <td>{orderData.ordTotal.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>결제 수단</td>
                  <td>{orderData?.ordPaymethod || '-'}</td>
                </tr>
                <tr>
                  <td>결제 상태</td>
                  <td>{orderData?.ordPaystatus || '-'}</td>
                </tr>
                <tr>
                  <td>배송 상태</td>
                  <td>{orderData?.ordStatus || '-'}</td>
                </tr>
                <tr>
                  <td>배송 메모</td>
                  <td>{orderData?.ordMemo || '-'}</td>
                </tr>
                <tr>
                  <td>주문 포인트</td>
                  <td>{orderData?.ordPoint.toLocaleString() || '-'}</td>
                </tr>
                <tr>
                  <td>배송비</td>
                  <td>{orderData?.ordDelivery.toLocaleString() || '-'}</td>
                </tr>
                <tr>
                  <td>주문일</td>
                  <td>{orderData.ordDate?.slice(0, 10).replaceAll('-', '.')}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>로딩 중...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#0371B9', fontSize: '19px', fontWeight: '500', width: '150px' }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

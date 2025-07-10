import React from "react";

import "../../css/main/index.css";
import "../../css/main/footer.css";

export default function Footer() {
  return (
    <div className="footer_wrap">
      <footer>
        <div className="ft">
          <div className="ft_box">
            <b>
              <div className="gray-title">CS CENTER</div>
              <div className="line"></div>
              <div className="font26">1600-1234</div>
              <div className="font20">jiji0313233@gmail.com</div>
            </b>
            <div className="font16">평일 10:00~18:00, 점심 12:00~13:00</div>
            <div className="font16">주말, 공휴일 휴무</div>
          </div>
          <div className="ft_box">
            <b>
              <div className="gray-title">BANK INFO</div>
              <div className="line"></div>
              <div className="font26">012-123456-78-910</div>
              <div className="font20">국민은행</div>
              <div className="font20">예금주:(주)낫밴드</div>
            </b>
          </div>
          <div className="ft_box">
            <div className="gray-title">SNS</div>
            <div className="line"></div>
            <img
              src="/images/footer/insta.png"
              alt="instagram"
              className="icon"
            />
            <img
              src="/images/footer/face.png"
              alt="facebook"
              className="icon"
            />
            <img src="/images/footer/x.png" alt="X" className="icon" />
            <img
              src="/images/footer/youtube.png"
              alt="youtube"
              className="icon"
            />
          </div>
          <div className="ft_box">
            <img src="/images/footer/footer_logo.png" alt="footer logo" />
          </div>
        </div>
        <div id="btm">
          <div className="address">
            <b className="font16_w">(주)NOT_BAND</b> 대표 : 류지지 <br />
            서울특별시 서초구 강남대로1길 100, 100층 NOT_BAND <br />
            사업자등록번호 : 666-66-66666 통신판매 신고번호:2222-서울강남-2222
          </div>
          <div className="anea">
            NOT_BAND는 통신판매중개자이며, 통신판매의 당사자가 아니므로,
            판매자가 등록한 상품정보 및 거래에 대하여 책임지지 않습니다. <br />
            단, NOT_BAND가 판매자로 등록 판매한 상품의 경우는 판매자로서 책임을
            부담합니다.
            <div className="font16_w">
              &copy; NOT_BAND COMPANY Inc. ALL Right Reserved.
            </div>
          </div>
        </div>
        <div id="btm2">
          <div className="address2">
            <b className="font16_w">(주)NOT_BAND</b> 대표 : 류지지 <br />
            서울특별시 서초구 강남대로1길 100, 100층 NOT_BAND <br />
            사업자등록번호 : 666-66-66666 통신판매 신고번호:2222-서울강남-2222
          </div>
          <div className="anea2">
            NOT_BAND는 통신판매중개자이며, 통신판매의 당사자가 아니므로,
            판매자가 등록한 상품정보 및 거래에 대하여 책임지지 않습니다. <br />
            단, NOT_BAND가 판매자로 등록 판매한 상품의 경우는 판매자로서 책임을
            부담합니다.
            <div className="font16_w2">
              &copy; NOT_BAND COMPANY Inc. ALL Right Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

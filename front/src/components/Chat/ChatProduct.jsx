import React from "react";
import "../../css/main/index.css";
import "../../css/chat/chat.css";

export default function ChatProduct({ resell }) {
  return (
    <div className="chat_product_group">
      <p>
        <span>판매자</span>
        <br />
        {resell.memNick}
      </p>
      <div className="chat_lineb"></div>
      <div className="chat_product">
        <img
          src={`http://localhost:8080/api/v1/not_band${resell.resImgUrl[0]}`}
          alt={`${resell.resPrd}`}
        />
        <div>
          <p>{resell.resPrd}</p>
          <p>{Number(resell.resPrice).toLocaleString("ko-KR")}원</p>
        </div>
      </div>
      <div className="chat_line"></div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import "../../css/main/index.css";
import "../../css/chat/chat.css";

export default function InquiryInput({
  setNewMessage,
  handleSendMessage,
  newMessage,
  product,
}) {
  const textRef = useRef(null);

  useEffect(() => {
    if (product && product.prdName) {
      setNewMessage(`📮상품 문의 [${product.prdName}]`);
    } else {
      setNewMessage("");
    }
  }, [product]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    handleResizeHeight();
  }, [newMessage]);

  return (
    <div className="chat_input_group">
      <textarea
        ref={textRef}
        placeholder="문의 내역을 입력해주세요."
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          handleResizeHeight();
        }}
        onKeyDown={handleKeyDown}
        style={{
          resize: "none",
          overflowY: "hidden",
        }}
      />
      <button
        className={`chat_submit ${newMessage.trim() !== "" ? "active" : ""}`}
        onClick={handleSendMessage}
      >
        <span className="material-symbols-rounded">arrow_upward</span>
      </button>
    </div>
  );
}

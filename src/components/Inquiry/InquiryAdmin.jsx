import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useCookies } from "react-cookie";
import "../../css/main/index.css";
import "../../css/chat/chat.css";
import InquiryContent from "./InquiryContent";
import InquiryInput from "./InquiryInput";
import { productDetail } from "../../apis";

export default function InquiryAdmin() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState("");
  const [sender, setSender] = useState("판매자");
  const clientRef = useRef(null);
  const [cookies] = useCookies(["accessToken"]);
  const [memId, setMemId] = useState();
  const chatId = new URLSearchParams(location.search).get("chatId");
  const prdNo = new URLSearchParams(location.search).get("prdNo");
  const [product, setProduct] = useState({
    resImgUrl: [],
  });

  useEffect(() => {
    if (cookies.accessToken) {
      setToken(cookies.accessToken);
    }
  }, [cookies]);

  useEffect(() => {
    if (!token) return;
    getMemIdFromToken();
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {

      },
      reconnectDelay: 5000,
    });

    setMemId(decoded.sub);
    client.onConnect = () => {

      client.publish({
        destination: `/app/inquiry/${chatId}/join`, // 서버의 /chat/{chatId}/join 경로로 메시지 보내기
        body: JSON.stringify(decoded.sub), // 입장한 사용자 ID
      });
      // 실시간 메세지 링크
      client.subscribe(`/topic/${chatId}`, (message) => {
        const received = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, received]);
      });

      client.subscribe(`/topic/inquiry/${chatId}/join`, (message) => {
        const notificationMessage = message.body;
        if (decoded.sub !== notificationMessage) {
          fetchMessages(decoded.sub);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP 에러", frame);
    };

    client.activate();
    clientRef.current = client;
    fetchProduct();

    return () => {
      client.deactivate();
    };
  }, [chatId, token]);

  const fetchProduct = async () => {
    if (prdNo) {
      const resData = await productDetail(prdNo);
      setProduct(resData);
    }
  };

  useEffect(() => {
    fetchMessages(memId);
  }, [messages.map((m) => m.mesRead).join(",")]);

  const getMemIdFromToken = () => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩
    setMemId(decoded.sub);
    fetchMessages(decoded.sub);
    return decoded.sub; // memId 반환
  };

  const fetchMessages = (id) => {
    if (!token) return;


    fetch(
      `http://localhost:8080/api/v1/not_band/inquiry/${chatId}/messages?senderId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("메시지 로드 오류", error);
      });
  };
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; //비어잇는거 뇹!

    const client = clientRef.current;
    if (client && client.connected) {
      const messagePayload = {
        chatId,
        senderId: memId,
        mesContent: newMessage,
        prdNo: prdNo,
      };

      client.publish({
        destination: `/app/inquiry/${chatId}`,
        body: JSON.stringify(messagePayload),
      });

      setNewMessage(""); // 메시지 전송 후 입력창 비우기
      fetchMessages(memId);
    } else {
    }
  };

  return (
    <>
      <div className="admin_inquiry_top">
        <h1>1:1 문의톡 관리</h1>
      </div>
      <div className="chat_list_group_all">
        <div></div>
        <div className="inquiry_group2">
          <InquiryContent
            messages={messages}
            memId={memId}
            product={product}
            sender={sender}
          />
          <InquiryInput
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            newMessage={newMessage}
            product={product}
          />
        </div>
      </div>
    </>
  );
}

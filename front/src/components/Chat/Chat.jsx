import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useCookies } from "react-cookie";
import "../../css/main/index.css";
import "../../css/chat/chat.css";
import ChatProduct from "./ChatProduct";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";
import { resellDetail } from "../../apis";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState("");
  const [sender, setSender] = useState("판매자");
  const clientRef = useRef(null);
  const [cookies] = useCookies(["accessToken"]);
  const [memId, setMemId] = useState();
  const chatId = new URLSearchParams(location.search).get("chatId");
  const resId = new URLSearchParams(location.search).get("resId");
  const [resell, setResell] = useState({
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
      console.log("웹소켓 연결 성공");

      client.publish({
        destination: `/app/chat/${chatId}/join`, // 서버의 /chat/{chatId}/join 경로로 메시지 보내기
        body: JSON.stringify(decoded.sub), // 입장한 사용자 ID
      });
      // 실시간 메세지 링크
      client.subscribe(`/topic/${chatId}`, (message) => {
        const received = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, received]);
      });

      client.subscribe(`/topic/chat/${chatId}/join`, (message) => {
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
    if (resId) {
      const resData = await resellDetail(resId);
      setResell(resData);
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

  // 이전 메시지 가져오는 함수
  const fetchMessages = (id) => {
    if (!token) return;


    fetch(
      `http://localhost:8080/api/v1/not_band/chat/${chatId}/messages?senderId=${id}`,
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
      };

      client.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify(messagePayload),
      });

      setNewMessage(""); // 메시지 전송 후 입력창 비우기
      fetchMessages(memId);
    } else {
      console.log("WebSocket 연결이 되지 않았습니다.");
    }
  };

  return (
    <div className="chat_group">
      <ChatProduct resell={resell} />
      <ChatContent
        messages={messages}
        memId={memId}
        resell={resell}
        sender={sender}
      />
      <ChatInput
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
      />
    </div>
  );
}

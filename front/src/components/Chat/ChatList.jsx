import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { chatRoomAll, allResells } from "../../apis";
import { Client } from '@stomp/stompjs';
import isEqual from "lodash.isequal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function ChatList() {
  const [memId, setMemId] = useState();
  const [token, setToken] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  const [chatRoom, setChatRoom] = useState([]);
  const [resell, setResell] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); //모달
  const stompClient = useRef(null);

  useEffect(() => {
    if (cookies.accessToken) {
      setToken(cookies.accessToken);
    }
  }, [cookies]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen(false);
    navigate("/not_band/login");
  };

  useEffect(() => {
    if (!token) return;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    setMemId(decoded.sub);
    fetchChatRoom(decoded.sub);
    fetchProduct();
    if (!decoded.sub) {
      setOpen(true);
    }
  }, [token]);

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
    if (!memId) {
      setOpen(true);
    }
  }, []);

useEffect(() => {
  if (!token || chatRoom.length === 0) return;

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = JSON.parse(window.atob(base64));
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
  });

  client.onConnect = () => {

    chatRoom.forEach((room) => {
      const id = room.chatId; 
      client.subscribe(`/topic/${id}`, (message) => {
        const received = JSON.parse(message.body);
        fetchChatRoom(memId);
      });
    });
  };

  client.onStompError = (frame) => {
    console.error("STOMP 에러", frame);
  };

  client.activate();
  stompClient.current = client;

  return () => {
    client.deactivate();
  };
}, [token, chatRoom]);

  const fetchChatRoom = async (id) => {
    const data = await chatRoomAll(id); // 수정된 API 호출
    setChatRoom(data);
  };

  const fetchProduct = async () => {
    const resData = await allResells();
    setResell(resData);
  };

  const getProductTitle = (resId) => {
    const product = resell.find((item) => item.resId === resId); // resId로 게시물 찾기
    return product ? product.resPrd : "게시물 제목 없음"; // 제목이 있으면 반환, 없으면 기본 메시지 반환
  };

  const formatSendDate = (dateString) => {
    const now = new Date();
    const sentDate = new Date(dateString);

    const isToday = now.toDateString() === sentDate.toDateString();

    if (isToday) {
      return sentDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      const month = sentDate.getMonth() + 1; // 월은 0부터 시작하니까 +1
      const day = sentDate.getDate();
      return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
  };

  const moveChat = (res, id) => {
    window.location.href = `/not_band/chat?chatId=${id}&resId=${res}`;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>로그인 후에만 사용할 수 있어여</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            닫기
          </Button>
          <Button onClick={handleClose2} color="primary">
            로그인하기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="chat_list_group">
        <h1>전체대화</h1>
        <div>
          {chatRoom.length === 0 ? (
            <div>채팅방이 없습니다</div>
          ) : (
            chatRoom.map((room, index) => {
              const lastMessage = room.messages?.[room.messages.length - 1];
              return (
                <div
                  key={index}
                  onClick={() => moveChat(room.resId, room.chatId)}
                >
                  <div>
                    <p>{getProductTitle(room.resId)}</p>
                    {lastMessage ? (
                      <p>
                        <span>{lastMessage?.mesContent}</span>&nbsp;&#8226;{" "}
                        {lastMessage && formatSendDate(lastMessage.sentAdd)}
                      </p>
                    ) : (
                      <p>대화 내용이 없습니다.</p>
                    )}
                  </div>
                  {lastMessage &&
                    lastMessage.senderId !== memId &&
                    room.unreadCount >= 1 && (
                      <div>
                        <p>{room.unreadCount.toLocaleString()}</p>
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

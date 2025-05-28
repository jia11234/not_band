import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { chatRoomAll, allResells, getInquiry } from "../../apis";
import "../../css/main/index.css";
import "../../css/admin/adminInquiry.css";

export default function AdminInquiry() {
  const [memId, setMemId] = useState();
  const [token, setToken] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  const [chatRoom, setChatRoom] = useState([]);
  const [resell, setResell] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatRoom("admin");
  }, []);

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    if (!memId) {
    }
  }, []);

  const fetchChatRoom = async (id) => {
    const data = await getInquiry(id); // 수정된 API 호출
    setChatRoom(data);
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
    window.location.href = `/not_band/admin/inquiry/chat?chatId=${id}&resId=${res}`;
  };

  return (
    <>
      <div className="admin_inquiry_top">
        <h1>1:1 문의톡 관리</h1>
      </div>
      <div className="chat_list_group_all">
        <div></div>
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
                      <p>{room.memId}</p>
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
                      lastMessage.senderId !== "admin" &&
                      room.unreadCount >= 1 && (
                        <div>
                          <p>{room.unreadCount}</p>
                        </div>
                      )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

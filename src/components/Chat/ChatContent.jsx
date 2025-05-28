import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import "../../css/main/index.css";
import "../../css/chat/chat.css";

export default function ChatContent({ messages, memId, resell }) {
  const bottomRef = useRef(null);
  const [sell, setSell] = useState("");
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // 자동으로 밑으로 가게
  }, [messages]);

  useEffect(() => {
    if (memId === resell.memId) {
      setSell("구매자");
    } else {
      setSell("판매자");
    }
  }, [messages]);

  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${ampm} ${hours}:${minutes}`;
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const messageDate = format(new Date(msg.sentAdd), "yyyy-MM-dd");
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groupedMessages.push({ date: currentDate, messages: [] });
      }
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    });

    return groupedMessages;
  };
  const groupedMessages = groupMessagesByDate(messages);
  return (
    <div className="chat_content_group">
      {messages.length > 0 ? (
        groupedMessages.map((group, groupIndex) => (
          <>
            <p key={groupIndex}>{group.date}</p>
            {group.messages.map((msg, index) => (
              <>
                <div
                  key={index}
                  className={
                    msg.senderId === memId
                      ? "chat_content_box2"
                      : "chat_content_box"
                  }
                >
                  <div>{sell}</div>
                  <div>
                    <p style={{ color: msg.mesRead ? "#FCFEFD" : "#0371B9" }}>
                      {msg.mesRead ? "1" : "1"}
                    </p>
                    <p>{formatTime(msg.sentAdd)}</p>
                  </div>
                  <div className="chat_content_text"
                    dangerouslySetInnerHTML={{
                      __html: msg.mesContent.replace(/\n/g, "<br />"),
                    }}
                  />
                  <img
                    src={
                      msg.senderId === memId
                        ? "/images/chat/bubble2.png"
                        : "/images/chat/bubble.png"
                    }
                  />
                </div>
              </>
            ))}
          </>
        ))
      ) : (
        <div className="chat_content_box3">
          판매자에게 바로 채팅을 보내보세요!
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

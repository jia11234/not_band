import React, { useEffect, useState } from "react";

export default function MypageUser({ user }) {
  return (
    <div className="mp_R_userbox">
      <div className="mp_R_naid">
        <div className="mp_R_name">
          <span></span>
          {user.memNickname}님, 안녕하세요.
        </div>
        <div className="mp_R_id">
          <p>ID</p>
          <p>{user.memId}</p>
        </div>
      </div>
      <div className="mp_R_point">
        <p>포인트</p>
        <p>{(user.memPoint || 0).toLocaleString()}P</p>
      </div>
    </div>
  );
}

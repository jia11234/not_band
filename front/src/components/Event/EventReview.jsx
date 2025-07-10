import React from 'react'
import { Link } from "react-router-dom";
import '../../css/event/event.css'
import '../../css/main/index.css'

export default function EventReview() {
  return (
    <div>
      <div className="event">EVENT</div>
      <div className="et-bn">
        <img src="/images/event/event2_E.png" width="1360px" className="ct-mg" alt="Big Sale Event" />
        <div className="eventReview_btn">
          <Link to="/not_band/mypage">
            <button>마이페이지 바로가기</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

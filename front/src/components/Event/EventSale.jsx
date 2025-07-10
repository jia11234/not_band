import React from 'react'
import { Link } from "react-router-dom";
import '../../css/event/event.css'
import '../../css/main/index.css'

export default function EventSale() {
  return (
    <div>
      <div className="event">EVENT</div>
      <div className="et-bn">
        <img src="/images/event/event1_E.png" width="1360px" className="ct-mg" alt="Big Sale Event" />
        <div className="eventSale_btn">
          <Link to="/not_band/instrument-list?category=S">
            <button>바로가기</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

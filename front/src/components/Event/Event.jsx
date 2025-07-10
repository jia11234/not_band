import React from "react";
import { Link } from "react-router-dom";
import '../../css/event/event.css'
import '../../css/main/index.css'

export default function Event() {
  return (
    <div>
    <div className="event">EVENT</div>
    <div className="et-bn">
      <Link to="/not_band/eventsale">
        <img src="/images/event/event1.png" className="ct-mg" alt="Big Sale Event" />
      </Link>
      <Link to="/not_band/eventreview">
        <img src="/images/event/event2.png" className="ct-mg" alt="H Point Event" />
      </Link>
      <Link to="/not_band/eventgame">
        <img src="/images/event/event3.png" className="ct-mg" alt="Coupon Event" />
      </Link>
    </div>
  </div>
  );
}
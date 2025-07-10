import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/main/index.css";
import "../../css/game/gameIntro.css";

export default function GameIntro() {
  const navigate = useNavigate();

  const onGameHandler = (value) => {
    if (value === "card") {
      navigate("/not_band/game/card");
    } else if (value === "rythm") {
      navigate("/not_band/game/rythm");
    }
  };

  return (
    <div className="g-all">
      <div className="game_zone">
        <div className="game_title">
          <img src="/images/game/title.png" alt="title" />
        </div>
      </div>
      <div className="card_game_Intro">
        <img src="/images/game/game-bg.png" alt="game_bg" />
        <div className="card_game_title" onClick={() => onGameHandler("card")}>
          <img src="/images/game/hs.png" alt="HS" />
          <img src="/images/game/card.png" alt="Card" />
          <img src="/images/game/cardgame.png" alt="Card Game" />
        </div>
      </div>
      <div className="rythm_game_Intro">
        <img src="/images/game/game-bg.png" alt="game_bg" />
        <div
          className="rythm_game_title"
          onClick={() => onGameHandler("rythm")}
        >
          <img src="/images/game/rtgame.png" alt="rythm" />
          <img src="/images/game/hs2.png" alt="rythm" />
        </div>
      </div>
      <div className="g_bottom">
        <img src="/images/game/game_bottom.png" alt="coin" />
      </div>
    </div>
  );
}

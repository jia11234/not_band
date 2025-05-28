import React from "react";
import "../../css/main/index.css";
import "../../css/game/CardGameExplain.css";

export default function CardGameExplain({ onClose }) {
  return (
    <div className="card_game_intro">
      <div>
        <h2>카드 짝 맞추기</h2>
        <p>
          카드를 눌러 뒷면을 확인하세요!
          <br />
          같은 그림이 그려진 두 장의 카드를 찾는 기억력 게임입니다.
        </p>
        <p>
          <span>●</span>&nbsp;&nbsp;한 번에 두 장의 카드를 뒤집을 수 있어요.
        </p>
        <p>
          <span>●</span>&nbsp;&nbsp;그림이 같으면 카드가 열린 채로 유지되고,
          다르면 다시 뒤집혀요.
        </p>
        <p>
          <span>●</span>&nbsp;&nbsp;제한 시간 내에 모든 짝을 맞추면 성공!
        </p>
        <p>
          <span>●</span>&nbsp;&nbsp;성공해서 포인트를 얻어가세요! (하루에 여러번
          가능!)
        </p>
      </div>
      <button className="btnWhite" onClick={onClose}>
        시작하기
      </button>
    </div>
  );
}

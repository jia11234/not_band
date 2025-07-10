import { useState, useEffect } from "react";
import CardGameExplain from "./CardGameExplain";
import { useCookies } from "react-cookie";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { pointPlus, getGame, getUserRequest } from "../../apis";
import "../../css/game/card.css";

export default function Card() {
  const TOTAL_BALLS = [
    "/images/cards/ball3.png",
    "/images/cards/ball3.png",
    "/images/cards/ball1.png",
    "/images/cards/ball1.png",
    "/images/cards/ball2.png",
    "/images/cards/ball2.png",
  ];
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]); //내가만든쿸킥
  const [memId, setMemId] = useState(null);
  const [cardsVisible, setCardsVisible] = useState(new Array(12).fill(false));
  const [cardOrder, setCardOrder] = useState([[], [], []]);
  const [message, setMessage] = useState({ card: [] });
  const [change, setChange] = useState(false);
  const [ballCount, setBallCount] = useState(6);
  const [gameResult, setGameResult] = useState();
  const [gameEnded, setGameEnded] = useState(false);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false); //모달
  const handleClose = () => {
    setOpen(false);
    window.location.href = "/not_band/game/card";
  };
  const handleClose2 = () => {
    setOpen(false);
    navigate("/not_band/login");
  };
  const [cardset, setCardset] = useState({
    1: false,
    2: false,
    4: false,
    8: false,
    3: false,
    5: false,
    9: false,
    17: false,
    6: false,
    10: false,
    18: false,
    34: false,
  });
  const [clear, setClear] = useState(0);

  useEffect(() => {
    if (!isModalOpen) {
      onCardMove();
    }
    const randomOrder = CardRandom();
    setCardOrder(randomOrder);
  }, [isModalOpen]);

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchUser(memId);
    }
  }, []);

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  const fetchUser = async (memId) => {
    try {
      const response = await getUserRequest(memId);
      setUser(response);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!isModalOpen && !gameEnded) {
      let count = 6;
      const interval = setInterval(() => {
        count -= 1;
        setBallCount(count);

        if (count <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTimeOver(true);
          }, 1000);
        }
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [isModalOpen, gameEnded]);

  useEffect(() => {
    if (isTimeOver) {
      setGameResult("GAME OVER");
      setOpen(true);
    }
  }, [isTimeOver]);

  const onCardMove = () => {
    for (let i = 0; i < cardsVisible.length; i++) {
      setTimeout(() => {
        setCardsVisible((prevState) => {
          const newState = [...prevState];
          newState[i] = true;
          return newState;
        });
      }, i * 150);
    }
  };

  const CardRandom = () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    const twoArray = [];
    while (array.length) {
      twoArray.push(array.splice(0, 4));
    }
    return twoArray;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [rewardGiven, setRewardGiven] = useState(false);
  useEffect(() => {
    if (clear === 12 && !rewardGiven) {
      if (memId) {
        (async () => {
          await pointPlus(memId, 3);
          setGameResult("GAME CLEAR\n3P가 적립되었습니다.");
          setGameEnded(true);
          setOpen(true);
        })();
      } else {
        setGameResult("GAME CLEAR\n로그인 후 포인트를 받으실 수 있습니다.");
        setGameEnded(true);
        setOpen(true);
      }
    }
  }, [clear, rewardGiven, memId]);

  const CardHandler = async (card) => {
    if (message.card.includes(card)) return;
    const newSelectedCards = [...message.card, card];
    setMessage({ card: newSelectedCards });

    if (newSelectedCards.length === 2) {
      if (newSelectedCards[0] + newSelectedCards[1] === 13) {
        for (let i = 0; i < cardOrder.length; i++) {
          for (let j = 0; j < cardOrder[i].length; j++) {
            if (
              cardOrder[i][j] === newSelectedCards[1] ||
              cardOrder[i][j] === newSelectedCards[0]
            ) {
              const cardCor = Math.pow(2, j + i) + i;
              setTimeout(() => {
                setCardset((prevState) => ({
                  ...prevState,
                  [cardCor]: true,
                }));
              }, 700); //[i][j]를 이용하여 배열의 값에 겹치지 않는 숫자를 넣어 카드짝을 없앰

              setTimeout(() => {
                setClear((prev) => {
                  const newClear = prev + 1;
                  return newClear;
                });
              }, 1000);
            }
          }
        }
        setTimeout(() => {
          setChange(true);
        }, 1000);
      }
      setTimeout(() => {
        setMessage({ card: [] });
      }, 1000);
    }
  };
  return (
    <div className="card_game">
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p
            style={{
              marginTop: "10px",
              width: "300px",
              fontSize: "25px",
              whiteSpace: "pre-line",
              fontWeight: "600",
              textAlign: "center",
              lineHeight: "150%",
            }}
          >
            {gameResult}
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="card_game_intro_window">
        {isModalOpen && <CardGameExplain onClose={handleCloseModal} />}
      </div>
      {!isModalOpen ? (
        <div className="timer">
          <img src="/images/cards/timer.png" />
          <div>
            {[
              "/images/cards/ball3.png",
              "/images/cards/ball3.png",
              "/images/cards/ball1.png",
              "/images/cards/ball1.png",
              "/images/cards/ball2.png",
              "/images/cards/ball2.png",
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                style={{ opacity: index < ballCount ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="timer"></div>
      )}
      <div className="cards">
        <div>
          {cardsVisible[0] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[0][0]) ? `card${cardOrder[0][0]}` : "back"}.png`}
              alt={`card-${cardOrder[0][0]}`}
              onClick={() => CardHandler(cardOrder[0][0])}
              style={{
                visibility: cardset[1] ? "hidden" : "visible",
                opacity: cardset[1] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[1] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[0][1]) ? `card${cardOrder[0][1]}` : "back"}.png`}
              alt={`card-${cardOrder[0][1]}`}
              onClick={() => CardHandler(cardOrder[0][1])}
              style={{
                visibility: cardset[2] ? "hidden" : "visible",
                opacity: cardset[2] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[2] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[0][2]) ? `card${cardOrder[0][2]}` : "back"}.png`}
              alt={`card-${cardOrder[0][2]}`}
              onClick={() => CardHandler(cardOrder[0][2])}
              style={{
                visibility: cardset[4] ? "hidden" : "visible",
                opacity: cardset[4] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[3] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[0][3]) ? `card${cardOrder[0][3]}` : "back"}.png`}
              alt={`card-${cardOrder[0][3]}`}
              onClick={() => CardHandler(cardOrder[0][3])}
              style={{
                visibility: cardset[8] ? "hidden" : "visible",
                opacity: cardset[8] ? 0 : 1,
              }}
            />
          )}
        </div>

        <div>
          {cardsVisible[4] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[1][0]) ? `card${cardOrder[1][0]}` : "back"}.png`}
              alt={`card-${cardOrder[1][0]}`}
              onClick={() => CardHandler(cardOrder[1][0])}
              style={{
                visibility: cardset[3] ? "hidden" : "visible",
                opacity: cardset[3] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[5] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[1][1]) ? `card${cardOrder[1][1]}` : "back"}.png`}
              alt={`card-${cardOrder[1][1]}`}
              onClick={() => CardHandler(cardOrder[1][1])}
              style={{
                visibility: cardset[5] ? "hidden" : "visible",
                opacity: cardset[5] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[6] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[1][2]) ? `card${cardOrder[1][2]}` : "back"}.png`}
              alt={`card-${cardOrder[1][2]}`}
              onClick={() => CardHandler(cardOrder[1][2])}
              style={{
                visibility: cardset[9] ? "hidden" : "visible",
                opacity: cardset[9] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[7] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[1][3]) ? `card${cardOrder[1][3]}` : "back"}.png`}
              alt={`card-${cardOrder[1][3]}`}
              onClick={() => CardHandler(cardOrder[1][3])}
              style={{
                visibility: cardset[17] ? "hidden" : "visible",
                opacity: cardset[17] ? 0 : 1,
              }}
            />
          )}
        </div>

        <div>
          {cardsVisible[8] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[2][0]) ? `card${cardOrder[2][0]}` : "back"}.png`}
              alt={`card-${cardOrder[2][0]}`}
              onClick={() => CardHandler(cardOrder[2][0])}
              style={{
                visibility: cardset[6] ? "hidden" : "visible",
                opacity: cardset[6] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[9] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[2][1]) ? `card${cardOrder[2][1]}` : "back"}.png`}
              alt={`card-${cardOrder[2][1]}`}
              onClick={() => CardHandler(cardOrder[2][1])}
              style={{
                visibility: cardset[10] ? "hidden" : "visible",
                opacity: cardset[10] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[10] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[2][2]) ? `card${cardOrder[2][2]}` : "back"}.png`}
              alt={`card-${cardOrder[2][2]}`}
              onClick={() => CardHandler(cardOrder[2][2])}
              style={{
                visibility: cardset[18] ? "hidden" : "visible",
                opacity: cardset[18] ? 0 : 1,
              }}
            />
          )}
          {cardsVisible[11] && (
            <img
              src={`/images/cards/${message.card.includes(cardOrder[2][3]) ? `card${cardOrder[2][3]}` : "back"}.png`}
              alt={`card-${cardOrder[2][3]}`}
              onClick={() => CardHandler(cardOrder[2][3])}
              style={{
                visibility: cardset[34] ? "hidden" : "visible",
                opacity: cardset[34] ? 0 : 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

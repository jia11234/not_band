import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { inquiryRoom, chatRoomAll, getInquiryRoom } from "../../apis";
import { Client } from '@stomp/stompjs';
import { Menu, X } from "lucide-react";
import "../../css/main/index.css";
import "../../css/main/header.css";
export default function Header({ cartCount }) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const [isLogIn, setLogIn] = useState(false);
  const location = useLocation();
  const [scrolling, setScrolling] = useState(false);
  const [token, setToken] = useState("");
  const stompClient = useRef(null);
  const mainPaths = [
    "/",
    "/not_band",
    "/not_band/3d",
    "/not_band/game/card",
    "/not_band/3Dmenu",
    "/not_band/bass",
    "/not_band/elec",
    "/not_band/drum",
  ]; // 여기에 원하는 경로 추가
  const isMainPage = mainPaths.includes(location.pathname);
  const isSolid = [
    "/not_band/3d",
    "/not_band/game/card",
    "/not_band/3Dmenu",
    "/not_band/bass",
    "/not_band/elec",
    "/not_band/drum",
  ].includes(location.pathname);
  const [row, setRow] = useState(false);
  const [row2, setRow2] = useState(false);
  const [open, setOpen] = useState(false);
  const [memId, setMemId] = useState(false);
  const [newMessage, setnewMessage] = useState(0);
  const [newMessage2, setnewMessage2] = useState(0);
  const [chatRoom, setChatRoom] = useState([]);
  const [inquiryRoom2, setInquiryRoom2] = useState([]);
  // 지윤핑 추가
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showResellSubMenu, setShowResellSubMenu] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchChatRoom = async (id) => {
    const data = await chatRoomAll(id);
    setChatRoom(data);

    const totalUnreadCount = Array.isArray(data)
      ? data.reduce((sum, room) => {
          const lastMessage = room.messages?.[room.messages.length - 1];
          if (
            lastMessage &&
            lastMessage.senderId !== id &&
            room.unreadCount >= 1
          ) {
            return sum + room.unreadCount;
          }
          return sum;
        }, 0)
      : 0;

    setnewMessage(totalUnreadCount);
  };

  const fetchInquiryRoom = async (id) => {
    const data = await getInquiryRoom(id);
    setInquiryRoom2(data);

    const totalUnreadCount = Array.isArray(data)
      ? data.reduce((sum, room) => {
          const lastMessage = room.messages?.[room.messages.length - 1];
          if (
            lastMessage &&
            lastMessage.senderId !== id &&
            room.unreadCount >= 1
          ) {
            return sum + room.unreadCount;
          }
          return sum;
        }, 0)
      : 0;

    setnewMessage2(totalUnreadCount);
  };



  useEffect(() => {
    if (!token || chatRoom.length === 0) return;

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

        client.subscribe(`/topic/chat/${chatId}/join`, (message) => {
          const notificationMessage = message.body;
          if (decoded.sub !== notificationMessage) {
              fetchChatRoom(memId);
          }
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

  const handleInquire = async () => {
    try {
      if (memId) {
        const response = {
          memId: memId,
          selId: "admin",
        };
        const data = await inquiryRoom(response);
        if (!data.isNew) {
          window.location.href = `/not_band/inquiry?chatId=${data.chatId}`;
        }
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      setOpen(true);
    }
  };

  useEffect(() => {
    const updateRow = () => {
      const width = window.innerWidth;

      if (width <= 1440 && width >= 651) {
        setRow(true);
      } else {
        setRow(false);
      }

      if (width <= 650) {
        setRow2(true);
      } else {
        setRow2(false);
      }
    };

    updateRow(); 
    window.addEventListener("resize", updateRow);

    return () => window.removeEventListener("resize", updateRow);
  }, []);

  // --------------------------------------------------------------------------지윤핑 추가
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hamburgerColor =
    isMainPage && windowWidth <= 1440 ? "#FCFEFD" : "#0a0a0a"; // 원하시는 조건

  const instruments = [
    {
      name: "기타",
      to: "G",
      subMenu: [
        { name: "일렉기타", to: "GEG" },
        { name: "베이스 기타", to: "GBG" },
      ],
    },
    {
      name: "드럼",
      to: "D",
      subMenu: [
        { name: "드럼", to: "DAD" },
        { name: "전자드럼", to: "DED" },
      ],
    },
    {
      name: "건반",
      to: "K",
      subMenu: [
        { name: "디지털 피아노", to: "KDP" },
        { name: "신디사이저", to: "KSY" },
        { name: "전자키보드", to: "KEK" },
      ],
    },
    {
      name: "음향장비",
      to: "M",
      subMenu: [
        { name: "앰프", to: "MAMP" },
        { name: "이펙터", to: "MFX" },
        { name: "마이크", to: "MMIC" },
      ],
    },
    {
      name: "액세서리",
      to: "A",
      subMenu: [
        { name: "기타", to: "AGA" },
        { name: "건반", to: "AKA" },
        { name: "드럼", to: "ADA" },
        { name: "음향장비", to: "AMA" },
      ],
    },
    {
      name: "초보ZONE",
      to: "Q",
    },
  ];

  const starter = [
    {
      name: "기타",
      to: "/not_band/rental/guitar",
      subMenu: [
        { name: "일렉기타", to: "/not_band/rental/guitar/electric" },
        { name: "베이스 기타", to: "/not_band/rental/guitar/bass" },
      ],
    },
    {
      name: "건반",
      to: "/rental/keyboard",
      subMenu: [
        {
          name: "디지털 피아노",
          to: "/not_band/rental/keyboard/digital-piano",
        },
        { name: "신디사이저", to: "/not_band/rental/keyboard/synthesizer" },
        {
          name: "전자키보드",
          to: "/not_band/rental/keyboard/electric-keyboard",
        },
      ],
    },
    {
      name: "드럼",
      to: "/rental/keyboard",
      subMenu: [
        { name: "드럼", to: "/not_band/rental/keyboard/digital-piano" },
        { name: "전자드럼", to: "/not_band/rental/keyboard/synthesizer" },
      ],
    },
  ];

  const resall = [
    { name: "찜 목록", to: "/not_band/mypage/wish" },
    { name: "중고 거래톡", to: "/not_band/chat-list" },
    { name: "상품등록", to: "/not_band/resell-registration" },
  ];

  const game = [
    { name: "CARD GAME", to: "/not_band/game/card" },
    { name: "RYTHM GAME", to: "/not_band/game/rhythm" },
  ];

  const event = [
    { name: "뽑기 이벤트", to: "/not_band/event/draw" },
    { name: "리뷰 이벤트", to: "/not_band/event/review" },
    { name: "할인 정보", to: "/not_band/event/discount" },
  ];

  const threed = [
    { name: "일렉", to: "/not_band/event/draw" },
    { name: "베이스", to: "/not_band/event/review" },
    { name: "드럼", to: "/not_band/event/discount" },
    { name: "키보드", to: "/not_band/event/discount" },
  ];

  const [isInstrumentsHover, setInstrumentsHover] = useState(false);
  const [isStarterHover, setStarterHover] = useState(false);
  const [isRentalHover, setRentalHover] = useState(false);
  const [isResallHover, setResallHover] = useState(false);
  const [isGameHover, setGameHover] = useState(false);
  const [isEventHover, setEventHover] = useState(false);
  const [is3dHover, set3dHover] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);
  const [arrowRotated2, setArrowRotated2] = useState(false);

  const [isHeaderLineVisible, setIsHeaderLineVisible] = useState(false);
  const onMenuHover = (value) => {
    setInstrumentsHover(false);
    setStarterHover(false);
    setRentalHover(false);
    setResallHover(false);
    setGameHover(false);
    setEventHover(false);
    set3dHover(false);

    if (value === 1) {
      setInstrumentsHover(true);
    } else if (value === 2) {
      setStarterHover(true);
    } else if (value === 3) {
      setRentalHover(true);
    } else if (value === 4) {
      setResallHover(true);
    } else if (value === 5) {
      setGameHover(true);
    } else if (value === 6) {
      setEventHover(true);
    } else if (value === 7) {
      set3dHover(true);
    }

    if (value === 1 || value === 4) {
      setIsHeaderLineVisible(true);
    } else {
      setIsHeaderLineVisible(false);
    }
  };

  useEffect(() => {
    setLogIn(!!cookies.accessToken);
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    setToken(token);
    setMemId(memId);
    fetchChatRoom(memId);
    fetchInquiryRoom(memId);
  }, [cookies.accessToken]);

  const getMemIdFromToken = (token) => {
  if (!token) return null;

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
  const decoded = JSON.parse(window.atob(base64)); // 디코딩

  return decoded.sub; // memId 반환
};


  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
    navigate("/not_band");
    window.location.href = "/not_band";
  };

  useEffect(() => {
    setOpen(false);
    setArrowRotated(false);
    setShowResellSubMenu(false);
  }, [location]);
const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    setArrowRotated(false);
    setShowResellSubMenu(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <header
        style={{
          backgroundColor: open && isMainPage
            ? "#0a0a0a"
            : isMainPage
              ? isSolid
                ? "#0a0a0a"
                : scrolling
                  ? "#0a0a0a"
                  : ""
              : "#FCFEFD",
          transition: "background-color 0.3s ease",
        }}
      >
      <div>
        {(row == false && row2 == false) && (
          <nav>
          <Link
            to="not_band/instrument-list?category=S"
              className={
                "menu" + (
                  location.pathname === "/not_band/instrument-list" &&
                  ["D", "S", "G", "K", "M", "A"].some(
                    c => {
                      const category = new URLSearchParams(location.search).get('category') || "";
                      return category.startsWith(c);
                    }
                  )
                    ? " active"
                    : ""
                )
              }
            onMouseEnter={() => onMenuHover(1)}
            style={{
              color: isMainPage
                ? scrolling
                  ? "#FCFEFD"
                  : "#FCFEFD"
                : "#0a0a0a",
            }}
          >
            SHOP
          </Link>
          <Link
            to="not_band/instrument-list?category=Q"
            className={
              "menu" + (location.search.startsWith("?category=Q") ? " active" : "")
            }
            style={{
              color: isMainPage
                ? scrolling
                  ? "#FCFEFD"
                  : "#FCFEFD"
                : "#0a0a0a",
            }}
          >
              <div onMouseEnter={() => onMenuHover(2)}>초보ZONE</div>
            </Link>
            <Link to="/not_band/resell?category=S"
            className={
              "menu" + (
                location.pathname === "/not_band/resell" && location.search.startsWith("?category=")
                  ? " active"
                  : ""
              )
            }>
              <div
                onMouseEnter={() => onMenuHover(4)}
                style={{
                  color: isMainPage
                    ? scrolling
                      ? "#FCFEFD"
                      : "#FCFEFD"
                    : "#0a0a0a",
                }}
              >
                중고마켓
              </div>
            </Link>
            <Link
              to="not_band/game/card"
              className={
                "menu" + (location.pathname === "/not_band/game/card" ? " active" : "")
              }
            >
              <div
                onMouseEnter={() => onMenuHover(5)}
                style={{
                  color: isMainPage
                    ? scrolling
                      ? "#FCFEFD"
                      : "#FCFEFD"
                    : "#0a0a0a",
                }}
              >
                GAME
              </div>
            </Link>
            <Link to="/not_band/event" 
              className={
                "menu" + (location.pathname === "/not_band/event" ? " active" : "")
              }
            >
              <div
                onMouseEnter={() => onMenuHover(6)}
                style={{
                  color: isMainPage
                    ? scrolling
                      ? "#FCFEFD"
                      : "#FCFEFD"
                    : "#0a0a0a",
                }}
              >
                EVENT
              </div>
            </Link>
            <Link to="/not_band/3Dmenu"
              className={
                "menu" + (
                  [
                    "/not_band/bass",
                    "/not_band/3Dmenu",
                    "/not_band/elec",
                    "/not_band/3d",
                    "/not_band/drum"
                  ].includes(location.pathname)
                    ? " active"
                    : ""
                )
              }
            >
              <div
                onMouseEnter={() => onMenuHover(7)}
                style={{
                  color: isMainPage
                    ? scrolling
                      ? "#FCFEFD"
                      : "#FCFEFD"
                    : "#0a0a0a",
                }}
              >
                3D 악기 체험
              </div>
            </Link>
            <div
              id="header_line"
              style={{
                display: isHeaderLineVisible ? "" : "none",
                backgroundColor: isMainPage ? "#0a0a0a" : "#FCFEFD",
                borderTop: isMainPage
                  ? "0.5px solid white"
                  : "0.5px solid #0a0a0a",
                boxShadow: isMainPage
                  ? "none"
                  : "0px 5px 10px rgba(110, 110, 110, 0.3)",
              }}
            >
              <div className="s_menu_group">
                {isInstrumentsHover && (
                  <>
                    {instruments.map((category, index) => (
                      <div key={index} className="s_menu">
                        <Link
                          to={`not_band/instrument-list?category=${category.to}`}
                        >
                          <h4
                            style={{
                              color: isMainPage
                                ? scrolling
                                  ? "#FCFEFD"
                                  : "#FCFEFD"
                                : "#0a0a0a",
                            }}
                          >
                            {category.name}
                          </h4>
                        </Link>
                        {category.subMenu &&
                          category.subMenu.map((item, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`not_band/instrument-list?category=${item.to}`}
                            >
                              <p
                                style={{
                                  color: isMainPage
                                    ? scrolling
                                      ? "#FCFEFD"
                                      : "#FCFEFD"
                                    : "#0a0a0a",
                                }}
                              >
                                {item.name}
                              </p>
                            </Link>
                          ))}
                      </div>
                    ))}
                  </>
                )}

                {isStarterHover && (
                  <>
                    {starter.map((category, index) => (
                      <div key={index} className="s_menu">
                        <Link
                          to={`not_band/instrument-list?category=${category.to}`}
                        >
                          <h4>{category.name}</h4>
                        </Link>
                        {category.subMenu &&
                          category.subMenu.map((item, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`not_band/instrument-list?category=${item.to}`}
                            >
                              <p>{item.name}</p>
                            </Link>
                          ))}
                      </div>
                    ))}
                  </>
                )}

                {isResallHover && (
                  <>
                    {resall.map((category, index) => (
                      <div key={index} className="s_menu">
                        <Link to={category.to}>
                          <h4
                            style={{
                              color: isMainPage
                                ? scrolling
                                  ? "#FCFEFD"
                                  : "#FCFEFD"
                                : "#0a0a0a",
                            }}
                          >
                            {category.name}
                          </h4>
                        </Link>
                      </div>
                    ))}
                  </>
                )}

                {isGameHover && (
                  <>
                    {game.map((category, index) => (
                      <div key={index} className="s_menu">
                        <Link to={category.to}>
                          <h4>{category.name}</h4>
                        </Link>
                      </div>
                    ))}
                  </>
                )}

                {isEventHover && (
                  <>
                    {event.map((category, index) => (
                      <div key={index} className="s_menu">
                        <h4>{category.name}</h4>
                      </div>
                    ))}
                  </>
                )}

                {is3dHover && (
                  <>
                    {threed.map((category, index) => (
                      <div key={index} className="s_menu">
                        <h4>{category.name}</h4>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </nav>
        )}

        {(row == true || row2 == true) && (
          <nav className="hambuger_menu">
            {row == true && (
            <div>
              <button onClick={() => setOpen(!open)}>
                {open ? (
                  <X size={35} color={hamburgerColor} />
                ) : (
                  <Menu size={35} color={hamburgerColor} />
                )}
              </button>
            </div>
            )}
            {row2 == true && (
            <div className="header_search_menu">
              <div>
              <button onClick={() => setOpen(!open)}>
                {open ? (
                  <X size={35} color={hamburgerColor} />
                ) : (
                  <Menu size={35} color={hamburgerColor} />
                )}
              </button>
            </div>
            <Link to="/not_band/search">
              <img
                src={
                  isMainPage
                    ? "/images/header/search_white.png"
                    : "/images/header/search_black.png"
                }
                alt=""
              />
            </Link>
            </div>
            )}

            {/* 토글 메뉴 */}
            {open && (
              <div className="toggle_menu"  ref={menuRef}>
                {memId ? (
                  <>
                  <div className="login_sign_up_group">
                    <p>{memId}님, 안녕하세요</p>
                  </div>
                  <div className="login_sign_up_button" onClick={handleLogout}>로그아웃</div>
                  </>
                ):(
                <div className="login_sign_up_group">
                  <Link to="/not_band/login">로그인</Link>
                  <Link to="/not_band/sign-up">/회원가입</Link>
                </div>
                )}
                <div className="header_menu_group">
                  <Link
                    to="/not_band/instrument-list?category=S"
                  >
                  <div className="resell_header_toggle">
                    <p>SHOP</p>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        if (windowWidth <= 1440) {
                          setShowSubMenu(!showSubMenu);
                          setArrowRotated2(!arrowRotated2);
                        } else {
                          navigate("/not_band/instrument-list?category=S");
                        }
                      }}
                      style={{
                        transform: arrowRotated2 ? "rotate(270deg)" : "rotate(90deg)",
                      }}
                    >
                      &#x276F;
                    </div>
                    </div>
                  </Link>
                  {windowWidth <= 1440 && showSubMenu && (
                    <div className="shop_submenu">
                      <Link to="/not_band/instrument-list?category=S">
                        <p>전체</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=G">
                        <p>기타</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=D">
                        <p>드럼</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=K">
                        <p>건반</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=A">
                        <p>음향장비</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=X">
                        <p>액세서리</p>
                      </Link>
                      <Link to="/not_band/instrument-list?category=Q">
                        <p>초보ZONE</p>
                      </Link>
                    </div>
                  )}
                  <Link to="/not_band/instrument-list?category=Q">
                    <p>초보ZONE</p>
                  </Link>
                  <Link
                    to="/not_band/resell?category=S"

                  >
                    <div className="resell_header_toggle">
                    <p>중고마켓</p>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        if (windowWidth <= 1440) {
                          setShowResellSubMenu(!showResellSubMenu);
                          setArrowRotated(!arrowRotated);
                        } else {
                          navigate("/not_band/resell?category=S");
                        }
                      }}
                      style={{
                        transform: arrowRotated ? "rotate(270deg)" : "rotate(90deg)",
                      }}
                    >
                      &#x276F;
                    </div>
                    </div>
                  </Link>
                  {windowWidth <= 1440 && showResellSubMenu && (
                    <div className="shop_submenu">
                      <Link to="/not_band/mypage/wish">
                        <p>찜 목록</p>
                      </Link>
                      <Link to="/not_band/chat-list">
                        <p>중고 거래톡</p>
                      </Link>
                      <Link to="/not_band/resell-registration">
                        <p>상품등록</p>
                      </Link>
                    </div>
                  )}
                  <Link to="/not_band/game/card">
                    <p>GAME</p>
                  </Link>
                  <Link to="/not_band/event">
                    <p>EVENT</p>
                  </Link>
                  <Link to="not_band/3Dmenu">
                    <p>3D 악기 체험</p>
                  </Link>
                </div>
                  <div className="user_center">
                    <Link to="not_band/cs">고객센터</Link>
                  </div>
              </div>
            )}
          </nav>
        )}

        <div className="icons_wrap">
          <div className="icons">
          {row2 == false && (
            <>
            <Link to="/not_band/search">
              <img
                src={
                  isMainPage
                    ? "/images/header/search_white.png"
                    : "/images/header/search_black.png"
                }
                alt=""
              />
            </Link>
            </>
            )}
            <Link to="/not_band/cart">
            <div className="new_talk">
              {memId &&
                  <div>
                    <p>{cartCount.toLocaleString()}</p>
                  </div>
              }
              </div>
              <img
                src={
                  isMainPage
                    ? "/images/header/cart_white.png"
                    : "/images/header/cart_black.png"
                }
                alt=""
              />
            </Link>
            <div id="talk">
              <div className="new_talk">
              {
                (newMessage2+newMessage) >= 1 && (
                  <div>
                    <p>{(newMessage2+newMessage).toLocaleString()}</p>
                  </div>
              )}
              </div>
              <img
                src={
                  isMainPage
                    ? "/images/header/chat_white.png"
                    : "/images/header/chat_black.png"
                }
                alt=""
              />
              <div id="talk_hover">
                <div>
                  <div>
                  <p onClick={handleInquire}>문의톡</p>
                  <div className="new_talk2">
                    {
                      (newMessage2) >= 1 && (
                          <p>{(newMessage2).toLocaleString()}</p>
                    )}
                  </div>
                  </div>

                  <div>
                  <p onClick={() => navigate("/not_band/chat-list")}>중고 거래톡</p>
                  <div className="new_talk3">
                    {
                      (newMessage) >= 1 && (
                          <p>{(newMessage).toLocaleString()}</p>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>
            {(row == true || row2 == true) ? (
              <>
              <div onClick={() => navigate("/not_band/mypage")}>
                <img
                  src={
                    isMainPage
                      ? "/images/header/mypage_white.png"
                      : "/images/header/mypage_black.png"
                  }
                  alt=""
                />
              </div>
              </>
            ):(
            <>
              <div id="my">
                <img
                  src={
                    isMainPage
                      ? "/images/header/mypage_white.png"
                      : "/images/header/mypage_black.png"
                  }
                  alt=""
                />
                <div id="my_hover">
                  <div>
                    {isLogIn ? (
                      <p onClick={handleLogout}>로그아웃</p>
                    ) : (
                      <p onClick={() => navigate("/not_band/login")}>로그인</p>
                    )}
                    <p onClick={() => navigate("/not_band/mypage")}>마이페이지</p>
                    <p onClick={() => navigate("/not_band/cs")}>고객센터</p>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="logo">
        <Link to="/not_band">
          <img
            src={
              isMainPage
                ? "/images/header/logo_white.png"
                : "/images/header/logo_black.png"
            }
            alt=""
          />
        </Link>
      </div>
    </header>
  );
}

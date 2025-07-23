import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/main/index.css";
import "../../css/auth/login.css";
import { ResponseCode, ResponseMessage } from "../../types/enums";
import { ResponseDto } from "../../apis/response";
import { signInRequest, SNS_SIGN_IN_URL } from "../../apis";
import { useCookies } from "react-cookie";

export default function Login() {
  const [SuccessMessage, setSuccessMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(false);

  const [cookie, setCookie] = useCookies();

  const inputRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const [data, setData] = useState({
    id: "",
    password: "",
  });

  const [message, setMessage] = useState({
    id: false,
    password: false,
  });

  const signInResponse = (responseBody) => {
    if (!responseBody) return;

    const { code, role } = responseBody; // role을 응답에서 가져옴
    if (code === ResponseCode.VALIDATION_FAIL)
      alert("아이디와 비밀번호를 입력하세요");
    if (code === ResponseCode.SIGN_IN_TYPE) {
      alert(responseBody.message);
    }
    if (code === ResponseCode.SIGN_IN_FAIL) {
      console.log("일치 노논함");
      setMessage({
        password: "로그인 정보가 일치하지 않습니다.",
      });
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code !== ResponseCode.SUCCESS) return;

    const { token, expirationTime } = responseBody;

    const now = new Date().getTime();
    const expires = new Date(Date.now() + expirationTime * 1000);

    setCookie("accessToken", token, { expires, path: "/" });
    // 관리자인지 여부 확인
    if (data.id === "admin") {
      navigate("/not_band/admin");
    } else {
      navigate("/not_band");
      window.location.href = "/not_band";
    }
  };

  useEffect(function () {
    inputRef.current?.focus();
  }, []);

  function dataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData(function (prevData) {
      return {
        ...prevData,
        [name]: value,
      };
    });

    if (name === "id" && value !== "") {
      let newMessage = { ...message };
      newMessage.id = "";
      setMessage(newMessage);
    }

    if (name === "password" && value !== "") {
      let newMessage = { ...message };
      newMessage.password = "";
      setMessage(newMessage);
    }
  }

  const onSignInButtonClickHandler = (e) => {
    e.preventDefault();

    setMessage({
      id: data.id === "" ? "아이디를 입력해주세요" : "",
      password:
        data.password === "" && data.id !== "" ? "비밀번호를 입력해주세요" : "",
    });

    if (data.id === "") {
      inputRef.current?.focus();
    } else if (data.password === "") {
      passwordRef.current?.focus();
    } else {
      const requestBody = { id: data.id, password: data.password };
      signInRequest(requestBody).then(signInResponse);
      console.log("로그인 성공");
    }
  };

  const onSnsSignInButtonClickHandler = (type) => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  return (
    <section id="login">
      <form>
        <div>
          <h1>로그인</h1>
          <div>
            <p className="login_title">
              <b>ID</b>
            </p>
            <input
              type="text"
              className="input_simple"
              ref={inputRef}
              name="id"
              value={data.id}
              onChange={dataChange}
              placeholder="아이디를 입력해주세요"
            />
            <p className="message">
              {message.id ? (
                <>
                  <span className="material-symbols-outlined">error</span>{" "}
                  {message.id}
                </>
              ) : (
                "\u00A0"
              )}
            </p>
          </div>
          <div>
            <p className="login_title">
              <b>PASSWORD</b>
            </p>
            <input
              type="password"
              className="input_simple"
              ref={passwordRef}
              name="password"
              value={data.password}
              onChange={dataChange}
              placeholder="비밀번호를 입력해주세요"
            />
            <p className="message">
              {message.password ? (
                <>
                  <span className="material-symbols-outlined">error</span>{" "}
                  {message.password}
                </>
              ) : (
                "\u00A0"
              )}
            </p>
          </div>
          <div className="find">
            <div>
              <Link to="/not_band/id-find">아이디 찾기</Link>{" "}
              &nbsp;&#9475;&nbsp;{" "}
              <Link to="/not_band/password-find">비밀번호 찾기</Link>
            </div>
          </div>
          <div className="find2">
          <div className="btnWhite">
            <Link to="/not_band/sign-up">회원가입</Link>
          </div>
          <button
            type="submit"
            className="btnRed"
            onClick={onSignInButtonClickHandler}
          >
            로그인
          </button>
          </div>
          <div className="sns">
            <p>SNS로 간편하게 로그인해 보세요</p>
            <div>
              <div onClick={() => onSnsSignInButtonClickHandler("kakao")}>
                <img src="/images/login/kakao.png" alt="" />
              </div>
              <div onClick={() => onSnsSignInButtonClickHandler("naver")}>
                <img src="/images/login/naver.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

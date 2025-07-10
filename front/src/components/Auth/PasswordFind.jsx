import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import "../../css/main/index.css";
import "../../css/auth/find.css";
import {
  checkCertificationRequest,
  emailCertificationRequest,
  idCheckRequest,
  signUpRequest,
  getUserAll,
  updateUserInfo,
} from "../../apis";
import { ResponseCode } from "../../types/enums";

export default function PasswordFind() {
  const emailRef = useRef(null);
  const certification_numberRef = useRef(null);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [isEmailError, setEmailError] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [matchedUser, setMatchedUser] = useState();
  const [isCertificationNumberError, setCertificationNumberError] =
    useState(false);
  const [isCertificationCheck, setCertificationNumberCheck] = useState(false);
  const [user, setUser] = useState([]);
  const phoneNumberRef = useRef(null);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    emailRef.current?.focus();

    const fetchUsers = async () => {
      try {
        const result = await getUserAll();
        setUser(result);
      } catch (error) {
        console.error("유저 조회 실패:", error);
      }
    };

    fetchUsers();
  }, []);

  const [data, setData] = useState({
    id: "",
    nickName: "",
    password: "",
    password2: "",
    name: "",
    phoneNumber: "",
    email: "",
    certification_number: "",
    zipCode: "",
    address: "",
    detailAddress: "",
  });

  const [message, setMessage] = useState({
    id: "",
    nickName: "",
    password: "",
    password2: "",
    name: "",
    phoneNumber: "",
    email: "",
    certification_number: "",
    zipCode: "",
    address: "",
    detailAddress: "",
  });

  const onEmailButtonClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      email: "",
    };

    // 이메일 입력 체크
    if (!data.email) {
      newMessage.email = "이메일을 입력해주세요";
      emailRef.current?.focus();
      setMessage(newMessage);
      return;
    }

    const checkedEmail = emailPattern.test(data.email);

    // 이메일 형식 체크
    if (!checkedEmail) {
      setEmailError(true);
      newMessage.email = "이메일 형식이 아닙니다";
      setMessage(newMessage);
      return;
    }

    const exists = user.some((user) => user.memEmail === data.email);
    if (!exists) {
      newMessage.email = "회원에 존재하지 않는 이메일입니다";
      setMessage(newMessage);
      return;
    } else {
      const requestBody = { id: 11234, email: data.email };
      emailCertificationRequest(requestBody).then(emailCertificationResponse);
    }
  };

  const emailCertificationResponse = (responseBody) => {
    let newMessage = {
      id: "",
      email: "",
    };

    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("이메일을 입력해주세요");
    }

    if (code === ResponseCode.MAIL_FAIL) alert("이메일 전송에 실패했습니다");
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다");
    if (code === ResponseCode.SUCCESS) {
      setEmailError(false);
      setEmailCheck(true);
      newMessage.email = "인증번호가 전송되었습니다";
    }
    setMessage(newMessage);
    return;
  };

  const checkCertificationResponse = (responseBody) => {
    let newMessage = {
      certification_number: "",
    };

    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("이메일과 인증번호를 모두 입력해주세요");
    }
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      newMessage.certification_number = "인증번호가 일치하지 않습니다";
      inputRef.current?.focus();
      setMessage(newMessage);
      setCertificationNumberCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다");

    if (code === ResponseCode.SUCCESS) {
      setCertificationNumberError(false);
      newMessage.certification_number = "인증번호가 확인되었습니다";
      setMessage(newMessage);
      setCertificationNumberCheck(true);
    }
    setMessage(newMessage);
    inputRef.current?.focus();
  };

  const onCertificationNumberButtonClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      email: "",
    };

    if (!data.email || !data.certification_number) {
      let newMessage = { ...message };
      newMessage.certification_number = "이메일과 인증번호를 모두 입력해주세요";
      setMessage(newMessage);
      return;
    }

    const requestBody = {
      id: 11234,
      email: data.email,
      certificationNumber: data.certification_number,
    };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
  };

  function dataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData(function (prevData) {
      return {
        ...prevData,
        [name]: value,
      };
    });

    if (name === "email") {
      let newMessage = { ...message };

      if (!emailPattern.test(value)) {
        newMessage.email = "이메일 형식이 틀렸습니다";
      } else {
        newMessage.email = "";
      }

      setMessage(newMessage);
    }

    if (name === "certification_number" && value !== "") {
      let newMessage = { ...message };
      newMessage.certification_number = "";
      setMessage(newMessage);
    }

    if (name === "phoneNumber") {
      let newMessage = { ...message };

      const cleanedValue = value.replace(/[^0-9]/g, "");

      if (value !== cleanedValue) {
        newMessage.phoneNumber = "휴대폰 번호에는 숫자만 입력 가능합니다";
      } else {
        if (value.includes("-")) {
          newMessage.phoneNumber = "휴대폰 번호에는 '-'를 제외하여주세요";
        } else if (!cleanedValue.startsWith("010")) {
          newMessage.phoneNumber = "휴대폰 번호는 010으로 시작해야 합니다";
        } else if (cleanedValue.length === 11) {
          newMessage.phoneNumber = "";
        } else if (cleanedValue.length < 11) {
          newMessage.phoneNumber = "휴대폰 번호를 끝까지 입력해주세요";
        }
      }
    }
  }

  const signUpSubmit = (e) => {
    e.preventDefault();

    let newMessage = {
      id: "",
      nickName: "",
      password: "",
      password2: "",
      name: "",
      phoneNumber: "",
      email: "",
      certification_number: "",
      zipCode: "",
      address: "",
      detailAddress: "",
    };

    if (data.email === "") {
      newMessage.email = "이메일을 입력해주세요";
    } else if (!isEmailCheck) {
      newMessage.email = "이메일 인증을 눌러주세요";
    } else if (data.certification_number === "") {
      newMessage.certification_number = "인증번호를 입력해주세요";
    } else if (!isCertificationCheck) {
      newMessage.certification_number = "인증번호를 확인해주세요";
    } else if (data.id === "") {
      newMessage.id = "아이디를 입력해주세요";
    } else {
      if (data.id && data.email) {
        const foundUser = user.find(
          (user) => user.memId === data.id && user.memEmail === data.email,
        );
        if (foundUser) {

          newMessage.id =
            "일치하는 아이디가 존재합니다.\n잠시 후 비밀번호 변경 페이지로 이동합니다.";
          setMessage(newMessage);

          setTimeout(() => {
            navigate("/not_band/password-findOk", {
              state: {
                memId: foundUser.memId,
              },
            });
          }, 2500); // 2초 후 페이지 이동
        } else {
          console.log("일치하는 유저 없음");
          (newMessage.id = "일치하는 아이디가 없습니다"),
            setMessage(newMessage);
        }
      }
    }

    setMessage(newMessage);

    if (newMessage.email) {
      emailRef.current?.focus();
    } else if (newMessage.certification_number) {
      certification_numberRef.current?.focus();
    }
  };

  return (
    <div className="id_find_group">
      <div>
        <p>
          <b>E-MAIL</b>
        </p>
        <input
          type="text"
          className="inputBox"
          name="email"
          ref={emailRef}
          value={data.email}
          placeholder="이메일 아이디"
          onChange={dataChange}
        />
        <button
          className="add-btn"
          onClick={(e) => onEmailButtonClickHandler(e)}
        >
          이메일 인증
        </button>
        <br />
        <div className="user_edit_error">
          {message.email ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.email}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>

      <div>
        <p>
          <b>인증번호</b>
        </p>
        <input
          type="text"
          className="input_simple"
          name="certification_number"
          style={{ width: "270px" }}
          ref={certification_numberRef}
          value={data.certification_number}
          onChange={dataChange}
          placeholder="아이디를 입력해주세요"
          maxLength={4}
        />
        <button
          className="add-btn"
          onClick={(e) => onCertificationNumberButtonClickHandler(e)}
        >
          인증 확인
        </button>
        <br />
        <div className="user_edit_error">
          {message.certification_number ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.certification_number}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>

      <div>
        <p>
          <b>아이디</b>
        </p>
        <input
          type="text"
          className="input_simple"
          name="id"
          style={{ width: "390px", marginLeft: "3px" }}
          ref={inputRef}
          value={data.id}
          placeholder="아이디를 입력해주세요"
          onChange={dataChange}
        />
        <br />
        <div className="user_edit_error">
          {message.id ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message" style={{ whiteSpace: "pre-line" }}>
                {message.id}
              </p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>

      <button type="submit" className="btnRed" onClick={signUpSubmit}>
        아이디 찾기
      </button>
    </div>
  );
}

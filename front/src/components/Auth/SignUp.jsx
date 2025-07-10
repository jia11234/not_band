import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import "../../css/main/index.css";
import "../../css/auth/signup.css";
import {
  checkCertificationRequest,
  emailCertificationRequest,
  idCheckRequest,
  signUpRequest,
} from "../../apis";
import { ResponseCode } from "../../types/enums";

export default function SignUp() {
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const nickNameRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const nameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const certification_numberRef = useRef(null);

  useEffect(function () {
    inputRef.current?.focus();
  }, []);

  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [extraAddress, setextraAddress] = useState("");

  const [isIdCheck, setIdCheck] = useState(false);
  const [isIdError, setIdError] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [isCertificationNumberError, setCertificationNumberError] =
    useState(false);
  const [isCertificationCheck, setCertificationNumberCheck] = useState(false);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

  const handleAddressSearch = (e) => {
    e.preventDefault();
    new window.daum.Postcode({
      oncomplete: function (data) {
        setData((prevData) => ({
          ...prevData,
          zipCode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

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

  //유효성 검사후 아이디 중복 검사
  const idCheckResponse = (responseBody) => {
    let newMessage = {
      name: "",
    };

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) {
      setIdError(true);
      newMessage.id = "아이디를 입력해주세요";
      inputRef.current?.focus();
      setMessage(newMessage);
    }

    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      newMessage.id = "이미 사용중인 아이디입니다";
      inputRef.current?.focus();
      setIdCheck(false);
      setMessage(newMessage);
    }

    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다");
    if (code !== ResponseCode.SUCCESS) return;

    setIdError(false);
    newMessage.id = "사용 가능한 아이디 입니다.";
    setIdCheck(true);
    setMessage(newMessage);
  };

  //아이디 중복 눌렀을때 유효성 검사
  const onIdButtionClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      id: "",
    };

    if (!data.id) {
      newMessage.id = "아이디를 입력해주세요";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }

    if (data.id && data.id.length < 5) {
      newMessage.id = "아이디는 5글자 이상이어야합니다";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }

    const requestBody = { id: data.id };
    idCheckRequest(requestBody).then(idCheckResponse);
  };

  const onEmailButtonClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      id: "",
      email: "",
    };

    if (!isIdCheck) {
      newMessage.id = "아이디 중복확인좀 해라";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }
    if (isIdCheck && !data.email) {
      newMessage.email = "이메일을 입력해주세요";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }

    const checkedEmail = emailPattern.test(data.email);

    if (isIdCheck && !checkedEmail) {
      setEmailError(true);
      newMessage.email = "이메일 형식이 아닙니다";
      setMessage(newMessage);
      return;
    }

    const requestBody = { id: data.id, email: data.email };
    emailCertificationRequest(requestBody).then(emailCertificationResponse);
  };

  //이메일 인증
  const emailCertificationResponse = (responseBody) => {
    let newMessage = {
      id: "",
      email: "",
    };

    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("아이디와 이메일을 모두 입력해주세요");
    }

    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      newMessage.id = "이미 사용중인 아이디입니다";
      inputRef.current?.focus();
      setIdCheck(false);
      setMessage(newMessage);
    }

    if (code === ResponseCode.MAIL_FAIL) alert("이메일 전송에 실패했습니다");
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다");
    if (code === ResponseCode.SUCCESS) setEmailError(false);
    setEmailCheck(true);

    newMessage.email = "인증번호가 전송되었습니다";
    inputRef.current?.focus();
    setMessage(newMessage);
    return;
  };

  //인증 확인
  const checkCertificationResponse = (responseBody) => {
    let newMessage = {
      certification_number: "",
    };

    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("아이디, 이메일, 인증번호를 모두 입력해주세요");
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

  //이메일 인증번호 전송버튼 클릭시 유효성 검사
  const onCertificationNumberButtonClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      id: "",
    };

    if (!data.id && !data.email && !data.certification_number)
      alert("아이디, 이메일, 인증번호를 모두 입력해주세요");

    const requestBody = {
      id: data.id,
      email: data.email,
      certificationNumber: data.certification_number,
    };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);

    if (!data.id) {
      newMessage.id = "아이디를 입력해주세요";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }

    if (data.id && data.id.length < 5) {
      newMessage.id = "아이디는 5글자 이상이어야합니다";
      inputRef.current?.focus();
      setMessage(newMessage);
      return;
    }
  };

  //백엔드 오류에 맞는 에러 출력
  const signUpResponse = (responseBody) => {
    if (!responseBody) return;
    let newMessage = {
      id: "",
      email: "",
      certification_number: "",
    };
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("모든 값을 입력해주세요");
    }
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      newMessage.id = "이미 사용중인 아이디입니다";
      inputRef.current?.focus();
      setIdCheck(false);
      setMessage(newMessage);
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
      navigate("/not_band/sign-in");
    }
  };

  //해당 조건에 다 만족하면 회원가입 완료
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

    if (data.id === "") {
      newMessage.id = "아이디를 입력해주세요";
    } else if (data.id.length < 5) {
      newMessage.id = "아이디는 5글자 이상이어야 합니다";
    } else if (!isIdCheck) {
      newMessage.id = "중복 확인을 해주세요";
    } else if (isIdCheck && isIdError) {
      newMessage.id = "사용 불가한 아이디 입니다";
    } else if (!data.nickName) {
      newMessage.nickName = "닉네임을 입력해주세요";
    } else if (data.password === "") {
      newMessage.password = "비밀번호를 입력해주세요";
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/.test(data.password)) {
      newMessage.password =
        "비밀번호는 8-13글자 사이, 영어와 숫자를 섞어야 합니다";
    } else if (data.password2 === "") {
      newMessage.password2 = "비밀번호 재확인해주세요";
    } else if (data.password !== data.password2) {
      newMessage.password2 = "비밀번호가 일치하지 않습니다";
    } else if (data.name === "") {
      newMessage.name = "이름을 입력해주세요";
    } else if (
      /[^0-9]/.test(data.phoneNumber) ||
      data.phoneNumber.includes("-") ||
      data.phoneNumber.length !== 11 ||
      !data.phoneNumber.startsWith("010")
    ) {
      newMessage.phoneNumber = "휴대폰 번호를 다시 입력해주세요";
    } else if (data.email === "") {
      newMessage.email = "이메일을 입력해주세요";
    } else if (!isEmailCheck) {
      newMessage.email = "이메일 인증을 눌러주세요";
    } else if (data.certification_number === "") {
      newMessage.certification_number = "인증번호를 입력해주세요";
    } else if (!isCertificationCheck) {
      newMessage.certification_number = "인증번호를 확인해주세요";
    } else {
      console.log(data.zipCode, data.address, data.detailAddress);
      const requestBody = {
        id: data.id,
        nickName: data.nickName,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        certificationNumber: data.certification_number,
        zipCode: data.zipCode,
        address: data.address,
        detailAddress: data.detailAddress,
      };
      signUpRequest(requestBody).then(signUpResponse);
    }

    setMessage(newMessage);

    if (newMessage.id) {
      inputRef.current?.focus();
    } else if (newMessage.nickName) {
      nickNameRef.current?.focus();
    } else if (newMessage.password) {
      passwordRef.current?.focus();
    } else if (newMessage.password2) {
      password2Ref.current?.focus();
    } else if (newMessage.name) {
      nameRef.current?.focus();
    } else if (newMessage.phoneNumber) {
      phoneNumberRef.current?.focus();
    } else if (newMessage.email) {
      emailRef.current?.focus();
    } else if (newMessage.certification_number) {
      certification_numberRef.current?.focus();
    }
  };

  //유효성검사
  function dataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData(function (prevData) {
      return {
        ...prevData,
        [name]: value,
      };
    });

    if (name === "id") {
      let newMessage = { ...message };

      if (value.length > 0 && value.length < 5) {
        newMessage.id = "아이디는 5글자 이상이어야 합니다";
      } else {
        newMessage.id = "";
      }

      setMessage(newMessage);
      setIdCheck(false);
    }

    if (name === "nickName" && value !== "") {
      let newMessage = { ...message };
      newMessage.nickName = "";
      setMessage(newMessage);
    }

    if (name === "password") {
      let newMessage = { ...message };

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

      if (passwordRegex.test(value)) {
        newMessage.password = "";
      } else {
        newMessage.password =
          "비밀번호는 8-13글자 사이, 영어와 숫자를 섞어야 합니다";
      }

      setMessage(newMessage);
    }

    if (name === "password2") {
      let newMessage = { ...message };

      if (data.password !== value) {
        newMessage.password2 = "비밀번호가 일치하지 않습니다";
      } else {
        newMessage.password2 = "";
      }

      setMessage(newMessage);
    }

    if (name === "name" && value !== "") {
      let newMessage = { ...message };
      newMessage.name = "";
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

      setMessage(newMessage);
    }

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
  }

  return (
    <div className="signup">
      <form onSubmit={signUpSubmit}>
        <h1>회원 가입</h1>
        <p>
          <b>*표시는 반드시 입력해야 하는 항목입니다.</b>
        </p>

        <div>
          <p>
            <b>ID*</b>
          </p>
          <input
            type="text"
            className="input_simple"
            name="id"
            style={{ width: "270px" }}
            ref={inputRef}
            value={data.id}
            placeholder="아이디를 입력해주세요"
            onChange={dataChange}
          />
          <button className="add-btn" onClick={onIdButtionClickHandler}>
            중복 확인
          </button>
          <br />
          {message.id ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.id}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>NICKNAME*</b>
          </p>
          <input
            type="text"
            className="input_simple"
            name="nickName"
            ref={nickNameRef}
            value={data.nickName}
            placeholder="닉네임을 입력해주세요"
            onChange={dataChange}
          />
          <br />
          {message.nickName ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.nickName}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>PASSWORD*</b>
          </p>
          <input
            type="password"
            className="input_simple"
            name="password"
            ref={passwordRef}
            value={data.password}
            placeholder="비밀번호를 입력해주세요"
            onChange={dataChange}
          />
          <br />
          {message.password ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.password}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>PASSWORD 확인*</b>
          </p>
          <input
            type="password"
            className="input_simple"
            name="password2"
            ref={password2Ref}
            value={data.password2}
            placeholder="비밀번호를 재입력해주세요"
            onChange={dataChange}
          />
          <br />
          {message.password2 ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.password2}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>NAME*</b>
          </p>
          <input
            type="text"
            className="input_simple"
            name="name"
            ref={nameRef}
            value={data.name}
            placeholder="이름을 입력해주세요"
            onChange={dataChange}
          />
          <br />
          {message.name ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.name}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>PHONE-NUMBER*</b>
          </p>
          <input
            type="text"
            className="input_simple"
            name="phoneNumber"
            ref={phoneNumberRef}
            value={data.phoneNumber}
            placeholder="휴대폰 번호를 입력해주세요 예시)01012341234"
            onChange={dataChange}
            maxLength={11}
          />
          <br />
          {message.phoneNumber ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.phoneNumber}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>E-MAIL*</b>
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
          {message.email ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.email}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div>
          <p>
            <b>인증번호*</b>
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
          {message.certification_number ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <span className="message">{message.certification_number}</span>
            </>
          ) : (
            "\u00A0"
          )}
        </div>

        <div className="input-add">
          <p>
            <b>ADDRESS</b>
          </p>
          <input
            type="text"
            name="zipCode"
            value={data.zipCode}
            className="input_simple"
            style={{ width: "270px" }}
            placeholder="우편 번호"
            readOnly
          />
          <button onClick={handleAddressSearch} className="add-btn">
            우편번호 검색
          </button>
          <br />
          <input
            type="text"
            name="address"
            value={data.address}
            className="input_simple"
            placeholder="주소"
            readOnly
          />
          <br />
          <input
            type="text"
            name="detailAddress"
            value={data.detailAddress || ""}
            className="input_simple"
            onChange={dataChange}
            placeholder="상세 주소"
          />
        </div>

        <button type="submit" className="btnRed">
          회원가입
        </button>
      </form>
    </div>
  );
}

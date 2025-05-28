import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/main/index.css";
import "../../css/main/main.css";
import { ResponseCode } from "../../types/enums";
import { updateUserInfo } from "../../apis";

export default function PasswordFindOk() {
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const navigate = useNavigate();

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
  const location = useLocation();
  const memId = location.state?.memId;

  const signUpSubmit = async (e) => {
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

    if (data.password === "") {
      newMessage.password = "비밀번호를 입력해주세요";
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/.test(data.password)) {
      newMessage.password =
        "비밀번호는 8-13글자 사이, 영어와 숫자를 섞어야 합니다";
    } else if (data.password2 === "") {
      newMessage.password2 = "비밀번호 재확인해주세요";
    } else if (data.password !== data.password2) {
      newMessage.password2 = "비밀번호가 일치하지 않습니다";
    } else {
      const result = await updateUserInfo(memId, "password", data.password);
      if (result) {
        newMessage.password2 =
          "비밀번호가 변경되었습니다. 변경된 비밀번호로 로그인해주세요";
      } else {
        newMessage.password2 = "비밀번호가 변경에 실패하였습니다";
      }
    }

    if (newMessage.password) {
      passwordRef.current?.focus();
    } else if (newMessage.password2) {
      password2Ref.current?.focus();
    }
    setMessage(newMessage);
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

    if (name === "password") {
      let newMessage = { ...message };

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

      if (passwordRegex.test(value)) {
        newMessage.password = "";
      } else {
        newMessage.password =
          "비밀번호는 8-13글자 사이, 영어와 숫자를 섞어야 합니다.";
      }

      setMessage(newMessage);
    }

    if (name === "password2") {
      let newMessage = { ...message };

      if (data.password !== value) {
        newMessage.password2 = "비밀번호가 일치하지 않습니다.";
      } else {
        newMessage.password2 = "";
      }

      setMessage(newMessage);
    }
  }
  return (
    <div className="id_find_group">
      <div>
        <p>
          <b>PASSWORD</b>
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
        <div className="user_edit_error">
          {message.password ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.password}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>

      <div>
        <p>
          <b>PASSWORD 확인</b>
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
        <div className="user_edit_error">
          {message.password2 ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.password2}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>

      <button type="submit" className="btnRed" onClick={signUpSubmit}>
        비밀번호 수정
      </button>
    </div>
  );
}

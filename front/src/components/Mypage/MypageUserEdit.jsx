import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  idCheckRequest,
  getUserRequest,
  updateUserInfo,
  signInRequest,
  checkCertificationRequest,
  emailCertificationRequest,
  deleteUser,
} from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useCookies } from "react-cookie";
import "../../css/main/index.css";
import "../../css/mypage/mypageUserEdit.css";
import "../../css/mypage/mypage.css";
import { ResponseCode } from "../../types/enums";

export default function MypageUserEdit() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const password3Ref = useRef(null);
  const nameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const certification_numberRef = useRef(null);

  const [isEditable, setIsEditable] = useState(false);
  const [nickname, setNickname] = useState("");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [code, setCode] = useState(null);
  const [memId, setMemId] = useState(null);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [isIdError, setIdError] = useState(false);
  const [isIdCheck, setIdCheck] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [isAddressCheck, setAdressCheck] = useState(false);
  const [isCertificationNumberError, setCertificationNumberError] =
    useState(false);
  const [isCertificationCheck, setCertificationNumberCheck] = useState(false);
  const [data, setData] = useState({
    id: "",
    nickname: "",
    password: "",
    password2: "",
    password3: "",
    name: "",
    phoneNumber: "",
    email: "",
    certification_number: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    building: "",
  });
  //데이터

  const [message, setMessage] = useState({
    id: "",
    nickname: "",
    password: "",
    password2: "",
    password3: "",
    name: "",
    phoneNumber: "",
    email: "",
    certification_number: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    building: "",
  });//오류 메세지 출력

  const [editState, setEditState] = useState({
    nickname: false,
    password: false,
    email: false,
    phoneNumber: false,
  });
  //수정 상태
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [confirmPwError, setConfirmPwError] = useState("");
  const [currentPwError, setCurrentPwError] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmNewPw, setConfirmNewPw] = useState("");

  const handlePwOpen = () => {
    setPwOpen(true);
  };
  const handlePwClose = () => {
    setEditState((prev) => ({
      ...prev,
      passwordNew: false,
    }));
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchUser(memId);
    }
  }, []);

  //사용자 정보 조회 api 함수 출력
  const fetchUser = async (memId) => {
    try {
      const response = await getUserRequest(memId);
      setUser(response);
      setNickname(response.memNickname);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        name: user.memName || "",
        nickname: user.memNickname || "",
        phoneNumber: user.memPhone || "",
        email: user.memEmail || "",
        address: user.memAddress || "",
        detailAddress: user.memDetailAddress || "",
        zipCode: user.memZipcode || "",
      }));
    }
  }, [user]);

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  const onEmailButtonClickHandler = (e) => {
    e.preventDefault();

    let newMessage = {
      email: "",
    };

    // 이메일 입력 체크
    if (!data.email) {
      newMessage.email = "이메일을 입력해주세요";
      inputRef.current?.focus();
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

    // 인증 요청 보내기 (memId 사용)
    const requestBody = { id: 11234, email: data.email };
    emailCertificationRequest(requestBody).then(emailCertificationResponse);
  };

  const emailCertificationResponse = (responseBody) => {
    let newMessage = {
      id: memId,
      email: "",
    };

    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("이메일을 입력해주세요");
    }

    if (code === ResponseCode.MAIL_FAIL) alert("이메일 전송에 실패했습니다.");
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.SUCCESS) {
      setEmailError(false);
      setEmailCheck(true);
      newMessage.email = "인증번호가 전송되었습니다";
    }
    inputRef.current?.focus();
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
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");

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
      alert("이메일과 인증번호를 모두 입력해주세요");
      return;
    }

    const requestBody = {
      id: 11234,
      email: data.email,
      certificationNumber: data.certification_number,
    };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
  };

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
    setAdressCheck(true);
  };

  // 로그인 성공 처리 
  if (code === ResponseCode.SUCCESS) {
    let newMessage = { ...message };
    newMessage.password3 = "비밀번호가 일치합니다";
    passwordRef.current?.focus();
    setMessage(newMessage);
    setTimeout(() => {
      let clearMessage = { ...newMessage };
      clearMessage.password = "";
      setMessage(clearMessage);
    }, 2000);
    setEditState((prev) => ({
      ...prev,
      ["password"]: false,
    }));
  }

  //유효성 처리
  function dataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData(function (prevData) {
      return {
        ...prevData,
        [name]: value,
      };
    });

    if (name === "nickname" && value !== "") {
      let newMessage = { ...message };
      newMessage.nickname = "";
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

    if (name === "password3" && value !== "") {
      let newMessage = { ...message };
      newMessage.password = "";
      setMessage(newMessage);
    }
  }
  const handleButtonClick = async (field) => {
    let newMessage = {
      id: "",
      nickname: "",
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


    if (editState[field]) {
      // 1. 닉네임 수정 처리
      if (field === "nickname") {
        if (data.nickname === "") {
          newMessage.nickname = "닉네임을 입력해주세요";
          setMessage(newMessage);
          return;
        } else if (data.nickname === user.memNickname) {
          newMessage.nickname = "같은 닉네임 입니다";
          setMessage(newMessage);
          return;
        } else {
          newMessage.nickname = "닉네임이 수정되었습니다";
          setMessage(newMessage);
          await updateUserInfo(memId, field, data.nickname);
          fetchUser(memId);
          setTimeout(() => {
            newMessage.nickname = "";
            setMessage(newMessage);
            setEditState((prev) => ({
              ...prev,
              [field]: false,
            }));
          }, 1000);
        }
      }

      // 새 비밀번호 입력 처리
      if (field === "passwordNew") {
        if (data.password === "") {
          newMessage.password = "새 비밀번호를 입력해주세요";
        } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/.test(data.password)) {
          newMessage.password =
            "비밀번호는 8-13글자 사이, 영어와 숫자를 섞어야 합니다";
        } else if (data.password2 === "") {
          newMessage.password2 = "비밀번호 재확인해주세요";
        } else if (data.password !== data.password2) {
          newMessage.password2 = "비밀번호가 일치하지 않습니다";
        } else {

          // 비밀번호 수정 요청
          const updatePasswordResult = await updateUserInfo(
            memId,
            "password",
            data.password,
          );
          if (updatePasswordResult) {
            fetchUser(memId);
            newMessage.password2 = "비밀번호가 수정되었습니다";
            setMessage(newMessage);
            setTimeout(() => {
              setMessage({
                ...newMessage,
                password: "",
                password2: "",
              });
              setEditState((prev) => ({
                ...prev,
                passwordNew: false,
              }));
              setData((prev) => ({
                ...prev,
                password: "",
                password2: "",
              }));

              newMessage.password2 = "";
              setOpen(false);
            }, 1000);
          }
        }

        if (data.password2 === "") {
          password2Ref.current?.focus();
        }
      }

      //이름 유효성 검사 및 수정
      if (field === "name") {
        if (data.name === "") {
          newMessage.name = "이름을 입력해주세요";
          setMessage(newMessage);
          return;
        } else if (data.name === user.memName) {
          newMessage.name = "같은 이름 입니다";
          setMessage(newMessage);
          return;
        } else {
          newMessage.name = "이름이 수정되었습니다";
          setMessage(newMessage);
          await updateUserInfo(memId, field, data.name);
          fetchUser(memId);
          setTimeout(() => {
            newMessage.name = "";
            setMessage(newMessage);
            setEditState((prev) => ({
              ...prev,
              [field]: false,
            }));
          }, 1000);
        }
      }

      //전화번호 유효성 검사 및 수정
      if (field === "phoneNumber") {
        const cleanedValue = data.phoneNumber.replace(/[^0-9]/g, "");

        if (data.phoneNumber !== cleanedValue) {
          newMessage.phoneNumber = "휴대폰 번호에는 숫자만 입력 가능합니다";
          setMessage(newMessage);
          return;
        } else if (data.phoneNumber.includes("-")) {
          newMessage.phoneNumber = "휴대폰 번호에는 '-'를 제외하여주세요";
          setMessage(newMessage);
          return;
        } else if (!cleanedValue.startsWith("010")) {
          newMessage.phoneNumber = "휴대폰 번호는 010으로 시작해야 합니다";
          setMessage(newMessage);
          return;
        } else if (cleanedValue.length !== 11) {
          newMessage.phoneNumber = "휴대폰 번호는 총 11자리여야 합니다";
          setMessage(newMessage);
          return;
        } else if (data.phoneNumber === user.memPhone) {
          newMessage.phoneNumber = "같은 휴대폰 번호입니다";
          setMessage(newMessage);
          return;
        } else {
          newMessage.phoneNumber = "휴대폰 번호가 수정되었습니다";
          setMessage(newMessage);
          await updateUserInfo(memId, field, cleanedValue);
          fetchUser(memId);
          setTimeout(() => {
            newMessage.phoneNumber = "";
            setMessage(newMessage);
            setEditState((prev) => ({
              ...prev,
              [field]: false,
            }));
          }, 1000);
        }
      }

      //이메일 유효성 검사 및 수정
      if (field === "email") {
        if (isEmailCheck) {
          newMessage.email = "이메일이 수정되었습니다";
          setMessage(newMessage);
          await updateUserInfo(memId, field, data.email);
          fetchUser(memId);

          setTimeout(() => {
            newMessage.email = "";
            setMessage(newMessage);
            setEditState((prev) => ({
              ...prev,
              [field]: false,
            }));
          }, 1000);
        }
      }

      if (field === "address") {
        if (!isAddressCheck) {
          newMessage.address = "주소를 수정해주세요";
          setMessage(newMessage);
          console.log("주소좀 수정");
        } else {
          newMessage.address = "주소가 수정되었습니다";
          setMessage(newMessage);
          await updateUserInfo(
            memId,
            "address",
            `${data.zipCode},${data.address},${data.detailAddress}`,
          );
          fetchUser(memId);

          setTimeout(() => {
            newMessage.address = "";
            setMessage(newMessage);
            setEditState((prev) => ({
              ...prev,
              [field]: false,
            }));
          }, 1000);
        }
      }
    } else {
      setEditState((prev) => ({
        ...prev,
        [field]: true,
      }));
    }
  };

  useEffect(() => {
    if (open) {
      if (data.password3 == "") {
        const timeout = setTimeout(() => {
          password3Ref.current?.focus();
        }, 50); // 약간의 지연으로 렌더 타이밍 보장

        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          password2Ref.current?.focus();
        }, 50); // 약간의 지연으로 렌더 타이밍 보장

        return () => clearTimeout(timeout);
      }
    }
  }, [open]);

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const handleDelete = async () => {
    const response = await deleteUser(memId);

    setOpenModal(true); // 성공 시 모달 열기
  };

  const handleModal = () => {
    setOpenModal(false);
    removeCookie("accessToken", { path: "/" });
    navigate("/not_band");
  };

  return (
    <div className="memInfoUpdate_group">
      <Dialog open={openModal} onClose={handleModal}>
        <DialogTitle>알림</DialogTitle>
        <DialogContent>
          <p>회원탈퇴가 되었습니다. 다시 만나길 기원합니다~</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModal} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <div className="mp_R_s_title">
        <h3>회원 정보 수정</h3>
      </div>
      <div className="infoUp_box">
        <p className="infoUp_box_p1">아이디</p>
        <p>
          {memId}&nbsp;&nbsp;
          <p style={{ color: "#FF4A01" }}>*아이디는 수정 불가합니다.</p>
        </p>
      </div>
      <div className="infoUp_box">
        <p className="infoUp_box_p1">닉네임</p>
        {editState.nickname ? (
          <input
            type="text"
            value={data.nickname}
            className="infoUp_box_name"
            name="nickname"
            size={nickname.length || 1}
            onChange={dataChange}
          />
        ) : (
          <p>{nickname}</p>
        )}
        <div className="user_edit_error">
          {message.nickname ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.nickname}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
        <div
          className="infoUp_box_sbtn"
          onClick={() => handleButtonClick("nickname")}
          style={{
            backgroundColor: isEditable ? "#FF4A01" : "#FCFEFD",
            color: isEditable ? "#FCFEFD" : "#0A0A0A",
            border: isEditable ? "none" : "1px solid #0A0A0A",
          }}
        >
          {editState.nickname ? "확인" : "수정"}
        </div>
      </div>
      <div className="infoUp_box">
        <p className="infoUp_box_p1">비밀번호</p>
        <div
          className="infoUp_box_btn"
          onClick={() => handleButtonClick("passwordNew")}
        >
          비밀번호 변경
        </div>

        <Dialog open={editState.passwordNew === true} onClose={handlePwClose}>
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: "10px" }}>
              <>
                <p className="mypage_modal_title">새 비밀번호</p>
                <input
                  type="password"
                  className="mypage_modal_input_passwd"
                  name="password"
                  ref={passwordRef}
                  value={data.password}
                  onChange={dataChange}
                />
                <br />
                <div className="user_edit_error">
                  {message.password && (
                    <>
                      <span className="material-symbols-outlined">error</span>
                      <p className="message">{message.password}</p>
                    </>
                  )}
                </div>
                <p className="mypage_modal_title">새 비밀번호 확인</p>
                <input
                  type="password"
                  className="mypage_modal_input_passwd"
                  name="password2"
                  ref={password2Ref}
                  value={data.password2}
                  onChange={dataChange}
                />
                <br />
                <div className="user_edit_error">
                  {message.password2 && (
                    <>
                      <span className="material-symbols-outlined">error</span>
                      <p className="message">{message.password2}</p>
                    </>
                  )}
                </div>
              </>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePwClose} color="secondary">
              닫기
            </Button>
            <Button
              onClick={() => handleButtonClick("passwordNew")}
              color="primary"
              variant="contained"
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="infoUp_box">
        <p className="infoUp_box_p1">이름</p>
        {editState.name ? (
          <input
            type="text"
            value={data.name}
            className="infoUp_box_name"
            name="name"
            size={data.name.length || 1}
            onChange={dataChange}
          />
        ) : (
          <p>{data.name}</p>
        )}
        <div className="user_edit_error">
          {message.name ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.name}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
        <div
          className="infoUp_box_sbtn"
          onClick={() => handleButtonClick("name")}
          style={{
            backgroundColor: isEditable ? "#FF4A01" : "#FCFEFD",
            color: isEditable ? "#FCFEFD" : "#0A0A0A",
            border: isEditable ? "none" : "1px solid #0A0A0A",
          }}
        >
          {editState.name ? "확인" : "수정"}
        </div>
      </div>
      <div className="infoUp_box">
        <p className="infoUp_box_p1">휴대폰 번호</p>
        {editState.phoneNumber ? (
          <input
            type="text"
            value={data.phoneNumber}
            className="infoUp_box_name"
            name="phoneNumber"
            size={data.phoneNumber.length || 1}
            onChange={dataChange}
          />
        ) : (
          <div className="infoUp_box_nobox">
            {formatPhoneNumber(data.phoneNumber)}
          </div>
        )}
        <div className="user_edit_error">
          {message.phoneNumber ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.phoneNumber}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
        <div
          className="infoUp_box_sbtn"
          onClick={() => handleButtonClick("phoneNumber")}
          style={{
            backgroundColor: isEditable ? "#FF4A01" : "#FCFEFD",
            color: isEditable ? "#FCFEFD" : "#0A0A0A",
            border: isEditable ? "none" : "1px solid #0A0A0A",
          }}
        >
          {editState.phoneNumber ? "확인" : "수정"}
        </div>
      </div>
      <div
        className="infoUp_box infoUp_box334"
        style={{ height: editState.email ? "80px" : "60px" }}
      >
        <p className="infoUp_box_p1 my_user_email_group">이메일</p>
        {editState.email ? (
          <div className="userEdit_email">
            <div>
              <div>
                <input
                  type="text"
                  value={data.email}
                  className="infoUp_box_name"
                  name="email"
                  size={data.email.length || 1}
                  onChange={dataChange}
                />
                <button
                  className="add-btn"
                  onClick={(e) => onEmailButtonClickHandler(e)}
                >
                  이메일 인증
                </button>
              </div>
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
              <div>
                <input
                  type="text"
                  className="infoUp_box_name33"
                  name="certification_number"
                  style={{ width: "270px" }}
                  ref={certification_numberRef}
                  value={data.certification_number}
                  onChange={dataChange}
                  placeholder=" 인증번호 입력"
                  maxLength={4}
                />
                <button
                  className="add-btn"
                  onClick={(e) => onCertificationNumberButtonClickHandler(e)}
                >
                  인증 확인
                </button>
              </div>
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
          </div>
        ) : (
          <p>{data.email}</p>
        )}
        <div
          className="infoUp_box_sbtn infoUp_box_sbtn2"
          onClick={() => handleButtonClick("email")}
          style={{
            backgroundColor: isEditable ? "#FF4A01" : "#FCFEFD",
            color: isEditable ? "#FCFEFD" : "#0A0A0A",
            border: isEditable ? "none" : "1px solid #0A0A0A",
          }}
        >
          {editState.email ? "확인" : "수정"}
        </div>
      </div>
      <div className="infoUp_box_addgroup">
        <p className="infoUp_box_p1">주소</p>
        {!editState.address ? (
          <>
            <div className="infoUp_box_address">
              <p>{data.zipCode}</p>
              <p>{data.address}</p>
              <p>{data.detailAddress} </p>
              <p>{data.building}</p>
            </div>
          </>
        ) : (
          <>
            <div className="infoUp_box_address infoUp_box_address_my">
              <input
                type="text"
                name="zipCode"
                value={data.zipCode}
                className="infoUp_box_name2"
                style={{ maxWidth: "280px" }}
                placeholder="우편 번호"
                readOnly
              />
              <button onClick={handleAddressSearch} className="add-btn add-btn22">
                우편번호 검색
              </button>
              <br />
              <input
                type="text"
                name="address"
                value={data.address}
                className="infoUp_box_name2"
                style={{ maxWidth: "400px" }}
                placeholder="주소"
                readOnly
              />
              <br />
              <input
                type="text"
                name="detailAddress"
                value={data.detailAddress || ""}
                className="infoUp_box_name2"
                style={{ maxWidth: "400px" }}
                onChange={dataChange}
                placeholder="상세 주소"
              />
              <button onClick={handleAddressSearch} className="add-btn add-btn33">
                우편번호 검색
              </button>
            </div>
          </>
        )}
        <div className="user_edit_error">
          {message.address ? (
            <>
              <span className="material-symbols-outlined">error</span>{" "}
              <p className="message">{message.address}</p>
            </>
          ) : (
            "\u00A0"
          )}
        </div>
        <div
          className="infoUp_box_sbtn"
          onClick={() => handleButtonClick("address")}
          style={{
            backgroundColor: isEditable ? "#FF4A01" : "#FCFEFD",
            color: isEditable ? "#FCFEFD" : "#0A0A0A",
            border: isEditable ? "none" : "1px solid #0A0A0A",
          }}
        >
          {editState.address ? "확인" : "수정"}
        </div>
      </div>
      <div className="memberout" onClick={() => handleDelete()}>
        회원탈퇴
      </div>
    </div>
  );
}

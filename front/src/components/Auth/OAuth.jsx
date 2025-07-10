import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

export default function OAuth() {
  const { token, expirationTime } = useParams(); // expriationTime -> expirationTime으로 수정
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token:", token, "expirationTime:", expirationTime); // 값이 제대로 출력되는지 확인
    if (!token || !expirationTime) return;

    const now = new Date().getTime();
    const expires = new Date(Date.now() + expirationTime * 1000);

    setCookie("accessToken", token, { expires, path: "/" });
    navigate("/not_band");
  }, [token, expirationTime, setCookie, navigate]);

  return <></>;
}

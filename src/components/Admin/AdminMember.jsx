import React, { useState, useEffect } from "react"; //일단필수
import { getUserAll, deleteUser } from "../../apis"; //index.js에서 필요한 함수 가져오기 만약 없으면 지지직잡고 울기
import "../../css/admin/adminMember.css";
import "../../css/main/index.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; //모달 임포트
import Paging from "../Mypage/Paging"; //컴포넌트 불러올때 임포트.

export default function AdminMember() {
  const [value2, setValue2] = useState(1);
  const [users, setUsers] = useState([]); //배열변수선언 대괄호, 앞:값이변하지 않음 불러오기용, 뒤(set무조건 기입):값 바꿀때
  const [open, setOpen] = useState(false);
  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //여기함수이름 알아서바꾸기

    fetchUsers(); //얘 잘 챙기기
  }, []); //대괄호:새로고침 할때마다 쓴다, 조건하려면 대괄호 안에 'users'같은 앞 변수 넣기

  const pagedItems = users.slice(start, end);

  const fetchUserDel = async (memId) => {
    try {
      const result = await deleteUser(memId);
      fetchUsers();
      setOpen(true);
    } catch (error) {
    }
  };

  const fetchUsers = async () => {
    //'fetch'고정 'Users'가 원하는대로 바꾸기
    try {
      const result = await getUserAll();
      setUsers(result);
    } catch (error) {
      console.error("유저 조회 실패:", error);
    }
  }; //변수 쓰는 함수. useEffect 밖에 있어도 가능. 리턴 위에만 있으면 됨.

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>관리자</DialogTitle>
        <DialogContent>
          <p>회원탈퇴가 완료되었습니다.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
      <div className="adminMember_top">
        <h1>회원 관리</h1>
      </div>

      <div className="adminMember_group">
        <div className="adminMember_maintitle">
          <h2>회원 목록</h2>
          <p>
            {users.length}
            <span>명</span>
          </p>
        </div>

        <div className="adminMember_titleArea">
          <div className="adminMember_title">
            <p>아이디</p>
            <p>이메일</p>
            <p>가입일</p>
            <p>포인트</p>
            <p>관리</p>
          </div>
        </div>

        <table>
          {pagedItems.map(
            (
              member, //map이 반복문. member는 임시선언(자유롭게)
            ) => (
              <tr className="adminMember_Tbody" key={member.id}>
                <td>{member.memId}</td>
                <td>{member.memEmail}</td>
                <td>2025.05.06</td>
                <td>{member.memPoint.toLocaleString()}P</td>{" "}
                {/* toLocaleString 숫자 콤마찍는거 */}
                <td>
                  <button onClick={() => fetchUserDel(member.memId)}>
                    탈퇴
                  </button>
                </td>
              </tr>
            ),
          )}
        </table>

        <div className="page_change3">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2} //값을 바꿔서 부모한테 던져줌
            totalPage={users.length} //변수길이. 변하면 안돼, 앞변수.
          />{" "}
          {/*컴포넌트 불러오기.'<컴포넌트명/>'*/}
        </div>
      </div>
    </>
  );
}

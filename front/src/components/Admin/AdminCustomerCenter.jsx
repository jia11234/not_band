import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/main/index.css';
import '../../css/Cs/cs.css';
import { getCs, csDelete, csTogglePinStatus } from "../../apis";

export default function AdminCustomerCenter() {
  const [activeTab, setActiveTab] = useState('notice');
  const navigate = useNavigate();

  return (
    <div className='customercenter_group2'>
      <div className='customercenter_title'>고객센터</div>
      <div className="customercenter_wrapper">
        <button onClick={() => navigate('/not_band/admin/csupload')}>공지등록</button>
      </div>
      <div className='customerct_content'>
        <NoticeComponent />
      </div>
    </div>
  )
}

function NoticeComponent() {
  const [cs, setCs] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCs();
  }, []);

  const fetchCs = async () => {
    try {
      const response = await getCs();
      setCs(response);
    } catch (err) {
      console.error("공지 불러오기 실패", err.message);
    }
  };

  

  const totalPages = Math.ceil(cs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = cs.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePinToggle = async (csId) => {
    try {
      const response = await csTogglePinStatus(csId);
      fetchCs();
      console.log('고정 상태 변경 성공:', response);
      // 상태 변경 후 UI를 갱신하거나 필요한 처리를 추가할 수 있음
    } catch (error) {
      console.error('고정 상태 변경 실패:', error);
    }
  };

  const handleDeleteClick = async (csId) => {
    try {
      await csDelete(csId);
      setSelectedNotice(null);
      setModalMessage('삭제되었습니다.');
      fetchCs();
      setShowDeleteModal(true);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };
  

  return (
    <>
      {!selectedNotice && (
        <>
          {currentItems
            .filter(notice => notice.csPin === true)
            .map((notice, index) => (
              <div className='customerct_notice_group pinned' key={`pinned-${index}`} onClick={() => setSelectedNotice(notice)}>
                <div className='notice_num' style={{ width: "75px", marginLeft: "-10px" }}>[고정]</div>
                <div className='notice_title'>{notice.csTitle}</div>
                <div className='notice_day'>{new Date(notice.csAdd).toISOString().split('T')[0]}</div>
                <div className='notice_btn_fixed'>
                <button
                  className={notice.csPin ? 'unpin' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinToggle(notice.csId); // 고정 상태 변경 함수 호출
                  }}
                >
                  {notice.csPin ? '고정 해제' : '고정'}
                </button>
                </div>
                <div className='notice_btn_delete'>
                <button onClick={() => handleDeleteClick(notice.csId)}>삭제</button>
                </div>
              </div>
            ))}
            
          {currentItems
            .filter(notice => notice.csPin !== true)
            .map((notice, index) => (
              <div className='customerct_notice_group' key={`normal-${index}`} onClick={() => setSelectedNotice(notice)}>
                <div className='notice_num'>{cs.length - (startIdx + index)}</div>
                <div className='notice_title'>{notice.csTitle}</div>
                <div className='notice_day'>{new Date(notice.csAdd).toISOString().split('T')[0]}</div>
                <div className='notice_btn_fixed'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinToggle(notice.csId);
                  }}
                >
                  {notice.csPin ? '고정 해제' : '고정'}
                </button>
                </div>
                <div className='notice_btn_delete'>
                <button onClick={() => handleDeleteClick(notice.csId)}>삭제</button>
                </div>
              </div>
            ))}

          <div className='notice_pagination'>
            <button onClick={handlePrev}><img src="/images/instrument/left.png" alt="왼쪽 버튼" /></button>
            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageClick(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNext}><img src="/images/instrument/right.png" alt="오른쪽 버튼" /></button>
          </div>
        </>
      )}

      {selectedNotice && (
        <div className='customerct_notice_detail'>
          <div className='notice_detail_title'>
            <p>{selectedNotice.csTitle}</p>
            <p>관리자 | {new Date(selectedNotice.csAdd).toISOString().split('T')[0]}</p>
          </div>
          <div className='notice_detail_content'>{selectedNotice.csContent}</div>
          <button className='notice_back_btn' onClick={() => setSelectedNotice(null)}>목록</button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{modalMessage}</p>
            <button onClick={() => setShowDeleteModal(false)}>확인</button>
          </div>
        </div>
      )}
    </>
  );
}

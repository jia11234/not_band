import React, { useState, useRef, useEffect } from "react";
import "../../css/main/index.css";
import "../../css/Cs/cs.css";
import { getCs } from "../../apis";

export default function Cs() {
  const [activeTab, setActiveTab] = useState("notice");

  return (
    <div className="customercenter_group">
      <div className="customercenter_title">고객센터</div>
      <div className="customerct_smanu">
        <p
          onClick={() => setActiveTab("notice")}
          className={activeTab === "notice" ? "active-tab" : ""}
        >
          공지사항
        </p>
        <p
          onClick={() => setActiveTab("faq")}
          className={activeTab === "faq" ? "active-tab" : ""}
        >
          FAQ
        </p>
      </div>
      <div className="customerct_content">
        <p>{activeTab === "notice" && <NoticeComponent />}</p>
        <p>{activeTab === "faq" && <FaqComponent />}</p>
      </div>
    </div>
  );
}

// 공지사항
function NoticeComponent() {
  const [cs, setCs] = useState([]);
  useEffect(() => {
    fetchCs();
  }, []);

  const fetchCs = async () => {
    try {
      const response = await getCs();
      setCs(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const today = formatDate(new Date());

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <>
    <div className="notice_cs_group_all">
      {!selectedNotice && (
        <>
          {/* 고정 공지사항 먼저 출력 */}
          {currentItems
            .filter((notice) => notice.csPin === true)
            .map((notice, index) => (
              <div
                className="customerct_notice_group pinned"
                key={`pinned-${index}`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div
                  className="notice_num"
                  style={{ width: "75px", marginLeft: "-10px" }}
                >
                  [고정]
                </div>
                <div className="notice_title">{notice.csTitle}</div>
                <div className="notice_day">
                  {new Date(notice.csAdd).toISOString().split("T")[0]}
                </div>
              </div>
            ))}

          {/* 일반 공지사항 출력 */}
          {currentItems
            .filter((notice) => notice.csPin !== 1)
            .map((notice, index) => (
              <div
                className="customerct_notice_group"
                key={`normal-${index}`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div className="notice_num">
                  {cs.length - (startIdx + index)}
                </div>
                <div className="notice_title">{notice.csTitle}</div>
                <div className="notice_day">
                  {new Date(notice.csAdd).toISOString().split("T")[0]}
                </div>
              </div>
            ))}

          {/* 페이지네이션 */}
          <div className="notice_pagination">
            <button onClick={handlePrev}>
              <img src="/images/instrument/left.png" alt="왼쪽 버튼" />
            </button>
            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageClick(i + 1)}
                className={currentPage === i + 1 ? "active-page" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNext}>
              <img src="/images/instrument/right.png" alt="오른쪽 버튼" />
            </button>
          </div>
        </>
      )}
      </div>
      {selectedNotice && (
        <div className="customerct_notice_detail">
          <div className="notice_detail_title">
            <p>{selectedNotice.csTitle}</p>
            <p>
              관리자 |{" "}
              {new Date(selectedNotice.csAdd).toISOString().split("T")[0]}
            </p>
          </div>
          <div className="notice_detail_content">
            {selectedNotice.csContent}
          </div>
          <button
            className="notice_back_btn"
            onClick={() => setSelectedNotice(null)}
          >
            목록
          </button>
        </div>
      )}
    </>
  );
}

// FAQ
function FaqComponent() {
  const faqData = [
    {
      question: "낫밴드는 어떤 회사인가요?",
      answer:
        "낫밴드는 악기와 장비를 구매하거나 중고로 거래할 수 있는 서비스입니다. 초보자분들을 위한 악기 추천 기능은 물론 게임과 이벤트를 통해 음악을 더 재미있게 즐길 수 있는 콘텐츠도 제공하고 있습니다.",
    },
    {
      question: "상품 리뷰는 어떻게 작성하나요?",
      answer:
        " 배송완료일부터 30일 동안 상품 후기를 작성하실 수 있습니다. 마이페이지>주문내역>리뷰 작성하기 순서대로 눌러주세요.",
      images: "/images/customercenter/faq_review_btn.png",
    },
    {
      question: "상품 문의는 어떻게 하나요?",
      answer:
        "상품 상세페이지에서 채팅하기를 누르시면 판매자에게 문의가 가능합니다. 최대한 빠른시일내에 답변해드리도록 하겠습니다.",
    },
    {
      question: "결제 후 얼마나 지나야 제품 수령 가능한가요?",
      answer:
        "품절이 아닌경우 공휴일 제외 3시 이전에 구매해주시면 당일발송을 해드립니다. 공휴일 제외 2-3일 내외로 제품 수령이 가능합니다.",
    },
    {
      question: "회원정보는 어떻게 바꾸나요?",
      answer:
        "아래 링크를 통해 회원정보를 직접 변경하실 수 있습니다. 링크 : http://localhost:5173/not_band/mypage",
    },
    {
      question: "배송비는 얼마인가요?",
      answer:
        "일반적으로 5만원 이하일 경우 3,000원 / 5만원 이상일 경우 무료로 배송됩니다. ",
    },
    {
      question: "구매하고 싶은 제품이 품절이에요.",
      answer: "해당 제품 재입고시 구매하실 수 있습니다.",
    },
    {
      question: "구매한 악기 A/S를 받고 싶습니다.",
      answer:
        "낫밴드는 모든 브랜드 본사와 직접 계약을 하여 제품을 연계 판매합니다. 모든 구매하신 제품에 대해 각 브랜드 본사에서 직접 A/S를 문의해주시기 바랍니다.",
    },
    {
      question: "중고마켓에서 판매자와 채팅은 어떻게 하나요?",
      answer:
        "게시글 오른쪽 하단에서 [채팅하기] 버튼을 눌러주세요. 해당 버튼을 누르면 판매자와 1:1로 채팅할 수 있는 채팅방으로 이동해요",
      images: "/images/customercenter/faq_chat.png",
    },
    {
      question: "중고마켓에서 구매한 상품의 반품이 가능한가요?",
      answer:
        "중고마켓 관련 문제는 저희가 책임지지 않습니다. 판매자와 원만한 합의를 하시길 바랍니다.",
    },
    {
      question: "중고마켓으로 구매한 제품을 사기 당했어요",
      answer:
        "중고마켓에서 구매하신 제품에 대해선 저희가 책임지지 않습니다. 안타깝지만, 해당 제품 판매자와 원만한 합의를 하시길 바랍니다.",
    },
    {
      question: "회원탈퇴 시 개인정보는 삭제되나요?",
      answer:
        "탈퇴 시 개인정보는 지체없이 삭제됩니다. 단, 서비스 운영상 반드시 필요한 경우  개인정보처리방침에 공개한 내용과 같이 일정한 기간 동안 관련된 개인정보를 보관 후 파기합니다.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null); // 하나의 index만 저장

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="cs_cs_group_faq">
      {faqData.map((item, index) => (
        <div className="customerct_faq_group" key={index}>
          <div className="faq_group" onClick={() => toggleIndex(index)}>
            <div className="faq_Q">Q</div>
            <div className="faq_title">{item.question}</div>
            <div className="faq_updown">
              <img
                src="/images/mypage/customerct_down.png"
                alt=""
                className={openIndex === index ? "" : "rotate-180"}
              />
            </div>
          </div>

          {openIndex === index && (
            <div className="faq_a_group">
              <div className="faq_a_Q">A</div>
              <div className="faq_a_title">
                {item.answer
                  .split(".")
                  .filter((sentence) => sentence.trim() !== "")
                  .map((sentence, i) => (
                    <span key={i}>
                      {sentence.trim()}.
                      <br />
                    </span>
                  ))}
                {item.images && (
                  <img
                    src={item.images}
                    alt=""
                    style={{ height: "40px", marginTop: "10px" }}
                  />
                )}
              </div>
              <div className="faq_updown"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

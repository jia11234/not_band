import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  productDetail,
  reviewRegistration,
  getReviewRevId,
  updateReview,
  pointPlus,
} from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/main/index.css";
import "../../css/review/review.css";

export default function ReviewRegistration() {
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const textRef = useRef(null);
  const starRef = useRef(null);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  const [open, setOpen] = useState(false); //모달

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]); //내가만든쿸킥
  const [memId, setMemId] = useState(null);
  const location = useLocation();
  const { product } = location.state || {};
  const { ordNo } = location.state || {};
  const { revNo } = location.state || {};
  const [products, setProducts] = useState([]);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const handleSuccessDialogClose = () => setOpenSuccessDialog(false);

  const handleClose = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band");
  };

  const handleClose2 = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band/login");
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchProducts();
    } else {
      setOpen(true);
    }

    if (revNo) {
      fetchReview(revNo);
    }
  }, []);

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  const fetchProducts = async () => {
    const prdData = await productDetail(product.prdNo);
    setProducts(prdData);
  };

  //수정 하기 위해서 수정할때 revNo를 넘겨주기때문에 revNo가 잇다면 api 함수 호출
  const fetchReview = async (revNo) => {
    const data = await getReviewRevId(revNo); // 수정된 API 호출
    setReviews(data);
    setForm({
      rating: data.revRating || 5, // 기존 리뷰의 별점
      text: data.revContent || "", // 기존 리뷰 내용
    });
    setImages(
      (data.revImgUrl || []).map((img) =>
        img.startsWith("http")
          ? img
          : `http://localhost:8080/api/v1/not_band/images/review/${img.replace("/images/review/", "")}`,
      ),
    );
  };

  // 더미데이터터
  const reviewprd = {
    product: {
      name: "다크클래스 일렉트로닉 디지털 베이스 에취 인피니티 스톤",
      quantity: 1,
      option: "색상",
    },
  };

  const [form, setForm] = useState({
    rating: 5,
    text: "",
  });

  const [errors, setErrors] = useState({
    rating: "",
    text: "",
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];

    if (newImages.length + files.length > 6) {
      setImageError("※ 이미지는 최대 5장까지 업로드 가능합니다!");
      return;
    }

    setImageError(""); // 에러 초기화

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        setImages([...newImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  //이미지 삭제
  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  //유효성 검사 통과하면 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { rating: "", text: "" };

    // 1. 별점 검사
    if (form.rating < 1) {
      newErrors.rating = "별을 1개 이상 눌러주세요.";
      setErrors(newErrors);
      starRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2. 내용 검사
    if (!form.text.trim()) {
      newErrors.text = "※ 내용을 입력해주세요.";
      setErrors(newErrors);
      textRef.current?.focus();
      return;
    }

    if (form.text.trim().length < 20) {
      newErrors.text = "※ 20자 이상의 내용을 입력해주세요.";
      setErrors(newErrors);
      textRef.current?.focus();
      return;
    }

    // 다 통과 시
    setErrors({ rating: "", text: "" });

    const reviewData = {
      memId: memId,
      revImgUrl: images,
      prdNo: product.prdNo,
      ordNo: ordNo,
      revRating: form.rating,
      revContent: form.text,
    };

    if (revNo) {
      await updateReview(revNo, reviewData);
      setOpenSuccessDialog(true);
    } else {
      await reviewRegistration(reviewData);
      await pointPlus(memId, 100);
      setOpenSuccessDialog(true);
    }
  };

  return (
    <>
      <Dialog
        open={openSuccessDialog}
        onClose={handleSuccessDialogClose}
        disableScrollLock
      >
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p
            style={{ textAlign: "center", fontSize: "20px", marginTop: "15px" }}
          >
            리뷰가 성공적으로 {revNo ? "수정되었어요" : "등록되었어요"}.
          </p>
          {!revNo && (
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                marginTop: "6px",
              }}
            >
              <span style={{ color: "#ff4a01" }}>100p</span>가 적립되었습니다.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => navigate("/not_band")}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            메인으로 가기
          </Button>
        </DialogActions>
      </Dialog>

      <form id="reviewform_group" onSubmit={handleSubmit}>
        <div className="reviewform_title">리뷰 작성</div>
        <div className="review_prd">
          <div className="review_prd_img">
            <img
              src={`http://localhost:8080/api/v1/not_band/images/product/${product.prdNo}.png`}
              alt={product.prdNo}
            />
          </div>
          <div className="review_prd_text">
            <p>
              {products.prdName} | {product.ordQty}개
            </p>
            {product.colorOpt && <p>옵션 : {product.colorOpt}</p>}
          </div>
        </div>

        <div className="review_img_group">
          <div className="review_stitle">이미지</div>
          <div className="review_img_upload">
            {images.length < 5 && (
              <label htmlFor="upload" className="review_upload_btn">
                <p className="count_review">
                  <p>({images.length}/5)</p>
                  <br />
                  <span>
                    *이미지를 <br /> 클릭하면 삭제돼요.
                  </span>
                </p>
                <img
                  src="/images/resell/img_upload.png"
                  alt="업로드 버튼 이미지"
                />
              </label>
            )}
            <input
              type="file"
              id="upload"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            {images.map((img, index) => (
              <div
                className="review_preview_img"
                key={index}
                onClick={() => removeImage(index)}
              >
                <img src={img} alt={`업로드 미리보기 ${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="review_textarea_group">
          <div className="review_textarea_flex">
            <div className="review_stitle">내용</div>
            <div ref={starRef}>
              {[1, 2, 3, 4, 5].map((star) => (
                <img
                  key={star}
                  src={
                    form.rating >= star
                      ? "/images/review/fullstars.png"
                      : "/images/review/stars.png"
                  }
                  alt={`${star}점`}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      rating:
                        prev.rating === star && star !== 1 ? star - 1 : star,
                    }));
                  }}
                  className="star-icon"
                />
              ))}
              <p className="review_red_text">{errors.rating}</p>
            </div>
          </div>

          <textarea
            className="review_textarea"
            maxLength={1000}
            placeholder="상품의 만족도에 대한 후기를 남겨주세요."
            value={form.text}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text: e.target.value }))
            }
            ref={textRef}
          />
          <div className="review_group_flex">
            <p className="review_red_text">{errors.text}</p>
            <div className="count_text">{form.text.length}/1000</div>
          </div>
        </div>

        <input
          type="submit"
          id="review_btn"
          value={revNo ? "수정하기" : "등록하기"}
        />
      </form>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import '../../css/main/index.css'
import '../../css/admin/adminProductUpload.css'
import { useCookies } from 'react-cookie';
import { productNew, productDetail, productChange } from '../../apis';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AdminProductUpload() {
  const imgRef = useRef();
  const prdNameRef = useRef();
  const modelRef = useRef();
  const prdPriceRef = useRef();
  const navigate = useNavigate();
  const prdNoRef = useRef();
  const brandNameRef = useRef();
  const prdFacturerRef = useRef();
  const prdOriginRef = useRef();
  const prdStockRef = useRef();
  const prdCategoryRef = useRef();
  const prdDiscountRef = useRef();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const prdNo3 = searchParams.get('prdNo3');
  
  const categoryOptions = [
    { label: "일렉 기타", value: "GEG" },
    { label: "베이스 기타", value: "GBG" },
    { label: "드럼", value: "DAD" },
    { label: "전자드럼", value: "DED" },
    { label: "디지털 피아노", value: "KDP" },
    { label: "신디사이저", value: "KSY" },
    { label: "전자 키보드", value: "KEK" },
    { label: "앰프", value: "MAMP" },
    { label: "이펙터", value: "MFX" },
    { label: "마이크", value: "MMIC" },
    { label: "액세서리 - 기타", value: "AGA" },
    { label: "액세서리 - 건반", value: "AKA" },
    { label: "액세서리 - 드럼", value: "ADA" },
    { label: "액세서리 - 음향장비", value: "AMA" },
  ];

  const [products, setProducts] = useState([])

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');

  // 상품 번호
  const [prdNo, setPrdNo] = useState('');
  const [prdNoError, setPrdNoError] = useState('');

  // 상품명
  const [prdName, setPrdName] = useState('');
  const [nameerror, setnameError] = useState('');

  // 할인
  const [prdDiscount, setPrdDiscount] = useState('');
  const [prdDiscountError, setPrdDiscountError] = useState('');

  // 모델명
  const [prdModel, setPrdModel] = useState('');
  const [modelError, setModelError] = useState('');

  // 가격
  const [prdPrice, setPrdPrice] = useState('');
  const [prdPriceError, setPrdPriceError] = useState('');

  // 브랜드
  const [brandName, setBrandName] = useState('');
  const [brandNameError, setBrandNameError] = useState('');

  // 제조사
  const [prdFacturer, setPrdFacturer] = useState('');
  const [prdFacturerError, setPrdFacturerError] = useState('');

  // 원산지
  const [prdOrigin, setPrdOrigin] = useState('');
  const [prdOriginError, setPrdOriginError] = useState('');

  // 상품 재고
  const [prdStock, setPrdStock] = useState('');
  const [prdStockError, setPrdStockError] = useState('');

  // 카테고리
  const [prdCategory, setPrdCategory] = useState('');
  const [prdCategory2, setPrdCategory2] = useState('');
  const [prdCategoryError, setPrdCategoryError] = useState('');

  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const [open, setOpen] = useState(false); //모달

  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);//내가만든쿸킥
  const [memId, setMemId] = useState(null);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleLoginDialogClose = () => setOpenLoginDialog(false);


  const handleClose = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band");
  }

  const handleClose2 = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band/login");
  }

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
  };


  useEffect(() => {
    const token = cookies.accessToken;  // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId==="admin") {
      setMemId(memId);
    } else {
      setOpen(true);
    }

    fetchProduct(prdNo3);
  }, [],);

  const fetchProduct = async () => {
    const prdData = await productDetail(prdNo3); // 상품 번호로 API 호출
  
    // 데이터 전체 저장 (선택)
    setProducts(prdData);

    if (prdData.prdDiscount) {
      setShowDiscountInput(true);
    }
    // 각 개별 항목에 직접 값 세팅
    setPrdName(prdData.prdName || "");
    setPrdModel(prdData.prdModel || "");
    setBrandName(prdData.prdBrand || "");
    setPrdOrigin(prdData.prdOrigin || "");
    setPrdFacturer(prdData.prdFacturer || "");
    setPrdStock(prdData.prdStock?.toString() || "");
    setPrdDiscount(prdData.prdDiscount?.toString() || "");
    setPrdCategory(prdData.prdCategory || "");
    setPrdPrice(prdData.prdPrice?.toString() || "");

    setPrdCategory2(prdData.prdCategory);
  
    setImages([
      prdData.prdUrl.startsWith("http")
        ? prdData.prdUrl
        : `http://localhost:8080/api/v1/not_band/images/product/${prdData.prdUrl.replace("/images/product/", "")}`,
    
      prdData.prdDetailUrl.startsWith("http")
        ? prdData.prdDetailUrl
        : `http://localhost:8080/api/v1/not_band/images/detail/${prdData.prdDetailUrl.replace("/images/detail/", "")}`
    ]);
  };


  // 지도 + 위치 관련 로직
  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  // 할인토굴
  const handleDiscountToggle = (e) => {
    setShowDiscountInput(e.target.checked);
  };


  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];

    if (newImages.length + files.length > 2) {
      setImageError('※ 이미지는 2장만 업로드 가능합니다!');
      return;
    }


    setImageError(''); // 에러 초기화

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        setImages([...newImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // 상품 번호
  const handlePrdNoChange = (e) => {
    const value = e.target.value;
    setPrdNo(value);

    if (value.trim() === '') {
      setPrdNoError('※ 상품번호를 입력해 주세요.');
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setPrdNoError('※ 상품번호는 영어와 숫자만 입력해 주세요.');
    } else {
      setPrdNoError('');
    }
  };

  // 상품명
  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > 40) {
      setnameError('※ 상품명은 40자 이하로 입력해 주세요.');
      return;
    }

    // 상품명이 한 글자 숫자일 경우
    if (/^\d$/.test(value)) {
      setnameError('※ 상품명을 한 글자 숫자로만 입력할 수 없어요.');
    } else if (value.trim() === '') {
      setnameError('※ 상품명을 입력해 주세요.');
    } else if (value.trim().length < 2) {
      setnameError('※ 상품명은 최소 2자 이상 입력해 주세요.');
    } else {
      setnameError('');
    }

    setPrdName(value);
  };

  // 할인
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    // 숫자만 허용
    if (/^\d*$/.test(value)) {
      setPrdDiscount(value);
    } else if (!/^\d+$/.test(prdDiscount) || Number(prdDiscount) > 100) {
      setPrdDiscountError('※ 0~100 사이 숫자로 입력해 주세요.');
      prdDiscountRef.current.focus();
      return;
    }
  };

  // 가격
  const formatNumber = (numStr) => {
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');

    if (!/^\d*$/.test(rawValue)) return;

    const num = parseInt(rawValue, 10);

    if (!rawValue) {
      setPrdPrice('');
      setPrdPriceError('');
      return;
    }

    if (num < 500) {
      setPrdPriceError('※ 최소 500원 이상 입력해주세요.');
    } else if (num > 100000000) {
      setPrdPriceError('※ 최대 100,000,000원까지 입력할 수 있어요.');
    } else {
      setPrdPriceError('');
    }
    setPrdPrice(formatNumber(rawValue));
  };

  // 모델명
  const handleModelChange = (e) => {
    const value = e.target.value;
    setPrdModel(value);

    if (value.length > 20) {
      setModelError('※ 모델명은 20자 이하로 입력해 주세요.');
      return;
    }

    if (value.trim() === '') {
      setModelError('※ 모델명을 입력해 주세요.');
    } else if (value.trim().length < 2) {
      setModelError('※ 모델명을 한 글자로만 입력할 수 없어요.');
    } else {
      setModelError('');
    }
  };

  // 브랜드 이름
  const handleBrandNameChange = (e) => {
    const value = e.target.value;
    setBrandName(value);

    if (value.length > 20) {
      setBrandNameError('※ 브랜드명은 20자 이하로 입력해 주세요.');
      return;
    }

    if (value.trim() === '') {
      setBrandNameError('※ 브랜드명을 입력해 주세요.');
    } else if (value.trim().length < 2) {
      setBrandNameError('※ 브랜드명을 한 글자로만 입력할 수 없어요.');
    } else if (value.length > 20) {
      setBrandNameError('※ 브랜드명은 20자 이내로 입력해 주세요.');
    } else {
      setBrandNameError('');
    }
  };

  // 제조사
  const handleFacturerChange = (e) => {
    const value = e.target.value;
    setPrdFacturer(value);

    if (value.trim() === '') {
      setPrdFacturerError('※ 제조사명을 입력해 주세요.');
    } else if (value.trim().length < 2) {
      setPrdFacturerError('※ 제조사명을 한 글자로만 입력할 수 없어요.');
    } else if (value.length > 20) {
      setPrdFacturerError('※ 제조사명은 20자 이내로 입력해 주세요.');
    } else {
      setPrdFacturerError('');
    }
  };

  // 원산지
  const handleOriginChange = (e) => {
    const value = e.target.value;
    setPrdOrigin(value);

    if (value.trim() === '') {
      setPrdOriginError('※ 원산지를 입력해 주세요.');
    } else if (/^\d$/.test(value.trim())) {
      setPrdOriginError('※ 원산지를 한 글자 숫자로만 입력할 수 없어요.');
    } else if (value.length > 10) {
      setPrdOriginError('※ 원산지는 10자 이내로 입력해 주세요.');
    } else {
      setPrdOriginError('');
    }
  };

  // 상품 재고
  const handleStockChange = (e) => {
    const value = e.target.value;
    setPrdStock(value);

    if (value.trim() === '') {
      setPrdStockError('※ 상품재고 수를 입력해 주세요.');
    } else if (!/^\d+$/.test(value.trim())) {
      setPrdStockError('※ 숫자만 입력해 주세요.');
    } else {
      setPrdStockError('');
    }
  };

  // 상품 카테고리
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setPrdCategory(value);

    if (value.trim() === '') {
      setPrdCategoryError('※ 상품 카테고리를 입력해 주세요.');
    } else if (value.length > 15) {
      setPrdCategoryError('※ 상품 카테고리는 15자 이내로 입력해 주세요.');
    } else {
      setPrdCategoryError('');
    }
  };


  // 등록하기 눌렀을 때
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setImageError('※ 상품 이미지를 2장 업로드해주세요.');
      imgRef.current.focus();
      return;
    }
    else {
      setImageError('');
    }

    // 상품명
    if (prdName.trim() === '') {
      setnameError('※ 상품명을 입력해 주세요.');
      prdNameRef.current.focus();
      return;
    }
    else {
      setnameError('');
    }

    // 가격
    if (String(prdPrice).trim() === '') {
      setPrdPriceError('※ 가격을 입력해 주세요.');
      priceRef.current.focus();
      return;
    } else {
      setPrdPriceError('');
    }

    // 모델명
    if (prdModel.trim() === '') {
      setModelError('※ 모델명을 입력해 주세요.');
      modelRef.current.focus();
      return;
    } else if (/^\d$/.test(prdModel.trim())) {
      setModelError('※ 모델명을 한 글자 숫자로만 입력할 수 없어요.');
      modelRef.current.focus();
      return;
    } else {
      setModelError('');
    }

    // 브랜드
    if (brandName.trim() === '') {
      setBrandNameError('※ 브랜드명을 입력해 주세요.');
      brandNameRef.current.focus();
      return;
    } else {
      setBrandNameError('');
    }

    // 상품재고
    if (prdStock.trim() === '') {
      setPrdStockError('※ 상품재고 수를 입력해 주세요.');
      prdStockRef.current.focus();
      return;
    } else if (!/^\d+$/.test(prdStock.trim())) {
      setPrdStockError('※ 숫자만 입력해 주세요.');
      prdStockRef.current.focus();
      return;
    } else {
      setPrdStockError('');
    }

    // 상품 카테고리
    if (prdCategory.trim() === '') {
      setPrdCategoryError('※ 상품 카테고리를 입력해 주세요.');
      prdCategoryRef.current.focus();
      return;
    } else {
      setPrdCategoryError('');
    }

    // 할인
    if (showDiscountInput) {
      if (prdDiscount.trim() === '') {
        setPrdDiscountError('※ 할인율을 입력해 주세요.');
        prdDiscountRef.current.focus();
        return;
      } else {
        setPrdDiscountError('');
      }
    }

    const productData = {
      prdName : prdName,
      prdModel : prdModel,
      prdBrand : brandName,
      prdOrigin : prdOrigin,
      prdFacturer : prdFacturer,
      prdStock: parseInt(prdStock.replace(",", "")),
      prdDiscount : prdDiscount,
      prdCategory : prdCategory,
      prdPrice: parseInt(prdPrice.replace(",", "")),
      prdUrl : images[0],
      prdDetailUrl : images[1],
      prdRental: 0,
    }

    const productData2 = {
      prdNo: prdNo3,
      prdName: prdName,
      prdModel: prdModel,
      prdBrand: brandName,
      prdOrigin: prdOrigin,
      prdFacturer: prdFacturer,
      prdStock: parseInt(prdStock.replace(",", "")),
      prdDiscount: parseInt(prdDiscount),
      prdCategory: prdCategory,
      prdPrice: parseInt(prdPrice.replace(",", "")),
      prdUrl: images.length > 0 && !images[0].startsWith("http://localhost") ? images[0] : null,
      prdDetailUrl: images.length > 1 && !images[1].startsWith("http://localhost") ? images[1] : null,
      prdRental: 0,
  };
    if(prdNo3){
      await productChange(prdNo3, productData2);
      setOpenSuccessDialog(true);
    } else {
      await productNew(productData);
      setOpenSuccessDialog(true);
    }
  };


  const da_prd_group = {
    backgroundColor: "#FCFEFD", width: '752px', marginLeft: '398px', marginTop: '-95px'
  }
  

  return (
    <>
      <h1>상품 관리</h1>
      <div id='resellform_group' className='da_prd_group' style={da_prd_group}>
        <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose} disableScrollLock>
          <DialogTitle>NOT_BAND</DialogTitle>
          <DialogContent>
          <p>{prdNo3 ? '상품 수정이 성공적으로 완료되었어요.' : '상품 등록이 성공적으로 완료되었어요.'}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate("/not_band/admin/product")} sx={{ color: '#FF4A01', fontSize: '19px', fontWeight: '500', width: '150px' }}>
              닫기
            </Button>
          </DialogActions>
        </Dialog>

        <div id='resellform_group' style={{ paddingTop: '26px', paddingBottom: '1px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '-22px' }}>
          {prdNo3 ? '상품수정' : '상품등록'}
        </h1>
          {/* 이미지 */}
          <div id='resellform_img_group'>
            <div className='resellform_group_title'>이미지<span style={{ color: '#ff4a01' }}>*</span><p style={{fontSize:"18px"}}><span style={{ color: '#ff4a01' }}>※</span> 첫 번째 사진은 <span style={{ color: '#ff4a01' }}>대표 이미지</span>로 두 번째 사진부터는 <span style={{ color: '#ff4a01' }}>상품 상세 이미지</span>로 저장됩니다.<span style={{ color: '#ff4a01' }}>※</span></p></div>
            <div className="resellform_img_upload">
              {/* 업로드 버튼 */}
              {images.length < 2 && (
                <label htmlFor="upload" className="upload_btn">
                  <p className='count_text2'>
                    <p>({images.length}/2)</p><br />
                    <span>*이미지를 <br /> 클릭하면 삭제돼요.</span>
                  </p>
                  <img src="/images/resell/img_upload.png" alt="업로드 버튼 이미지" />
                </label>
              )}

              {/* 이미지 미리보기 */}
              {images.map((img, index) => (
                <div className="preview_img" key={index} onClick={() => removeImage(index)}>
                  <img src={img} alt={`업로드 미리보기 ${index}`} />
                </div>
              ))}

              {/* input hidden 숨김처리 */}
              <input id="upload" type="file" className='resellform_img_input_none' accept="image/*" multiple
                ref={imgRef} onChange={handleImageChange}
              />
            </div>
            {imageError && <p className="red_text">{imageError}</p>}
          </div>

          {/* 상품명 */}
          <div id='resellform_prdName_group'>
            <div className='resellform_group_title'>상품명<span style={{ color: '#ff4a01' }}>*</span></div>
            <input type="text" ref={prdNameRef} placeholder='상품명을 입력해 주세요.' value={prdName} onChange={handleChange} required />
            <div className='resellform_group_flex'>
              {nameerror && <p className='red_text'>{nameerror}</p>}
              <p className='count_text'>({prdName.length}/40)</p>
            </div>
          </div>

          {/* 할인 */}
          <div id='resellform_prdPrice_group' style={{ marginBottom: '40px' }}>
            <div className='resellform_group_title'>할인</div>
            <label className='prdup_checkbox'>
              <input type="checkbox" onChange={handleDiscountToggle} checked={showDiscountInput} />
              <p className='prdup_sale_text'>할인</p>
            </label>
            {showDiscountInput && (
              <div className='rsf_price'>
                <input type="text" className='resellform_s_input' value={prdDiscount} ref={prdDiscountRef} maxLength={11} onChange={handleDiscountChange} placeholder="퍼센테이즈를 입력해 주세요." />
                <span className="price_unit">%</span>
                {prdDiscountError && <p className="red_text priceerror">{prdDiscountError}</p>}
              </div>
            )}
          </div>

          {/* 가격 */}
          <div id='resellform_prdPrice_group' style={{ marginBottom: '40px' }}>
            <div className='resellform_group_title'>가격<span style={{ color: '#ff4a01' }}>*</span></div>
            <div className='rsf_price'>
              <input type="text" className='resellform_s_input' value={prdPrice} ref={prdPriceRef} maxLength={11} required
                onChange={handlePriceChange} placeholder="가격을 입력해 주세요."
              />
              <span className="price_unit">원</span>
              {prdPriceError && <p className="red_text priceerror">{prdPriceError}</p>}
            </div>
          </div>

          {/* 모델명 */}
          <div id='resellform_prdName_group'>
            <div className='resellform_group_title'>모델명<span style={{ color: '#ff4a01' }}>*</span></div>
            <input type="text" ㅡ ref={modelRef} placeholder='모델명을 입력해 주세요.' value={prdModel} onChange={handleModelChange} required />
            <div className='resellform_group_flex'>
              {modelError && <p className='red_text'>{modelError}</p>}
              <p className='count_text'>({prdModel.length}/20)</p>
            </div>
          </div>

          {/* 브랜드 */}
          <div id='resellform_prdName_group'>
            <div className='resellform_group_title'>브랜드<span style={{ color: '#ff4a01' }}>*</span></div>
            <input type="text" ref={brandNameRef} placeholder="브랜드명을 입력해 주세요." value={brandName} onChange={handleBrandNameChange} required />
            <div className='resellform_group_flex'>
              {brandNameError && <p className='red_text'>{brandNameError}</p>}
              <p className='count_text'>({brandName.length}/20)</p>
            </div>
          </div>

          {/* 제조사 */}
          <div id='resellform_prdName_group'>
            <div className='resellform_group_title'>제조사</div>
            <input type="text" ref={prdFacturerRef} placeholder='제조사명을 입력해 주세요.' value={prdFacturer} onChange={handleFacturerChange} required />
            <div className='resellform_group_flex'>
              {prdFacturerError && <p className='red_text'>{prdFacturerError}</p>}
              <p className='count_text'>({prdFacturer.length}/20)</p>
            </div>
          </div>

          {/* 원산지 */}
          <div id='resellform_prdName_group'>
            <div className='resellform_group_title'>원산지</div>
            <input type="text" ref={prdOriginRef} placeholder='원산지를 입력해 주세요.' value={prdOrigin} onChange={handleOriginChange} required />
            <div className='resellform_group_flex'>
              {prdOriginError && <p className='red_text'>{prdOriginError}</p>}
              <p className='count_text'>({prdOrigin.length}/10)</p>
            </div>
          </div>

          {/* 상품재고 */}
          <div id='resellform_prdPrice_group' style={{ marginBottom: '40px' }}>
            <div className='resellform_group_title'>상품재고<span style={{ color: '#ff4a01' }}>*</span></div>
            <div className='rsf_price'>
              <input type="text" className='resellform_s_input' value={prdStock} ref={prdStockRef} maxLength={11} required onChange={handleStockChange} placeholder="상품재고 수를 입력해 주세요." />
              <span className="price_unit">개</span>
              {prdStockError && <p className="red_text priceerror">{prdStockError}</p>}
            </div>
          </div>

          {/* 카테고리 */}
          <div id="resellform_prdName_group">
            <div className="resellform_group_title">
              카테고리<span style={{ color: "#ff4a01" }}>*</span>
            </div>
            <p style={{ fontSize: "18px", marginRight:"680px", width:"400px", textAlign:"left", marginTop:"-12px", marginBottom:"12px"}}>
                <span style={{ color: '#ff4a01' }}>※</span> 카테고리는 
                <span style={{ color: '#ff4a01' }}>수정 불가합니다.</span>
                <span style={{ color: '#ff4a01' }}>※</span>
              </p>
            <div className="product_new_category">
              <div>
            {categoryOptions.slice(0, 5).map(({ label, value }) => (
              <div className="radio-item" key={value}>
                <input
                  type="radio"
                  name="resellform_category"
                  id={value}
                  value={value}
                  onChange={handleCategoryChange}
                  checked={prdCategory === value}
                />
                <label htmlFor={value}>
                  <span className="radio-custom"></span>
                  <span className="radio-custom2"></span>
                  <p>
                    <span className="maincategory">{label}</span>
                  </p>
                </label>
              </div>
            ))}
            </div>
            <div>
            {categoryOptions.slice(5, 10).map(({ label, value }) => (
                <div className="radio-item" key={value}>
                  <input
                    type="radio"
                    name="resellform_category"
                    id={value}
                    value={value}
                    onChange={handleCategoryChange}
                    checked={prdCategory === value}
                  />
                  <label htmlFor={value}>
                    <span className="radio-custom"></span>
                    <span className="radio-custom2"></span>
                    <p>
                      <span className="maincategory">{label}</span>
                    </p>
                  </label>
                </div>
              ))}
              </div>
              <div>
              {categoryOptions.slice(10, 14).map(({ label, value }) => (
                  <div className="radio-item" key={value}>
                    <input
                      type="radio"
                      name="resellform_category"
                      id={value}
                      value={value}
                      onChange={handleCategoryChange}
                      checked={prdCategory === value}
                    />
                    <label htmlFor={value}>
                      <span className="radio-custom"></span>
                      <span className="radio-custom2"></span>
                      <p>
                        <span className="maincategory">{label}</span>
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {prdCategoryError && <p className="red_text">{prdCategoryError}</p>}
          <input
            type="submit"
            id="resellform_btn"
            value={prdNo3 ? "수정하기" : "등록하기"}
            onClick={handleSubmit}
            style={{ marginBottom: "50px" }}
          />
        </div>
      </div>
    </>
  )
}

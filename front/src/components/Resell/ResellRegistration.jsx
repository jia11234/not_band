import React, { useState, useRef, useEffect } from 'react';
import '../../css/resell/resellRegistration.css'
import '../../css/main/index.css'
import { useCookies } from 'react-cookie';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { addToResell } from '../../apis';

export default function ResellRegistration() {
    const imgRef = useRef();
    const prdNameRef = useRef();
    const descriptionRef = useRef();
    const tagRef = useRef();
    const priceRef = useRef();
    const categoryRef = useRef();
    const deliveryRef = useRef();
    const conditionRef = useRef();
    const directRef = useRef();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');

    const [prdName, setPrdName] = useState('');
    const [nameerror, setnameError] = useState('');

    const [text, setText] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryError, setCategoryError] = useState('');

    const [tagText, setTagText] = useState('');
    const [tagError, setTagError] = useState('');

    const [price, setPrice] = useState('');
    const [priceerror, setPriceError] = useState('');

    const [selectedDelivery, setSelectedDelivery] = useState('');
    const [shippingPrice, setShippingPrice] = useState('');
    const [shippingPriceError, setShippingPriceError] = useState('');
    const [deliveryError, setDeliveryError] = useState('');

    const [localDeal, setLocalDeal] = useState('');
    const [localArea, setLocalArea] = useState('');
    const [localDealError, setLocalDealError] = useState('');
    const [localAreaError, setLocalAreaError] = useState('');

    const [conditionError, setConditionError] = useState('');

    const [mapVisible, setMapVisible] = useState(false);
    const mapRef = useRef(null);
    
    const [showAddress, setShowAddress] = useState(false);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [address, setAddress] = useState("");

    const [open, setOpen] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    const [memId, setMemId] = useState(null);

    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    const handleLoginDialogClose = () => setOpenLoginDialog(false);
    const handleSuccessDialogClose = () => setOpenSuccessDialog(false);

    const handleClose = () => {
        setOpen(false); 
        navigate("/not_band");
    }

    const handleClose2 = () => {
        setOpen(false);
        navigate("/not_band/login");
    }

    useEffect(() => {
    const token = cookies.accessToken;
    const memId = getMemIdFromToken(token);
    if (memId) {
        setMemId(memId);
    } else{
        setOpen(true);
    }
    
    }, [],);
    
    useEffect(() => {
    if (mapVisible && window.kakao && window.kakao.maps && mapRef.current) {
        const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(location.lat || 37.5665, location.lon || 126.9780),
        level: 3,
        });

        new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(location.lat || 37.5665, location.lon || 126.9780),
        });
    }
    }, [mapVisible, location]);

    const getMemIdFromToken = (token) => {
        if (!token) return null;
    
        console.log("Decoded Token:", token);
    
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
        const decoded = JSON.parse(window.atob(base64)); 
        console.log("Decoded Payload:", decoded); 
    
        return decoded.sub;
    };

    //내위치 찾기 및 지도 출력
    const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
        alert("위치 정보를 지원하지 않는 브라우저예요.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        const geocoder = new window.kakao.maps.services.Geocoder();
        const coord = new window.kakao.maps.LatLng(lat, lon);

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
            const detail = result[0].address.address_name;
            setAddress(detail);
            setLocalArea(detail);
            setShowAddress(true);
            setMapVisible(true);
            } else {
            alert("주소를 찾을 수 없어요.");
            }
        });
        },
        (err) => {
        console.error("위치 접근 에러:", err);
        alert("위치 접근을 허용해주세요.");
        }
    );
    };

    //이미지 등록
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];

        if (newImages.length + files.length > 6) {
            setImageError('※ 이미지는 최대 5장까지 업로드 가능합니다!');
            return;
        }

        setImageError(''); 

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
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    //상품 명 조건
    const handleChange = (e) => {
        const value = e.target.value;

        if (value === '') {
            setnameError('※ 상품명을 입력해 주세요.');
        } else if (/^\d$/.test(value)) {
            setnameError('※ 상품명을 한 글자 숫자로만 입력할 수 없어요.');
        } else {
            setnameError('');
        }

        if (value.length <= 40) {
            setPrdName(value);
        }
    };

    useEffect(() => {
        if (address) {
          setLocalArea(address);
        }
      }, [address]);

    //상품 설명 조건
    const handleDescriptionChange = (e) => {
        const value = e.target.value;

        if (value.length > 1000) return;
        setText(value);

        if (value.trim().length < 10) {
            setDescriptionError('※ 상품 설명을 10자 이상 입력해 주세요.');
        } else if (value.trim().length > 999) {
            setDescriptionError('※ 최대 1000자 입력만 가능합니다.');
        }
        else {
            setDescriptionError('');
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    //태그 조건
    const handleTagChange = (e) => {
        const value = e.target.value;
        const tags = value.trim().split(/\s+/);

        if (tags.length > 2) {
            setTagError('※ 태그는 최대 2개까지 입력할 수 있어요.');
        } else if (tags.some(tag => tag.length > 9)) {
            setTagError('※ 각 태그는 최대 9자까지 입력할 수 있어요.');
        } else {
            setTagError('');
        }

        setTagText(value);
    };

    //숫자에 콤마 넣기
    const formatNumber = (numStr) => {
        const num = parseInt(numStr.replace(/,/g, ''), 10);
        if (isNaN(num)) return '';
        return num.toLocaleString();
    };

    //입력한 가격에 따른 메세지 출력
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');

        if (!/^\d*$/.test(rawValue)) return;

        const num = parseInt(rawValue, 10);

        if (!rawValue) {
            setPrice('');
            setPriceError('');
            return;
        }

        if (num < 500) {
            setPriceError('※ 최소 500원 이상 입력해주세요.');
        } else if (num > 100000000) {
            setPriceError('※ 최대 100,000,000원까지 입력할 수 있어요.');
        } else {
            setPriceError('');
        }
        setPrice(formatNumber(rawValue));
    };

    //무료배송이 아닐경우 해당조건이 아니면 경고문 출력
    const handleShippingPriceChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');

        if (!/^\d*$/.test(rawValue)) return;

        const num = parseInt(rawValue, 10);

        if (!rawValue) {
            setShippingPrice('');
            setShippingPriceError('');
            return;
        }

        if (num < 0) {
            setShippingPriceError('※ 배송비는 0원 이상이어야 합니다.');
        } else if (num > 1000000) {
            setShippingPriceError('※ 배송비는 1,000,000원 이하여야 합니다.');
        } else {
            setShippingPriceError('');
        }

        setShippingPrice(formatNumber(rawValue));
    };

    //유효성 검사 통과하면 등록
    const handleSubmit =  async(e) => {
        e.preventDefault();

        if (images.length === 0) {
            setImageError('※ 상품 이미지를 최소 1장 업로드해주세요.');
            imgRef.current.focus();
            return;
        }
        else {
            setImageError('');
        }

        if (prdName.trim() === '') {
            setnameError('※ 상품명을 입력해 주세요.');
            prdNameRef.current.focus();
            return;
        }
        else {
            setnameError('');
        }

        if (text.trim() === '') {
            setDescriptionError('※ 상품 설명을 입력해 주세요.');
            descriptionRef.current.focus();
            return;
        }
        else {
            setDescriptionError('');
        }

        if (!selectedCategory) {
            setCategoryError('※ 카테고리를 선택해 주세요.');
            categoryRef.current.focus();
            return;
        } else {
            setCategoryError('');
        }

        if (tagText.trim() === '') {
            setTagError('※ 태그를 입력해주세요.');
            tagRef.current.focus();
            return;
        }
        else {
            setTagError('');
        }

        if (price.trim() === '') {
            setPriceError('※ 가격을 입력해 주세요.');
            priceRef.current.focus();
            return;
        } else {
            setPriceError('');
        }

        if (!selectedDelivery) {
            setDeliveryError('※ 배송비 옵션을 선택해주세요.');
            deliveryRef.current.scrollIntoView({ behavior: "smooth" });
            return;
        } else {
            setDeliveryError('');
        }

        if (selectedDelivery === '배송비 별도') {
            if (!shippingPrice.trim()) {
                setShippingPriceError('※ 배송비를 입력해주세요.');
                return;
            } else if (isNaN(Number(shippingPrice.replace(/,/g, '')))) {
                setShippingPriceError('※ 숫자만 입력해주세요.');
                return;
            } else {
                setShippingPriceError('');
            }
        }

        if (!localDeal) {
            setLocalDealError('※ 직거래 가능 여부를 선택해주세요.');
            return;
        } else {
            setLocalDealError('');
        }

        if (localDeal === '가능') {
            if (!localArea) {
                setLocalAreaError('※ 거래 지역을 선택해주세요.');
                directRef.current.focus();
                return;
            } else {
                setLocalAreaError('');
            }
        }

        const selectedCondition = document.querySelector('input[name="resellform_condition"]:checked');
        if (!selectedCondition) {
            setConditionError('※ 상품 상태를 선택해주세요.');
            conditionRef.current.scrollIntoView({ behavior: "smooth" });
            return;
        } else {
            setConditionError('');
        }

            const productData = {
                memId: memId,
                resImgUrl: images,
                resPrd: prdName,
                resDetail: text,
                resCategory: selectedCategory,//
                resTag: tagText.split(',').map(tag => tag.trim()), 
                resPrice: price.replace(/,/g, ''),
                resDelivery: selectedDelivery,
                resDelPrice: selectedDelivery === '배송비 별도' ? shippingPrice.replace(/,/g, '') : '0',
                resAddress: localDeal === '가능' ? localArea : '',
                resCondition: document.querySelector('input[name="resellform_condition"]:checked')?.value
            }  
            await addToResell(productData);
            console.log("보낼 데이터:", productData);
            setOpenSuccessDialog(true);
        
        console.log("보낼 데이터:", productData);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} disableScrollLock>
                <DialogTitle>NOT_BAND</DialogTitle>
                <DialogContent>
                <p>상품 등록은 로그인 후에만 사용할 수 있어여</p>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#0371B9', fontSize:'19px', fontWeight:'500', width:'150px'}}>
                    닫기
                </Button>
                <Button onClick={handleClose2} sx={{ color: '#FF4A01', fontSize:'19px', fontWeight:'500', width:'150px' }}>
                    로그인하기
                </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose} disableScrollLock>
            <DialogTitle>NOT_BAND</DialogTitle>
            <DialogContent>
                <p>중고 상품이 성공적으로 등록되었어요.</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSuccessDialogClose} sx={{ color: '#0371B9', fontSize:'19px', fontWeight:'500', width:'150px'}}>
                닫기
                </Button>
                <Button onClick={() => navigate("/not_band")} sx={{ color: '#FF4A01', fontSize:'19px', fontWeight:'500', width:'150px' }}>
                메인으로 가기
                </Button>
            </DialogActions>
            </Dialog>
            <div id='resellform_group'>
                <h1>상품등록</h1>
                <div id='resellform_img_group'>
                    <div className='resellform_group_title'>이미지</div>
                    <div className="resellform_img_upload">
                        {images.length < 5 && (
                            <label htmlFor="upload" className="upload_btn">
                                <p className='count_text2'><p>({images.length}/5)</p><br/><span>*이미지를 <br/> 클릭하면 삭제돼요.</span></p>
                                <img src="/images/resell/img_upload.png" alt="업로드 버튼 이미지" />
                            </label>
                        )}

                        {images.map((img, index) => (
                            <div className="preview_img" key={index} onClick={() => removeImage(index)}>
                                <img src={img} alt={`업로드 미리보기 ${index}`} />
                            </div>
                        ))}

                        <input
                            id="upload"
                            type="file"
                            className='resellform_img_input_none'
                            accept="image/*"
                            multiple
                            ref={imgRef}
                            onChange={handleImageChange}
                        />
                    </div>
                    {imageError && <p className="red_text">{imageError}</p>}
                </div>

                <div id='resellform_prdName_group'>
                    <div className='resellform_group_title'>상품명</div>
                    <input type="text" ref={prdNameRef} placeholder='제목을 입력해 주세요.' value={prdName} onChange={handleChange} required />
                    <div className='resellform_group_flex'>
                        {nameerror && <p className='red_text'>{nameerror}</p>}
                        <p className='count_text'>({prdName.length}/40)</p>
                    </div>
                </div>

                <div id='resellform_prdText_group'>
                    <div className='resellform_group_title'>설명</div>
                    <textarea
                        value={text}
                        ref={descriptionRef}
                        onChange={handleDescriptionChange}
                        maxLength={1000}
                        placeholder={`브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.\n개인정보 입력은 노출 위험이 있으니 자제해 주세요.`}
                    />
                    <div className='resellform_group_flex'>
                        {descriptionError && <p className="red_text">{descriptionError}</p>}
                        <p className='count_text'>({text.length}/1000)</p>
                    </div>
                </div>

                <div id='resellform_prdCategory_group'>
                    <div className='resellform_group_title'>카테고리</div>
                    {categoryError && <p className="red_text categoryerror">{categoryError}</p>}
                    <div className="radio-item">
                            <input type="radio" name="resellform_category" id="기타" value="기타" ref={categoryRef} onChange={handleCategoryChange} />
                            <label htmlFor="기타">
                                    <span className="radio-custom"></span>
                                    <span className="radio-custom2"></span>
                                    <p><span class="maincategory">기타</span>
                                    <span class="Scategory">일렉기타, 베이스기타</span></p>
                            </label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" name="resellform_category" id="드럼" value="드럼" onChange={handleCategoryChange} />
                        <label htmlFor="드럼">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                            <span className="maincategory">드럼</span>
                            <span className="Scategory">드럼, 전자드럼</span>
                            </p>
                        </label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" name="resellform_category" id="건반" value="건반" onChange={handleCategoryChange} />
                        <label htmlFor="건반">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                            <span className="maincategory">건반</span>
                            <span className="Scategory">전자피아노, 신디사이저, 전자키보드</span>
                            </p>
                        </label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" name="resellform_category" id="음향장비" value="음향장비" onChange={handleCategoryChange} />
                        <label htmlFor="음향장비">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                            <span className="maincategory">음향장비</span>
                            <span className="Scategory">이어폰, 헤드폰, 스피커 등 소리 관련 기기</span>
                            </p>
                        </label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" name="resellform_category" id="액세서리" value="액세서리" onChange={handleCategoryChange} />
                        <label htmlFor="액세서리">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                            <span className="maincategory">액세서리</span>
                            <span className="Scategory">이어팁, 케이블, 파우치 같은 부속품</span>
                            </p>
                        </label>
                    </div>
                </div>

                <div id='resellform_prdTag_group'>
                    <div className='resellform_group_title'>태그</div>
                    <input
                        type="text"
                        value={tagText}
                        ref={tagRef}
                        onChange={handleTagChange}
                        placeholder="태그를 입력해 주세요 (최대 2개)"
                        required
                    />
                    {tagError && <p className="red_text">{tagError}</p>}
                    <p>&#8226; 태그는 띄어쓰기로 구분되며 최대 9자까지 입력할 수 있어요.</p>
                    <p>&#8226; 내 상품을 다양한 태그로 표현해 보세요.</p>
                    <p>&#8226; 사람들이 내 상품을 더 잘 찾을 수 있어요.</p>
                    <p>&#8226; 상품과 관련 없는 태그를 입력할 경우, 판매에 제재를 받을 수 있어요.</p>
                </div>

                <div id='resellform_prdPrice_group'>
                    <div className='resellform_group_title'>가격</div>
                    <div className='rsf_price'>
                        <input
                            type="text"
                            className='resellform_s_input'
                            value={price}
                            ref={priceRef}
                            maxLength={11}
                            required
                            onChange={handlePriceChange}
                            placeholder="가격을 입력해 주세요."
                        />
                        <span className="price_unit">원</span>
                        {priceerror && <p className="red_text priceerror">{priceerror}</p>}
                    </div>
                </div>

                <div id='resellform_delivery_group'>
                    <div className='resellform_group_title'>배송비</div>
                    {deliveryError && <p className="red_text categoryerror">{deliveryError}</p>}
                    <div className='resellform_group_flex'>
                        <div className="radio-item">
                            <input
                                type="radio"
                                name="resellform_delivery"
                                value="무료배송"
                                checked={selectedDelivery === '무료배송'}
                                onChange={(e) => setSelectedDelivery(e.target.value)}
                                ref={deliveryRef}
                                id="무료배송"
                            />
                            <label htmlFor="무료배송">
                                <span className="radio-custom"></span>
                                <span className="radio-custom2"></span>
                                <p>
                                <span className="maincategory">무료배송&nbsp;</span>
                                </p>
                            </label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                name="resellform_delivery"
                                value="배송비 별도"
                                checked={selectedDelivery === '배송비 별도'}
                                onChange={(e) => setSelectedDelivery(e.target.value)}
                                ref={deliveryRef}
                                id="배송비 별도"
                            />
                            <label htmlFor="배송비 별도">
                                <span className="radio-custom"></span>
                                <span className="radio-custom2"></span>
                                <p>
                                <span className="maincategory">배송비 별도</span>
                                </p>
                            </label>
                        </div>
                    </div>

                    {selectedDelivery === '배송비 별도' && (
                        <div className="shipping_price_box">
                            <input
                                type="text"
                                className='resellform_s_input'
                                placeholder="배송비를 입력해주세요"
                                value={shippingPrice}
                                maxLength={9}
                                onChange={handleShippingPriceChange}
                            />
                            <span className="price_unit">원</span>
                            {shippingPriceError && <p className="red_text priceerror">{shippingPriceError}</p>}
                        </div>
                    )}

                </div>

                <div id='resellform_localdeal_group'>
                    <div className='resellform_group_title'>직거래</div>
                    <div className='resellform_group_flex'>
                        <div className="radio-item">
                            <input
                                type="radio"
                                name="resellform_localdeal"
                                value="가능"
                                checked={localDeal === '가능'}
                                onChange={(e) => {
                                    setLocalDeal(e.target.value);
                                    setLocalDealError('');
                                }}
                                id="가능"
                            />
                            <label htmlFor="가능">
                                <span className="radio-custom"></span>
                                <span className="radio-custom2"></span>
                                <p>
                                <span className="maincategory">가능&nbsp;</span>
                                </p>
                            </label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"    
                                name="resellform_localdeal"
                                value="불가"
                                checked={localDeal === '불가'}
                                onChange={(e) => {
                                    setLocalDeal(e.target.value);
                                    setLocalDealError('');
                                    setLocalArea('');
                                    setLocalAreaError('');
                                }}
                                id="불가"
                            />
                            <label htmlFor="불가">
                                <span className="radio-custom"></span>
                                <span className="radio-custom2"></span>
                                <p>
                                <span className="maincategory">불가</span>
                                </p>
                            </label>
                        </div>
                    </div>
                    {localDealError && <p className="red_text">{localDealError}</p>}

                    {localDeal === '가능' && (
                    <div className="local_area_select_box">
                        {!showAddress ? (
                        <>
                            <div>
                            <input type="text" className="resellform_s_input flex-1" value={localArea}
                                onChange={(e) => { setLocalArea(e.target.value); setLocalAreaError(''); setMapVisible(true); }}
                                placeholder="지역을 입력해주세요." id="map" onClick={() => setMapVisible(true)} ref={directRef}
                            />
                            <button type="button" className="price_unit2" onClick={handleGetMyLocation}>내위치</button>
                            </div>
                            {localAreaError && <p className="red_text priceerror">{localAreaError}</p>}
                        </>
                        ) : (
                        <>
                            <p><strong>{address}</strong></p>
                            <button className="price_unit2" onClick={() => { setShowAddress(false); setLocalArea(''); }}>주소 수정</button>
                        </>
                        )}
                    </div>
                    )}
                    {mapVisible && (
                        <div ref={mapRef} style={{ width: '100%', height: '400px', marginTop: '20px' }} />
                        )}

                </div>

                <div id='resellform_condition_group'>
                    <div className='resellform_group_title'>상품상태</div>
                    {conditionError && <p className="red_text categoryerror">{conditionError}</p>}
                    <div className="radio-item">
                        <input type="radio" id="condition-new" name="resellform_condition" value="새상품" ref={conditionRef} onChange={() => setConditionError('')} />
                        <label htmlFor="condition-new">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                                <span className="maincategory">새상품 (미사용)</span>
                                <span className="Scategory">사용하지 않은 새 상품</span>
                            </p>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input type="radio" id="condition-none" name="resellform_condition" value="사용감 없음" onChange={() => setConditionError('')} />
                        <label htmlFor="condition-none">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                                <span className="maincategory">사용감 없음</span>
                                <span className="Scategory">사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음</span>
                            </p>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input type="radio" id="condition-light" name="resellform_condition" value="사용감 적음" onChange={() => setConditionError('')} />
                        <label htmlFor="condition-light">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                                <span className="maincategory">사용감 적음</span>
                                <span className="Scategory">눈에 띄는 흔적이나 얼룩이 약간 있음</span>
                            </p>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input type="radio" id="condition-heavy" name="resellform_condition" value="사용감 많음" onChange={() => setConditionError('')} />
                        <label htmlFor="condition-heavy">
                        <span className="radio-custom"></span>
                        <span className="radio-custom2"></span>
                            <p>
                                <span className="maincategory">사용감 많음</span>
                                <span className="Scategory">눈에 띄는 흔적이나 얼룩이 많이 있음</span>
                            </p>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input type="radio" id="condition-broken" name="resellform_condition" value="고장/파손 상품" onChange={() => setConditionError('')} />
                        <label htmlFor="condition-broken">
                            <span className="radio-custom"></span>
                            <span className="radio-custom2"></span>
                            <p>
                                <span className="maincategory">고장/파손 상품</span>
                                <span className="Scategory">기능 이상이나 외관 손상 등으로 수리/수선 필요</span>
                            </p>
                        </label>
                    </div>
                </div>
                <input type="submit" id='resellform_btn' value={"등록하기"} onClick={handleSubmit} />
            </div>
        </div>
    )
}

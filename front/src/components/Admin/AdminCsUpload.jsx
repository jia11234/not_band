import React, { useState, useRef, useEffect } from 'react';
import '../../css/main/index.css';
import '../../css/Cs/CsUpload.css';
import { csRegister } from "../../apis";
import { useCookies } from 'react-cookie';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function AdminCsUpload() {
    const prdNameRef = useRef();
    const contentRef = useRef();
    const navigate = useNavigate();

    const handleClose3 = () => {
        setOpen2(false);  // 기존 상태 변경
        navigate('/not_band/admin/cs');  // 페이지 리디렉션
      };

    // 제목
    const [prdName, setPrdName] = useState('');
    const [nameerror, setnameError] = useState('');

    // 내용
    const [content, setContent] = useState('');
    const [contentError, setContentError] = useState('');

    const [isFixed, setIsFixed] = useState(false);

    const [cookies] = useCookies(['accessToken']);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    const handleDiscountToggle = (e) => {
        setIsFixed(e.target.checked);
    };
    

    useEffect(() => {
        const token = cookies.accessToken;
        const memId = getMemIdFromToken(token);
        if (!memId) setOpen(true);
    }, []);

    const getMemIdFromToken = (token) => {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        return decoded.sub;
    };

    const handleClose = () => navigate("/not_band");
    const handleClose2 = () => navigate("/not_band/login");

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length > 40) {
            setnameError('※ 제목은 40자 이하로 입력해 주세요.');
        } else if (/^\d$/.test(value)) {
            setnameError('※ 제목을 한 글자 숫자로만 입력할 수 없어요.');
        } else if (value.trim() === '') {
            setnameError('※ 제목을 입력해 주세요.');
        } else if (value.trim().length < 2) {
            setnameError('※ 제목은 최소 2자 이상 입력해 주세요.');
        } else {
            setnameError('');
        }
        setPrdName(value);
    };

    const handleContentChange = (e) => {
        const value = e.target.value;
        if (value.trim().length < 20) {
            setContentError('※ 내용은 최소 20자 이상 입력해 주세요.');
        } else {
            setContentError('');
        }
        setContent(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (prdName.trim() === '') {
            setnameError('※ 제목을 입력해 주세요.');
            prdNameRef.current.focus();
            return;
        }
    
        if (content.trim() === '') {
            setContentError('※ 내용을 입력해 주세요.');
            contentRef.current.focus();
            return;
        }
    
        if (content.trim().length < 20) {
            setContentError('※ 내용은 최소 20자 이상 입력해 주세요.');
            return;
        }
    
        // 유효성 통과 시
        setnameError('');
        setContentError('');
    
        try {
            const requestBody = {
                csTitle: prdName,
                csContent: content,
                csPin: isFixed, // 체크박스 값 (true/false)
            };
    
            const result = await csRegister(requestBody);
            setOpen2(true);
            console.log('등록된 공지:', result);
        } catch (error) {
            console.error('공지 등록 에러:', error);
        }
    };


    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>NOT_BAND</DialogTitle>
                <DialogContent>
                    <p>공지 등록은 로그인 후에만 사용할 수 있어요.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>닫기</Button>
                    <Button onClick={handleClose2}>로그인하기</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open2} onClose={() => setOpen2(false)}>
                <DialogTitle>NOT_BAND</DialogTitle>
                <DialogContent>
                    <p style={{width:"200px", textAlign:"center"}}>공지 등록 완료</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose3}>닫기</Button>
                </DialogActions>
            </Dialog>

            <h1>고객센터</h1>
            <div className='AdminCsUpload_group'>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '30px' }}>공지등록</h1>

                <form onSubmit={handleSubmit}>
                    {/* 제목 */}
                    <div id='AdminCsUpload_prdName_group'>
                        <div className='AdminCsUpload_group_title'>제목<span style={{ color: '#FF4A01' }}>*</span></div>
                        <input type="text" ref={prdNameRef} placeholder='제목을 입력해 주세요.' value={prdName} onChange={handleChange}/>
                        <div className='AdminCsUpload_group_flex'>
                            {nameerror && <p className='red_text'>{nameerror}</p>}
                            <p className='count_text'>({prdName.length}/40)</p>
                        </div>
                    </div>

                    {/* 내용 */}
                    <div id='AdminCsUpload_content_group' style={{ marginTop: '30px' }}>
                        <div className='AdminCsUpload_group_title'>내용<span style={{ color: '#FF4A01' }}>*</span></div>
                        <textarea ref={contentRef} placeholder='내용을 입력해 주세요.' value={content} onChange={handleContentChange} rows={10} maxLength={1000}/>
                        <div className='AdminCsUpload_group_flex'>
                            {contentError && <p className='red_text'>{contentError}</p>}
                            <p className='count_text'>({content.length}/1000)</p>
                        </div>
                    </div>

                    <div id='resellform_prdPrice_group' style={{ marginBottom: '40px' }}>
                        <div className='resellform_group_title'>고정</div>
                        <label className='prdup_checkbox'>
                        <input type="checkbox" onChange={handleDiscountToggle} />
                        <p className='prdup_sale_text'>고정</p>
                        </label>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <input type="submit" id='AdminCsUpload_btn' value="등록하기" />
                    </div>
                </form>
            </div>
        </>
    );
}

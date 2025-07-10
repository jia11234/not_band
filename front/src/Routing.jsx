import Card from "./components/Game/Card";
import Login from "./components/Auth/Login";
import Index from "./components/Main/Index";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import GameIntro from "./components/Game/GameIntro";
import Event from "./components/Event/Event";
import Instrument from "./components/instrument/Instrument";
import Cart from "./components/Cart/Cart";
import Rental from "./components/Rental/Rental";
import "./css/app.css";
import App from "./App";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ErrorComponent } from "./components/Main/Index";
import OAuth from "./components/Auth/OAuth";
import ProductDetail from "./components/instrument/ProductDetail";
import Resell from "./components/Resell/Resell";
import ResellDetail from "./components/Resell/ResellDetail";
import Order from "./components/Order/Order";
import ThreeD from "./components/3D/ThreeD";
import OrderCompleted from "./components/Order/OrderCompleted";
import ResellRegistration from "./components/Resell/ResellRegistration";
import Mypage from "./components/Mypage/Mypage";
import ThreeDmenu from "./components/3D/ThreeDmenu";
import Bass from "./components/3D/Bass";
import Drum from "./components/3D/Drum";
import Elec from "./components/3D/Elec";
import Chat from "./components/Chat/Chat";
import ChatList from "./components/Chat/ChatList";
import Inquiry from "./components/Inquiry/Inquiry";
import ReviewRegistration from "./components/Review/ReviewRegistration";
import MypageOrder from "./components/Mypage/MypageOrder";
import MypageWish from "./components/Mypage/MypageWish";
import MypageReview from "./components/Mypage/MypageReview";
import Cs from "./components/Cs/Cs";
import MypageUserEdit from "./components/Mypage/MypageUserEdit";
import Admin from "./components/Admin/Admin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProduct from "./components/Admin/AdminProduct";
import AdminCustomerCenter from "./components/Admin/AdminCustomerCenter";
import AdminMember from "./components/Admin/AdminMember";
import AdminOrder from "./components/Admin/AdminOrder";
import AdminReview from "./components/Admin/AdminReview";
import AdminInquiry from "./components/Admin/AdminInquiry";
import AdminResell from "./components/Admin/AdminResell";
import MypageResell from "./components/Mypage/MypageResell";
import Search from "./components/Main/Search.jsx";
import IdFind from "./components/Auth/IdFind.jsx";
import PasswordFind from "./components/Auth/PasswordFind.jsx";
import FindOk from "./components/Auth/FindOk,.jsx";
import PasswordFindOk from "./components/Auth/PasswordFindOk.jsx";
import InquiryAdmin from "./components/Inquiry/InquiryAdmin.jsx";
import AdminProductUpload from "./components/Admin/AdminProductUpload.jsx";
import AdminCsUpload from "./components/Admin/AdminCsUpload.jsx";
import EventSale from "./components/Event/EventSale"
import EventReview from "./components/Event/EventReview"
import EventGame from "./components/Event/EventGame"
import PianoAR from "./components/3D/PianoAR.jsx";

export default function Routing({ setCartCount }) {

  return (
    <Routes>
      <Route path="/" element={<Index setCartCount={setCartCount}/>} />
      <Route path="not_band" element={<Index setCartCount={setCartCount}/>} />

      <Route path="not_band/sign-up" element={<SignUp />} />
      <Route path="not_band/sign-in" element={<SignIn />} />
      <Route path="not_band/login" element={<Login />} />
      <Route
        path="not_band/oauth-response/:token/:expirationTime"
        element={<OAuth />}
      />
      <Route path="*" element={<ErrorComponent />} />
      <Route path="not_band/id-find" element={<IdFind />} />
      <Route path="not_band/password-find" element={<PasswordFind />} />
      <Route path="not_band/id-findOk" element={<FindOk />} />
      <Route path="not_band/password-findOk" element={<PasswordFindOk />} />

      <Route path="not_band/event" element={<Event />} />
      <Route path="not_band/eventsale" element={<EventSale />}/>
      <Route path="not_band/eventreview" element={<EventReview />}/>
      <Route path="not_band/eventgame" element={<EventGame />}/>
      
      <Route path="not_band/Rental" element={<Rental />} />
      <Route path="not_band/game/card" element={<Card />} />
      <Route path="not_band/game" element={<GameIntro />} />

      <Route path="not_band/instrument-list" element={<Instrument setCartCount={setCartCount}/>} />
      <Route path="not_band/instrument-detail" element={<ProductDetail setCartCount={setCartCount}/>} />
      <Route path="not_band/cart" element={<Cart setCartCount={setCartCount}/>} />

      <Route path="not_band/resell" element={<Resell />} />
      <Route path="not_band/resell-detail" element={<ResellDetail />} />
      <Route
        path="not_band/resell-registration"
        element={<ResellRegistration />}
      />
      <Route path="not_band/search" element={<Search />} />

      <Route path="not_band/chat" element={<Chat />} />
      <Route path="not_band/chat-list" element={<ChatList />} />

      <Route path="not_band/inquiry" element={<Inquiry />} />

      <Route path="not_band/order" element={<Order />} />
      <Route path="not_band/success" element={<OrderCompleted />} />

      <Route
        path="not_band/review-registration"
        element={<ReviewRegistration />}
      />

      <Route path="not_band/mypage" element={<Mypage />}>
        <Route index element={<MypageOrder />} />
        <Route path="wish" element={<MypageWish />} />
        <Route path="review" element={<MypageReview />} />
        <Route path="user-edit" element={<MypageUserEdit />} />
        <Route path="resell" element={<MypageResell />} />
      </Route>

      <Route path="not_band/3d" element={<ThreeD />} />
      <Route path="not_band/3Dmenu" element={<ThreeDmenu />} />
      <Route path="not_band/bass" element={<Bass />} />
      <Route path="not_band/elec" element={<Elec />} />
      <Route path="not_band/drum" element={<Drum />} />
      <Route path="not_band/cs" element={<Cs />} />
      <Route path="not_band/ar" element={<PianoAR/>} />

      <Route path="/not_band/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="product" element={<AdminProduct />} />
        <Route path="cs" element={<AdminCustomerCenter />} />
        <Route path="member" element={<AdminMember />} />
        <Route path="order" element={<AdminOrder />} />
        <Route path="review" element={<AdminReview />} />
        <Route path="inquiry" element={<AdminInquiry />} />
        <Route path="resell" element={<AdminResell />} />
        <Route path="inquiry/chat" element={<InquiryAdmin />} />
        <Route path="productupload" element={<AdminProductUpload />} />
        <Route path="csupload" element={<AdminCsUpload />} />
      </Route>
    </Routes>
  );
}

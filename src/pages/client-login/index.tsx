import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";

import Footer from "../../components/Footer";

import { setCookie } from "../../helpers/cookies";

import "./client-login.scss";
import { backendDomainV1 } from "../../constants/common";

function ClientLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");

    if (!accessToken) {
      return;
    }

    localStorage.setItem("accessToken", accessToken);

    setCookie("access_token", accessToken, 1);
    navigate("/client-search");
  }, [location, navigate]);

  const loginWithGoogle = () => {
    window.location.href = `${backendDomainV1}/auth/google`;
  };

  return (
    <>
      <div className="header">
        <div className="header__left">
          <div className="logo">
            <span>Quản lý Văn bằng</span>
          </div>
        </div>
      </div>

      <div className="login-container">
        <button className="google-login-btn" onClick={loginWithGoogle}>
          <FcGoogle className="google-icon" />
          <span>Đăng nhập với Google</span>
        </button>
      </div>

      <Footer />
    </>
  );
}

export default ClientLogin;

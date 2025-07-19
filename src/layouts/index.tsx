import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AppMenu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { deleteCookie, getCookie } from "../helpers/cookies";
import { pathNamePublicRoutes } from "../routes/pathNamePublicRoutes";

import "./layouts.scss";
import { checkAccessToken } from "../services/auth";

function LayoutApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const isLoginPage = location.pathname === "/admin/auth/login";
  useEffect(() => {
    setIsLogin(false);

    const checkChangedUrl = async () => {
      const accessToken = getCookie("access_token");

      if (!accessToken && !pathNamePublicRoutes.includes(location.pathname)) {
        navigate("/admin/auth/login");
        return;
      }

      if (accessToken) {
        try {
          const {
            data: { data },
          } = await checkAccessToken({ accessToken });

          if (data.success) {
            setIsLogin(true);

            if (location.pathname === "/admin/auth/login") {
              navigate("/admin/dashboard");
            }
          }
        } catch {
          deleteCookie("access_token");
          navigate("/admin/auth/login");
        }
      }
    };
    checkChangedUrl();
  },
  [location.pathname, navigate]);

  return (
    <>
      {isLogin && !isLoginPage ? (
        <>
          <div className="layout">
            <div className="layout__left">
              <AppMenu />
            </div>
            <div className="layout__right">
              <div className="layout__header">
                <Header />
              </div>
              <div className="layout__main">
                <Outlet />
              </div>
              <div className="layout__footer">
                <Footer />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default LayoutApp;

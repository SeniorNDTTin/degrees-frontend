import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { deleteCookie } from "../../helpers/cookies";

import "./header.scss";

function Header() {
  const navigate = useNavigate();

  const handleLayout = () => {
    deleteCookie("access_token");
    navigate("/admin/auth/login");
  };

  return (
    <>
      <header className="header">
        <div className="header__logo">
          Logo
        </div>
        <div className="header__actions">
          <Button onClick={handleLayout}>Đăng xuất</Button>
        </div>
      </header>
    </>
  );
}

export default Header;

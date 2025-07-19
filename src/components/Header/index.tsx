import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { deleteCookie } from "../../helpers/cookies";

import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("access_token");
    navigate("/admin/auth/login");
  };

  return (
    <div className="header">
      <div className="header__left">
        <div className="logo">
          <span>Quản lý Văn bằng</span>
        </div>
      </div>
      <div className="header__right">
        <div className="user-info">
          <UserOutlined />
          <span>Admin</span>
        </div>
        <Button onClick={handleLogout} className="logout-btn" icon={<LogoutOutlined />}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

export default Header;

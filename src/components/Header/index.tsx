// import { Button } from "antd";
// import { useNavigate } from "react-router-dom";

// import { deleteCookie } from "../../helpers/cookies";

// import "./header.scss";

// function Header() {
//   const navigate = useNavigate();

//   const handleLayout = () => {
//     deleteCookie("access_token");
//     navigate("/admin/auth/login");
//   };

//   return (
//     <>
//       <header className="header">
//         <div className="header__logo">
//           Logo
//         </div>
//         <div className="header__actions">
//           <Button onClick={handleLayout}>Đăng xuất</Button>
//         </div>
//       </header>
//     </>
//   );
// }

// export default Header;
import { Button } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import "./Header.scss";

function Header() {
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
        <Button className="logout-btn" icon={<LogoutOutlined />}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

export default Header;

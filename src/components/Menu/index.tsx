import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { FaCertificate, FaCriticalRole } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdVerified, MdVerifiedUser } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

function AppMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    {
      key: "/admin/dashboard",
      icon: <LuLayoutDashboard />,
      label: "Tổng quan",
      onClick: () => {
        navigate("/admin/dashboard");
      },
    },
    {
      key: "/admin/roles",
      icon: <FaCriticalRole />,
      label: "Vai trò",
      onClick: () => {
        navigate("/admin/roles");
      },
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Người dùng</Link>,
    },
    {
      key: "/admin/certificates",
      icon: <FaCertificate />,
      label: "Chứng chỉ",
      onClick: () => {
        navigate("/admin/certificates");
      },
    },
    {
      key: "/admin/degrees",
      icon: <FaCertificate />,
      label: "Bằng cấp",
      onClick: () => {
        navigate("/admin/degrees");
      },
    },
    {
      key: "/admin/issuing-agencies",
      icon: <BsBuilding />,
      label: "Cơ quan cấp bằng",
      onClick: () => {
        navigate("/admin/issuing-agencies");
      },
    },
    {
      key: "/admin/verifiers",
      icon: <MdVerified />,
      label: "Người xác thực",
      onClick: () => {
        navigate("/admin/verifiers");
      },
    },
    {
      key: "/admin/verifications",
      icon: <MdVerifiedUser />,
      label: "Xác thực",
      onClick: () => {
        navigate("/admin/verifications");
      },
    },
  ];

  return (
    <>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={[location.pathname]}
        items={items}
      />
    </>
  );
}

export default AppMenu;

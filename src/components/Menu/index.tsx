import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { FaCertificate, FaCriticalRole } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdVerified, MdVerifiedUser } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

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
      key: "/admin/verifiers",
      icon: <MdVerified />,
      label: "Người xác thực",
      onClick: () => {
        navigate("/admin/verifiers");
      },
    },
    // Add menu bằng cấp
    {
      key: "/admin/certificates",
      icon: <FaCertificate/>,
      label: "Bằng cấp",
      onClick: () => {
        navigate("/admin/certificates");
      },
    },
    // Add menu xác thực
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

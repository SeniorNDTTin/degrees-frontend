import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { FaCriticalRole } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
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

import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { FaCriticalRole } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    key: "dashboard",
    icon: <LuLayoutDashboard />,
    label: "Tổng quan",
  },
  {
    key: "roles",
    icon: <FaCriticalRole />,
    label: "Vai trò",
  },
];

function AppMenu() {
  return (
    <>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={["dashboard"]}
        items={items}
      />
    </>
  );
}

export default AppMenu;

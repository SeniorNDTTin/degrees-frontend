import { Typography, Tag } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { IUser } from "../../interfaces/users";
import { deleteUserApi, findUsersApi } from "../../services/users";
import { findRolesApi } from "../../services/roles";
import type { IRole } from "../../interfaces/roles";

import "./users.scss";

const { Title } = Typography;

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reload, setReload] = useState(false);
  const accessToken = getCookie("access_token");
  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<Record<string, IRole>>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (gender === "female" ? "Nữ" : "Nam"),
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId: string) => (
        <Tag color={roleId ? "blue" : "default"}>
          {roles[roleId]?.name || "Chưa có vai trò"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/users/find/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/users/update/${record._id}`)}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={async () => {
              if (!confirm("Bạn có chắc muốn xóa?")) {
                return;
              }
              try {
                await deleteUserApi({ accessToken, id: record._id });
                setReload((prev) => !prev);
                toast.success("Xóa thành công!");
              } catch (error) {
                if (error.status === 403) {
                  toast.error("Bạn không có quyền");
                  return;
                }

                toast.error("Có lỗi xảy ra!");
              }
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchApi = async () => {
      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        // Fetch users with pagination
        const {
          data: { data: userData },
        } = await findUsersApi({ 
          accessToken,
          page: pagination.current,
          limit: pagination.pageSize
        });

        if (!userData?.users?.items) {
          throw new Error("Invalid user data format");
        }

        setUsers(userData.users.items);
        setPagination(prev => ({
          ...prev,
          total: userData.users.total
        }));

        // Fetch roles if not already loaded
        if (Object.keys(roles).length === 0) {
          const {
            data: { data: rolesData },
          } = await findRolesApi({ accessToken });

          if (!rolesData?.roles?.items) {
            throw new Error("Invalid roles data format");
          }

          // Convert roles array to object with _id as key
          const rolesMap = rolesData.roles.items.reduce((acc, role) => {
            acc[role._id] = role;
            return acc;
          }, {} as Record<string, IRole>);

          setRoles(rolesMap);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error?.response?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn!");
          navigate("/login");
        } else if (error?.response?.status === 403) {
          toast.error("Bạn không có quyền truy cập!");
          navigate("/");
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, pagination.current, pagination.pageSize, reload, location.key, navigate]);

  return (
    <>
      <div className="users">
        <div className="users__header">
          <Title>Danh sách người dùng</Title>
          <Button
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => navigate("/admin/users/create")}
          >
            Tạo
          </Button>
        </div>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} người dùng`
          }}
          onChange={(pagination) => {
            setPagination(pagination);
            setReload(prev => !prev);
          }}
        />
      </div>
    </>
  );
}

export default UserPage;

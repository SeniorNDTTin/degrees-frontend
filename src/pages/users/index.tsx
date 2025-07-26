import { Typography } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { IUser } from "../../interfaces/users";
import { deleteUserApi, findUsersApi } from "../../services/users";

import "./users.scss";

const { Title } = Typography;

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reload, setReload] = useState(false);
  const accessToken = getCookie("access_token");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const {
          data: { data },
        } = await findUsersApi({ accessToken });
        console.log("Users data:", data);
        setUsers(data.users.items);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, reload, location.key]); // Thêm location.key để reload khi quay lại trang

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
        />
      </div>
    </>
  );
}

export default UserPage;

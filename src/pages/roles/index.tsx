import { Typography } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { IRole } from "../../interfaces/roles";
import { deleteRoleApi, findRolesApi } from "../../services/roles";

import "./roles.scss";

const { Title } = Typography;

function RolePage() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const accessToken = getCookie("access_token");
  const [roles, setRoles] = useState<IRole[]>([]);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/roles/find/${record._id}`)}
          >
            Xem
          </Button>

          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/roles/update/${record._id}`)}
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
                await deleteRoleApi({ accessToken, id: record._id });
                setReload(!reload);
              } catch {
                toast.error("Có lỗi xảy ra!");
              }

              console.log("xóa");
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
      try {
        const {
          data: { data },
        } = await findRolesApi({ accessToken });
        setRoles(data.roles.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, reload]);

  return (
    <>
      <div className="roles">
        <div className="roles__header">
          <Title>Danh sách vai trò</Title>
          <Button
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => navigate("/admin/roles/create")}
          >
            Tạo
          </Button>
        </div>

        <Table dataSource={roles} columns={columns} />
      </div>
    </>
  );
}

export default RolePage;

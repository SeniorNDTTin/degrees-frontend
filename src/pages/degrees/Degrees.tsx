import { Typography } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { IDegree } from "../../interfaces/degrees";
import { deleteDegreeApi, findDegreesApi } from "../../services/degrees";

import "./degrees.scss";

const { Title } = Typography;

function DegreePage() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const accessToken = getCookie("access_token");
  const [degrees, setDegrees] = useState<IDegree[]>([]);

  const columns = [
    {
      title: "Tên bằng cấp",
      dataIndex: "degreeName",
      key: "degreeName",
    },
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
    },
    {
      title: "GPA",
      dataIndex: "GPA",
      key: "GPA",
    },
    {
      title: "Xếp loại",
      dataIndex: "classification",
      key: "classification",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Email học viên",
      dataIndex: "studentEmail",
      key: "studentEmail",
    },
    {
      title: "Ngày phát hành",
      dataIndex: "issuedDate",
      key: "issuedDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IDegree) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/degrees/find/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/degrees/update/${record._id}`)}
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
                await deleteDegreeApi({ accessToken, id: record._id });
                setReload(!reload);
                toast.success("Xóa thành công!");
              } catch {
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
      try {
        const {
          data: { data },
        } = await findDegreesApi({ accessToken });
        setDegrees(data.degrees.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, reload]);

  return (
    <>
      <div className="degrees">
        <div className="degrees__header">
          <Title>Danh sách bằng cấp</Title>
          <Button
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => navigate("/admin/degrees/create")}
          >
            Tạo
          </Button>
        </div>
        <Table dataSource={degrees} columns={columns} rowKey="_id" />
      </div>
    </>
  );
}

export default DegreePage;
import { Typography } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { ICertificate } from "../../interfaces/certificates";
import {
  deleteCertificateApi,
  findCertificatesApi,
} from "../../services/certificates";

import "./certificates.scss";

const { Title } = Typography;

function CertificatePage() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const accessToken = getCookie("access_token");
  const [certificates, setCertificates] = useState<ICertificate[]>([]);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
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
      render: (_: any, record: ICertificate) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/certificates/find/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/certificates/update/${record._id}`)}
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
                await deleteCertificateApi({
                  accessToken,
                  id: record._id,
                });

                setReload(!reload);
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
      try {
        const {
          data: { data },
        } = await findCertificatesApi({ accessToken });
        setCertificates(data.certificates.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, reload]);

  return (
    <>
      <div className="certificates">
        <div className="certificates__header">
          <Title>Danh sách chứng chỉ</Title>
          <Button
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => navigate("/admin/certificates/create")}
          >
            Tạo
          </Button>
        </div>
        <Table dataSource={certificates} columns={columns} rowKey="_id" />
      </div>
    </>
  );
}

export default CertificatePage;

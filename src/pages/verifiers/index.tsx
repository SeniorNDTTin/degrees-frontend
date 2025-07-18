import { Typography } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../helpers/cookies";
import type { IVerifier } from "../../interfaces/verifiers";
import { deleteVerifierApi, findVerifiersApi } from "../../services/verifiers";

import "./verifier.scss";

const { Title } = Typography;

function VerifierPage() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = getCookie("access_token");
  const [verifiers, setVerifiers] = useState<IVerifier[]>([]);

  const columns = [
    {
      title: "Tên người xác thực",
      dataIndex: "verifierName",
      key: "verifierName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Tổ chức",
      dataIndex: "organization",
      key: "organization",
    },
    {
      title: "Email",
      dataIndex: "verifierEmail",
      key: "verifierEmail",
      render: (text: string) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: IVerifier) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/verifiers/find/${record._id}`)}
          >
            Xem
          </Button>

          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/verifiers/update/${record._id}`)}
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
                await deleteVerifierApi({ accessToken, id: record._id });
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
      setLoading(true);
      try {
        const {
          data: { data },
        } = await findVerifiersApi({ accessToken });
        setVerifiers(data.verifiers.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, reload]);

  return (
    <div className="verifier-page">
      <div className="verifier-page__header">
        <Title level={2}>Danh sách người xác thực</Title>
        <Button
          type="primary"
          style={{ backgroundColor: "green", borderColor: "green" }}
          onClick={() => navigate("/admin/verifiers/create")}
        >
          Tạo
        </Button>
      </div>

      <div className="verifier-page__table">
        <Table 
          dataSource={verifiers} 
          columns={columns} 
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} người xác thực`,
          }}
        />
      </div>
    </div>
  );
}

export default VerifierPage; 
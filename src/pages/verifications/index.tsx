import { useEffect, useState } from "react";
import { Button, Table, Typography, Modal, Tag, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ColumnsType } from "antd/es/table";

import { getCookie } from "../../helpers/cookies";
import {
  findVerificationsApi,
  deleteVerificationApi,
} from "../../services/verifications";
import { findVerifierByIdApi } from "../../services/verifiers";
import { findDegreeByIdApi } from "../../services/degrees";
import { findCertificateByIdApi } from "../../services/certificates";
import type { IVerification } from "../../interfaces/verifications";

import "./verification.scss";

const { Title } = Typography;

// Extend from Partial<IVerification> to make all fields optional
interface DataType {
  _id: string;
  key: string;
  type: "degree" | "certificate";
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  verifierName?: string;
  degreeName?: string;
  certificateName?: string;
  studentEmail: string;
}

function VerificationsPage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await findVerificationsApi({ accessToken });
      console.log("Verifications response:", response.data);

      const verificationData = response.data.data.verifications;
      console.log("Verifications data:", verificationData);

      if (!verificationData || !Array.isArray(verificationData.items)) {
        console.error(
          "Invalid verifications data structure:",
          verificationData
        );
        toast.error("Dữ liệu không hợp lệ!");
        return;
      }

      // Fetch additional details for each verification
      const verificationDetails = await Promise.all(
        verificationData.items.map(async (verification: IVerification) => {
          let verifierName,
            degreeName,
            certificateName,
            studentEmail = "N/A";

          // Fetch verifier details
          if (verification.verifierId) {
            try {
              const verifierResponse = await findVerifierByIdApi({
                accessToken,
                id: verification.verifierId,
              });
              const verifier = verifierResponse.data.data;
              verifierName = verifier.verifierName;
            } catch (error) {
              console.error("Error fetching verifier:", error);
            }
          }

          // Fetch degree/certificate details based on type
          if (verification.type === "degree" && verification.degreeId) {
            try {
              const degreeResponse = await findDegreeByIdApi({
                accessToken,
                id: verification.degreeId,
              });
              const degree = degreeResponse.data.data;
              degreeName = degree.degreeName;
              studentEmail = degree.studentEmail || "N/A";
            } catch (error) {
              console.error("Error fetching degree:", error);
            }
          } else if (
            verification.type === "certificate" &&
            verification.certificateId
          ) {
            try {
              const certificateResponse = await findCertificateByIdApi({
                accessToken,
                id: verification.certificateId,
              });
              const certificate = certificateResponse.data.data;
              certificateName = certificate.title;
              studentEmail = certificate.studentEmail || "N/A";
            } catch (error) {
              console.error("Error fetching certificate:", error);
            }
          }

          return {
            _id: verification._id,
            key: verification._id,
            type: verification.type,
            verifierId: verification.verifierId,
            degreeId: verification.degreeId,
            certificateId: verification.certificateId,
            description: verification.description,
            verifierName,
            degreeName,
            certificateName,
            studentEmail,
          };
        })
      );

      console.log("Verification details:", verificationDetails);
      setData(verificationDetails);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn thu hồi?")) {
      return;
    }

    try {
      await deleteVerificationApi({ accessToken, id });
      toast.success("Thu hồi thành công!");
      fetchData();
    } catch (error) {
      if (error.status === 403) {
        toast.error("Bạn không có quyền");
        return;
      }

      toast.error("Có lỗi xảy ra khi thu hồi!");
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Email học viên",
      dataIndex: "studentEmail",
      key: "studentEmail",
      render: (text: string) => {
        if (text === "N/A") return text;
        return <a href={`mailto:${text}`}>{text}</a>;
      },
    },
    {
      title: "Loại xác thực",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <strong>{type === "degree" ? "Văn bằng" : "Chứng chỉ"}</strong>
      ),
    },
    {
      title: "Người xác thực",
      dataIndex: "verifierName",
      key: "verifierName",
    },
    {
      title: "Văn bằng/Chứng chỉ",
      key: "document",
      render: (_, record) => (
        <strong>
          {record.type === "degree"
            ? record.degreeName
            : record.certificateName}
        </strong>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/verifications/find/${record._id}`)}
          >
            Xem
          </Button>

          {/* <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() =>
              navigate(`/admin/verifications/update/${record._id}`)
            }
          >
            Sửa
          </Button> */}

          <Button danger onClick={() => handleDelete(record._id)}>
            Thu hồi
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="verification-page">
      <div className="verification-page__header">
        <Title level={2}>Danh sách xác thực</Title>
        <Button
          type="primary"
          style={{ backgroundColor: "green", borderColor: "green" }}
          onClick={() => navigate("/admin/verifications/create")}
        >
          Tạo
        </Button>
      </div>

      <div className="verification-page__table">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
          }}
        />
      </div>
    </div>
  );
}

export default VerificationsPage;

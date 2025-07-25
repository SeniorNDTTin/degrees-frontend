import { useEffect, useState } from "react";
import { Button, Descriptions, Spin, Typography, Tag, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getIssuingAgencyById } from "../../services/issuing-agencies";
import type { IIssuingAgencyResponse } from "../../interfaces/issuing-agencies";
import { getCookie } from "../../helpers/cookies";

const { Title } = Typography;

const FindIssuingAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [issuingAgency, setIssuingAgency] = useState<IIssuingAgencyResponse | null>(null);
  const accessToken = getCookie("access_token");

  useEffect(() => {
    const fetchIssuingAgency = async () => {
      try {
        setLoading(true);
        const response = await getIssuingAgencyById({ accessToken, id: id! });
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        
        // Kiểm tra và lấy dữ liệu từ response
        const agencyData = response.data.data;
        if (agencyData && agencyData._id) {
          console.log('Agency Data:', JSON.stringify(agencyData, null, 2));
          setIssuingAgency(agencyData);
        } else {
          console.error('Invalid response structure:', response);
          toast.error('Không tìm thấy thông tin cơ sở cấp bằng!');
          navigate('/admin/issuing-agencies');
        }
      } catch (error) {
        console.error("Error fetching issuing agency:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu!");
        navigate("/admin/issuing-agencies");
      } finally {
        setLoading(false);
      }
    };

    if (id && accessToken) {
      fetchIssuingAgency();
    }
  }, [id, navigate, accessToken]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!issuingAgency) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Không tìm thấy thông tin</p>
        <Button onClick={() => navigate("/admin/issuing-agencies")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="issuing-agencies-page">
      <div className="issuing-agencies-page__header">
        <Title level={2}>Chi tiết cơ sở cấp bằng</Title>
        <Space>
          <Button
            type="primary"
            style={{
              backgroundColor: "orange",
              borderColor: "orange",
            }}
            onClick={() => navigate(`/admin/issuing-agencies/update/${id}`)}
          >
            Sửa
          </Button>
          <Button onClick={() => navigate("/admin/issuing-agencies")}>
            Quay lại
          </Button>
        </Space>
      </div>

      <div className="issuing-agencies-page__content">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên cơ sở">
            {issuingAgency.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <a href={`mailto:${issuingAgency.email}`}>{issuingAgency.email}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {issuingAgency.location}
          </Descriptions.Item>
          <Descriptions.Item label="Loại cơ sở">
            <Tag color={issuingAgency.isUniversity ? "blue" : "orange"}>
              {issuingAgency.isUniversity ? "Trường đại học" : "Trung tâm đào tạo"}
            </Tag>
          </Descriptions.Item>
          {issuingAgency.publicKey && (
            <Descriptions.Item label="Public Key">
              <div style={{ wordBreak: "break-all" }}>
                {issuingAgency.publicKey}
              </div>
            </Descriptions.Item>
          )}
          {issuingAgency.createdAt && (
            <Descriptions.Item label="Ngày tạo">
              {new Date(issuingAgency.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          )}
          {issuingAgency.updatedAt && (
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(issuingAgency.updatedAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </div>
  );
};

export default FindIssuingAgency; 
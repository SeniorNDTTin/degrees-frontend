import { useEffect, useState } from "react";
import { Button, Form, Input, Spin, Typography, Space, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getIssuingAgencyById, updateIssuingAgency } from "../../services/issuing-agencies";
import type { IUpdateIssuingAgencyDto } from "../../interfaces/issuing-agencies";
import { getCookie } from "../../helpers/cookies";

const { Title } = Typography;
const { Option } = Select;

const UpdateIssuingAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const accessToken = getCookie("access_token");

  useEffect(() => {
    const fetchIssuingAgency = async () => {
      try {
        setLoading(true);
        const response = await getIssuingAgencyById({ accessToken, id: id! });
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        
        const agencyData = response.data.data;
        if (agencyData && agencyData._id) {
          form.setFieldsValue({
            name: agencyData.name,
            email: agencyData.email,
            location: agencyData.location,
            isUniversity: agencyData.isUniversity
          });
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
  }, [id, form, navigate, accessToken]);

  const onFinish = async (values: IUpdateIssuingAgencyDto) => {
    try {
      setSubmitting(true);
      await updateIssuingAgency({ accessToken, id: id!, ...values });
      toast.success("Cập nhật thành công!");
      navigate("/admin/issuing-agencies");
    } catch (error) {
      console.error("Error updating issuing agency:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="issuing-agencies-page">
      <div className="issuing-agencies-page__header">
        <Title level={2}>Cập nhật cơ sở cấp bằng</Title>
        <Button onClick={() => navigate("/admin/issuing-agencies")}>
          Quay lại
        </Button>
      </div>

      <div className="issuing-agencies-page__content">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Tên cơ sở"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên cơ sở!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="location"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại cơ sở"
            name="isUniversity"
            rules={[{ required: true, message: "Vui lòng chọn loại cơ sở!" }]}
          >
            <Select>
              <Option value={true}>Trường đại học</Option>
              <Option value={false}>Trung tâm đào tạo</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                Cập nhật
              </Button>
              <Button onClick={() => navigate("/admin/issuing-agencies")}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateIssuingAgency; 
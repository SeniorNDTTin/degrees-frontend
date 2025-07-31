import { useState } from "react";
import { Button, Form, Input, Typography, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createIssuingAgency } from "../../services/issuing-agencies";
import type { ICreateIssuingAgencyDto } from "../../interfaces/issuing-agencies";
import { getCookie } from "../../helpers/cookies";

const { Title } = Typography;
const { Option } = Select;

const CreateIssuingAgency = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const accessToken = getCookie("access_token");

  const onFinish = async (values: ICreateIssuingAgencyDto) => {
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      // Chuẩn hóa dữ liệu trước khi gửi
      const formattedValues = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        location: values.location.trim()
      };

      await createIssuingAgency({ ...formattedValues, accessToken });
      toast.success("Tạo mới cơ sở cấp bằng thành công!");
      navigate("/admin/issuing-agencies");
    } catch (error: any) {
      console.error("Error creating issuing agency:", error);
      if (error?.response?.status === 403) {
        toast.error("Bạn không có quyền thực hiện thao tác này!");
        return;
      } else if (error?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn!");
        navigate("/login");
        return;
      } else if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message || "Dữ liệu không hợp lệ!");
        return;
      }

      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo mới!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="issuing-agencies-page">
      <div className="issuing-agencies-page__header">
        <Title level={2}>Tạo mới cơ sở cấp bằng</Title>
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
            rules={[
              { required: true, message: "Vui lòng nhập tên cơ sở!" },
              { whitespace: true, message: "Tên cơ sở không được chỉ chứa khoảng trắng!" },
              { min: 2, message: "Tên cơ sở phải có ít nhất 2 ký tự!" }
            ]}
          >
            <Input placeholder="Nhập tên cơ sở..." maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
              { whitespace: true, message: "Email không được chứa khoảng trắng!" },
              { max: 50, message: "Email không được vượt quá 50 ký tự!" }
            ]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="location"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ!" },
              { whitespace: true, message: "Địa chỉ không được chỉ chứa khoảng trắng!" },
              { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!" }
            ]}
          >
            <Input.TextArea 
              placeholder="Nhập địa chỉ..." 
              maxLength={200} 
              showCount 
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            label="Loại cơ sở"
            name="isUniversity"
            rules={[{ required: true, message: "Vui lòng chọn loại cơ sở!" }]}
          >
            <Select placeholder="Chọn loại cơ sở">
              <Option value={true}>Trường đại học</Option>
              <Option value={false}>Trung tâm đào tạo</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Tạo mới
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

export default CreateIssuingAgency;

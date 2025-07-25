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
    try {
      setSubmitting(true);
      await createIssuingAgency({ ...values, accessToken });
      toast.success("Tạo mới thành công!");
      navigate("/admin/issuing-agencies");
    } catch (error) {
      console.error("Error creating issuing agency:", error);
      toast.error("Có lỗi xảy ra khi tạo mới!");
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
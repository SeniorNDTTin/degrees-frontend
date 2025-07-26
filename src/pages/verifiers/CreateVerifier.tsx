import { Button, Form, Input, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { FormProps } from "antd";
import { useState } from "react";

import { getCookie } from "../../helpers/cookies";
import { createVerifierApi } from "../../services/verifiers";

import "./verifier.scss";

const { Title } = Typography;

type FieldType = {
  verifierName?: string;
  organization?: string;
  verifierEmail?: string;
};

function CreateVerifierPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const accessToken = getCookie("access_token");
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      await createVerifierApi({
        accessToken,
        ...(values as Required<FieldType>),
      });
      toast.success("Tạo thành công!");
      navigate("/admin/verifiers");
    } catch (error) {
      if (error.status === 403) {
        toast.error("Bạn không có quyền");
        return;
      }

      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verifier-page">
      <div className="verifier-page__header">
        <Title level={2}>Tạo người xác thực</Title>
        <Button type="primary" onClick={() => navigate("/admin/verifiers")}>
          Quay lại
        </Button>
      </div>

      <Spin spinning={loading}>
        <div className="verifier-page__form">
          <Form
            form={form}
            name="create-verifier"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Tên người xác thực"
              name="verifierName"
              rules={[
                { required: true, message: "Hãy nhập tên người xác thực!" },
              ]}
            >
              <Input placeholder="Nhập tên người xác thực" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tổ chức"
              name="organization"
              rules={[{ required: true, message: "Hãy nhập tên tổ chức!" }]}
            >
              <Input placeholder="Nhập tên tổ chức" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email"
              name="verifierEmail"
              rules={[
                { required: true, message: "Hãy nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
}

export default CreateVerifierPage;

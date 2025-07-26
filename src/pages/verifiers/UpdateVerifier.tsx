import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import {
  findVerifierByIdApi,
  updateVerifierApi,
} from "../../services/verifiers";
import type { IVerifier } from "../../interfaces/verifiers";

import "./verifier.scss";

const { Title } = Typography;

type FieldType = {
  verifierName?: string;
  organization?: string;
  verifierEmail?: string;
};

function UpdateVerifierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verifier, setVerifier] = useState<IVerifier | null>(null);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await findVerifierByIdApi({ accessToken, id: id as string });
        setVerifier(data);
        form.setFieldsValue(data);
      } catch {
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, id, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      await updateVerifierApi({
        accessToken,
        id: id as string,
        ...values,
      });
      toast.success("Cập nhật thành công!");
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
        <Title level={2}>Cập nhật người xác thực</Title>
        <Button type="primary" onClick={() => navigate("/admin/verifiers")}>
          Quay lại
        </Button>
      </div>

      <Spin spinning={loading}>
        {verifier && (
          <div className="verifier-page__form">
            <Form
              form={form}
              name="update-verifier"
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
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Spin>
    </div>
  );
}

export default UpdateVerifierPage;

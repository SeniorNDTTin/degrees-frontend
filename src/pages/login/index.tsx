import { toast } from "react-toastify";
import { Button, Form, Input, Typography, type FormProps } from "antd";

import { loginApi } from "../../services/auth";
import { setCookie } from "../../helpers/cookies";

import "./login.scss";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
};
const { Title } = Typography;

function LoginPage() {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password } = values;
    if (!email || !password) {
      toast.error("Vui lòng nhập đủ thông tin!");
    }

    try {
      const {
        data: { data },
      } = await loginApi({
        email: email as string,
        password: password as string,
      });

      setCookie("access_token", data.access_token, 1);
      navigate("/admin/dashboard");
    } catch {
      toast.error("Sai thông tin đăng nhập!");
    }
  };

  return (
    <>
      <div className="login-page">
        <Form
          className="login-page__form"
          onFinish={onFinish}
          style={{ minWidth: 800 }}
          layout="vertical"
        >
          <Title className="login-page__form-title">Đăng Nhập</Title>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Hãy nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <div className="login-page__form-inner-button">
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default LoginPage;

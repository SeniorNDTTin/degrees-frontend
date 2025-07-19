import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, type FormProps } from "antd";

import { setCookie } from "../../helpers/cookies";
import { loginApi, loginValidateOTPApi } from "../../services/auth";

import type { OTPProps } from "antd/es/input/OTP";

import "./login.scss";

type FieldType = {
  email?: string;
  password?: string;
};
const { Title } = Typography;

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [hiddenValidateOTP, setHiddenValidateOTP] = useState(true);

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

      setUserId(data.userId);
      setHiddenValidateOTP(false);
    } catch {
      toast.error("Sai thông tin đăng nhập!");
    }
  };

  const onChangeOTP: OTPProps["onChange"] = async (text) => {
    if (!userId || hiddenValidateOTP) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    try {
      const {
        data: { data },
      } = await loginValidateOTPApi({ userId, otp: text });

      setCookie("access_token", data.access_token, 1);
      navigate("/admin/dashboard");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };
  const sharedOTPProps: OTPProps = {
    onChange: onChangeOTP,
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

          {!hiddenValidateOTP && (
            <>
              <Title level={5}>Xác Thực Mã OTP</Title>
              <Input.OTP
                formatter={(str) => str.toUpperCase()}
                {...sharedOTPProps}
              />
            </>
          )}
        </Form>
      </div>
    </>
  );
}

export default LoginPage;

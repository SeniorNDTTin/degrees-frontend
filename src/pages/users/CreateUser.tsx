import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Typography, DatePicker } from "antd";
import dayjs from 'dayjs';

import { getCookie } from "../../helpers/cookies";
import { createUserApi } from "../../services/users";
import { findRolesApi } from "../../services/roles";
import type { IRole } from "../../interfaces/roles";

const { Title } = Typography;
const { Option } = Select;

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female";
  birthday: dayjs.Dayjs;
  roleId: string;
};

function CreateUserPage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await findRolesApi({ accessToken });
        setRoles(response.data.data.roles.items);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error("Có lỗi khi tải danh sách vai trò!");
      }
    };
    fetchRoles();
  }, [accessToken]);

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      await createUserApi({
        accessToken,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        gender: values.gender,
        birthday: values.birthday.format('YYYY-MM-DD'),
        roleId: values.roleId,
      });
      toast.success("Tạo người dùng thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("Có lỗi khi tạo người dùng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title>Tạo người dùng mới</Title>
        <Button onClick={() => navigate("/admin/users")}>
          Quay lại
        </Button>
      </div>

      <Form
        form={form}
        name="createUser"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        disabled={loading}
      >
        <Form.Item<FieldType>
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          label="Ngày sinh"
          name="birthday"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select>
            {roles.map(role => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateUserPage; 
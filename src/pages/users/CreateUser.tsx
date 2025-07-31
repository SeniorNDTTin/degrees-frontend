import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Typography, DatePicker, Card } from "antd";
import dayjs from "dayjs";

import { getCookie } from "../../helpers/cookies";
import { createUserApi } from "../../services/users";
import { findRolesApi } from "../../services/roles";
import type { IRole } from "../../interfaces/roles";
import type { ICreateUserRequest } from "../../interfaces/users";
import { EUserGender } from "../../interfaces/users";

const { Title } = Typography;
const { Option } = Select;

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
        console.error("Error fetching roles:", error);
        toast.error("Có lỗi khi tải danh sách vai trò!");
      }
    };
    fetchRoles();
  }, [accessToken]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData: ICreateUserRequest = {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        gender: values.gender as EUserGender,
        birthday: values.birthday.toDate(),
        roleId: values.roleId
      };

      await createUserApi({
        accessToken,
        ...userData
      });
      
      toast.success("Tạo người dùng thành công!");
      navigate("/admin/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Tạo người dùng mới" extra={
      <Button onClick={() => navigate("/admin/users")}>
        Quay lại
      </Button>
    }>
      <Form
        form={form}
        name="createUser"
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        requiredMark="optional"
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { whitespace: true, message: "Họ và tên không được chỉ chứa khoảng trắng!" }
          ]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
            }
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value={EUserGender.MALE}>Nam</Option>
            <Option value={EUserGender.FEMALE}>Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="birthday"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh!" },
            {
              validator: (_, value) => {
                if (value && value.isAfter(dayjs())) {
                  return Promise.reject("Ngày sinh không thể là ngày trong tương lai!");
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh"
            disabledDate={date => date && date.isAfter(dayjs())}
          />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => navigate("/admin/users")}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreateUserPage;

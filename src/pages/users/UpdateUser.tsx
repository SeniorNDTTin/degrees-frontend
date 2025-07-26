import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Typography, DatePicker } from "antd";
import dayjs from 'dayjs';

import { getCookie } from "../../helpers/cookies";
import { findUserByIdApi, updateUserApi } from "../../services/users";
import type { IUser } from "../../interfaces/users";
import { EUserGender } from "../../interfaces/users";

const { Title } = Typography;
const { Option } = Select;

type FieldType = {
  fullName: string;
  email: string;
  gender: "male" | "female";
  birthday: dayjs.Dayjs;
};

function UpdateUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await findUserByIdApi({ accessToken, id });
        const userData = response.data.data;
        console.log('Current user data:', userData);
        
        // Set form values
        form.setFieldsValue({
          fullName: userData.fullName,
          email: userData.email,
          gender: userData.gender,
          birthday: dayjs(userData.birthday),
        });
        console.log('Form values after set:', form.getFieldsValue());
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error("Có lỗi khi tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, accessToken, form]);

  const onFinish = async (values: FieldType) => {
    if (!id) return;
    setLoading(true);
    try {
      console.log('Form values before submit:', values);
      const response = await updateUserApi({
        accessToken,
        id,
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
        birthday: values.birthday.format('YYYY-MM-DD'),
      });
      console.log('Update response:', response.data);
      
      // Reload user data after update
      const updatedUser = await findUserByIdApi({ accessToken, id });
      console.log('Updated user data:', updatedUser.data.data);
      
      toast.success("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Có lỗi khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log('Form values changed:', changedValues);
    console.log('Current form values:', allValues);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title>Cập nhật người dùng</Title>
        <Button onClick={() => navigate("/admin/users")}>
          Quay lại
        </Button>
      </div>

      <Form
        form={form}
        name="updateUser"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdateUserPage; 
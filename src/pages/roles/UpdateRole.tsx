import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import {
  createRoleApi,
  findRoleByIdApi,
  updateRoleApi,
} from "../../services/roles";
import { useEffect } from "react";

const { Title } = Typography;

type FieldType = {
  name?: string;
  description?: string;
  permissions?: string[];
};

function UpdateRolePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const location = useLocation();
  const pathnames = location.pathname.split("/");
  const id = pathnames[pathnames.length - 1];

  useEffect(() => {
    const fetchApi = async () => {
      const {
        data: { data },
      } = await findRoleByIdApi({ accessToken, id });

      form.setFieldsValue({
        name: data.name,
        description: data.description,
        permissions: data.permissions,
      });
    };
    fetchApi();
  }, [accessToken, id, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, description, permissions } = values;

    try {
      await updateRoleApi({
        accessToken,
        id,
        name: name as string,
        description: description as string,
        permissions: permissions as string[],
      });

      toast.success("Cập nhật thành công!");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <div className="create-roles">
        <Title>Cập Nhật Vai Trò</Title>

        <Form
          form={form}
          className="create-roles__form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Hãy nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Các quyền"
            name="permissions"
            rules={[{ required: true, message: "Hãy chọn các quyền!" }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Hãy chọn"
              defaultValue={[]}
              options={[
                // roles
                {
                  label: "create-role",
                  value: "create-role",
                },
                {
                  label: "update-role",
                  value: "update-role",
                },
                {
                  label: "delete-role",
                  value: "delete-role",
                },
                {
                  label: "read-role",
                  value: "read-role",
                },

                // users
                {
                  label: "create-user",
                  value: "create-user",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div className="create-roles__form-button">
              <Button type="primary" htmlType="submit">
                Sửa
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default UpdateRolePage;

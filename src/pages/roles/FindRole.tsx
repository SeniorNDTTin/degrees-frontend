import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Select, Typography } from "antd";

import { getCookie } from "../../helpers/cookies";
import { findRoleByIdApi } from "../../services/roles";

const { Title } = Typography;

type FieldType = {
  name?: string;
  description?: string;
  permissions?: string[];
};

function UpdateRolePage() {
  const [form] = Form.useForm();
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

  return (
    <>
      <div className="create-roles">
        <Title>Chi Tiết Vai Trò</Title>

        <Form form={form} className="create-roles__form" layout="vertical">
          <Form.Item<FieldType>
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Hãy nhập tên!" }]}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
          >
            <Input.TextArea rows={10} disabled={true} />
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
              disabled={true}
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
        </Form>
      </div>
    </>
  );
}

export default UpdateRolePage;

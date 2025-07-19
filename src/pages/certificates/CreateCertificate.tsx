import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { createCertificateApi } from "../../services/certificates";

const { Title } = Typography;

type FieldType = {
  name?: string;
  description?: string;
  permissions?: string;
};

function CreateCertificatePage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, description, permissions } = values;

    try {
      await createCertificateApi({
        accessToken,
        name: name as string,
        description: description as string,
        permissions: permissions as string,
      });
      navigate("/admin/certificates");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <div className="create-certificates">
        <Title>Tạo Mới Chứng Chỉ</Title>

        <Form
          className="create-certificates__form"
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
            label="Chứng chỉ"
            name="permissions"
            rules={[{ required: true, message: "Hãy chọn chứng chỉ!" }]}
          >
            <Select mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder = "Hãy chọn chứng chỉ"
            defaultValue={[
            //Ceratificate
                {
                    label: "create_certificate",
                    value: "create_certificate",
                },
                {
                    label: "update_certificate",
                    value: "update_certificate",
                },
                {
                    label: "delete_certificate",
                    value: "delete_certificate",
                },
                {
                    label: "read_certificate",
                    value: "read_certificate",
                },

                {

                }
            ]}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div className="create-certificates__form__button">
              <Button type = "primary" htmlType="submit">
            Tạo mới
                </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}


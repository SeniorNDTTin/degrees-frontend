import { toast } from "react-toastify";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { findDegreeByIdApi, updateDegreeApi } from "../../services/degrees";

const { Title } = Typography;

type FieldType = {
  degreeName?: string;
  major?: string;
  GPA?: number;
  classification?: string;
  issuedDate?: string;
  status?: string;
  studentEmail?: string;
  issuerID?: string;
};

function UpdateDegreePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const location = useLocation();
  const pathnames = location.pathname.split("/");
  const id = pathnames[pathnames.length - 1];

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await findDegreeByIdApi({ accessToken, id });
        console.log("API Response:", data); // Kiểm tra dữ liệu nhận được
        form.setFieldsValue({
          degreeName: data.degreeName,
          major: data.major,
          GPA: data.GPA,
          classification: data.classification,
          issuedDate: data.issuedDate ? new Date(data.issuedDate).toISOString().split("T")[0] : undefined,
          status: data.status,
          studentEmail: data.studentEmail,
          issuerID: data.issuerID,
        });
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, id, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await updateDegreeApi({
        accessToken,
        id,
        degreeName: values.degreeName,
        major: values.major,
        GPA: values.GPA,
        classification: values.classification,
        issuedDate: values.issuedDate,
        status: values.status,
        studentEmail: values.studentEmail,
        issuerID: values.issuerID,
      });
      navigate("/admin/degrees");
      toast.success("Cập nhật bằng cấp thành công!");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <div className="degrees">
        <Title>Cập Nhật Bằng Cấp</Title>
        <Form
          form={form}
          className="degrees__form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Tên bằng cấp"
            name="degreeName"
            rules={[{ required: true, message: "Hãy nhập tên bằng cấp!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chuyên ngành"
            name="major"
            rules={[{ required: true, message: "Hãy nhập chuyên ngành!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="GPA"
            name="GPA"
            rules={[{ required: true, message: "Hãy nhập GPA!" }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Xếp loại"
            name="classification"
            rules={[{ required: true, message: "Hãy chọn xếp loại!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn xếp loại"
              options={[
                { label: "Xuất sắc", value: "Excellent" },
                { label: "Giỏi", value: "Good" },
                { label: "Trung bình", value: "Average" },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="issuedDate"
            rules={[{ required: true, message: "Hãy nhập ngày phát hành!" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn trạng thái"
              options={[
                { label: "Active", value: "Active" },
                { label: "Revoked", value: "Revoked" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email học viên"
            name="studentEmail"
            rules={[{ required: true, message: "Hãy nhập email học viên!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item<FieldType>
            label="ID tổ chức phát hành"
            name="issuerID"
            rules={[{ required: true, message: "Hãy nhập ID tổ chức phát hành!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <div className="degrees__form-button">
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

export default UpdateDegreePage;
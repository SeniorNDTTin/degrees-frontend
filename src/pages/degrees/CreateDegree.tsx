import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { createDegreeApi } from "../../services/degrees";

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

function CreateDegreePage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await createDegreeApi({
        accessToken,
        degreeName: values.degreeName as string,
        major: values.major as string,
        GPA: values.GPA as number,
        classification: values.classification as string,
        issuedDate: values.issuedDate as string,
        status: values.status as string,
        studentEmail: values.studentEmail as string,
        issuerID: values.issuerID as string,
      });
      navigate("/admin/degrees");
      toast.success("Tạo bằng cấp thành công!");
    } catch (error) {
      if (error.status === 403) {
        toast.error("Bạn không có quyền");
        return;
      }

      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <div className="degrees">
        <Title>Tạo Mới Bằng Cấp</Title>
        <Form className="degrees__form" onFinish={onFinish} layout="vertical">
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
            rules={[
              { required: true, message: "Hãy nhập ID tổ chức phát hành!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <div className="degrees__form-button">
              <Button type="primary" htmlType="submit">
                Nộp
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default CreateDegreePage;

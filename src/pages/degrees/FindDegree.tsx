import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Select, Typography } from "antd";
import { toast } from "react-toastify";

import { getCookie } from "../../helpers/cookies";
import { findDegreeByIdApi } from "../../services/degrees";

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

function FindDegreePage() {
  const [form] = Form.useForm();
  const [qrCode, setQrCode] = useState("");
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
          issuedDate: data.issuedDate
            ? new Date(data.issuedDate).toISOString().split("T")[0]
            : undefined,
          status: data.status,
          studentEmail: data.studentEmail,
          issuerID: data.issuerID,
        });
        setQrCode(data.qrCode as string);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, id, form]);

  return (
    <>
      <div className="degrees">
        <Title>Chi Tiết Bằng Cấp</Title>
        <Form form={form} className="degrees__form" layout="vertical">
          <Form.Item<FieldType>
            label="Tên bằng cấp"
            name="degreeName"
            rules={[{ required: true, message: "Hãy nhập tên bằng cấp!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chuyên ngành"
            name="major"
            rules={[{ required: true, message: "Hãy nhập chuyên ngành!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="GPA"
            name="GPA"
            rules={[{ required: true, message: "Hãy nhập GPA!" }]}
          >
            <Input type="number" step="0.1" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Xếp loại"
            name="classification"
            rules={[{ required: true, message: "Hãy chọn xếp loại!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn xếp loại"
              disabled={true}
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
            <Input type="date" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn trạng thái"
              disabled={true}
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
            <Input type="email" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="ID tổ chức phát hành"
            name="issuerID"
            rules={[
              { required: true, message: "Hãy nhập ID tổ chức phát hành!" },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
        </Form>

        {qrCode && qrCode !== "n" && (
          <>
            <h3>Mã QR</h3>
            <div
              style={{ width: "50%", height: "50%" }}
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default FindDegreePage;

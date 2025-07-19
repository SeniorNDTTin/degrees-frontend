import { toast } from "react-toastify";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { findCertificateByIdApi, updateCertificateApi } from "../../services/certificates";

const { Title } = Typography;

type FieldType = {
  title?: string;
  score?: number;
  scoreDetails?: string;
  issuedDate?: string;
  certHash?: string;
  blockchainTxID?: string;
  status?: string;
  studentEmail?: string;
  issuerID?: string;
  issuerType?: string;
  studentSignature?: string;
  issuerSignature?: string;
};

function UpdateCertificatePage() {
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
        } = await findCertificateByIdApi({ accessToken, id });
        console.log("API Response:", data); // Kiểm tra dữ liệu nhận được
        form.setFieldsValue({
          title: data.title,
          score: data.score,
          scoreDetails: data.scoreDetails,
          issuedDate: data.issuedDate ? new Date(data.issuedDate).toISOString().split("T")[0] : undefined,
          certHash: data.certHash,
          blockchainTxID: data.blockchainTxID,
          status: data.status,
          studentEmail: data.studentEmail,
          issuerID: data.issuerID,
          studentSignature: data.studentSignature,
          issuerSignature: data.issuerSignature,
        });
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, id, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await updateCertificateApi({
        accessToken,
        id,
        title: values.title,
        score: values.score,
        scoreDetails: values.scoreDetails,
        issuedDate: values.issuedDate,
        certHash: values.certHash,
        blockchainTxID: values.blockchainTxID,
        status: values.status,
        studentEmail: values.studentEmail,
        issuerID: values.issuerID,
        issuerType: values.issuerType,
        studentSignature: values.studentSignature,
        issuerSignature: values.issuerSignature,
      });
      navigate("/admin/certificates");
      toast.success("Cập nhật chứng chỉ thành công!");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <div className="certificates">
        <Title>Cập Nhật Chứng Chỉ</Title>
        <Form
          form={form}
          className="certificates__form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Hãy nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Điểm"
            name="score"
            rules={[{ required: true, message: "Hãy nhập điểm!" }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chi tiết điểm"
            name="scoreDetails"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="issuedDate"
            rules={[{ required: true, message: "Hãy nhập ngày phát hành!" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Mã băm chứng chỉ"
            name="certHash"
            rules={[{ required: true, message: "Hãy nhập mã băm chứng chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="ID giao dịch Blockchain"
            name="blockchainTxID"
            rules={[{ required: true, message: "Hãy nhập ID giao dịch Blockchain!" }]}
          >
            <Input />
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
          <Form.Item<FieldType>
            label="Chữ ký học viên"
            name="studentSignature"
            rules={[{ required: true, message: "Hãy nhập chữ ký học viên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chữ ký tổ chức phát hành"
            name="issuerSignature"
            rules={[{ required: true, message: "Hãy nhập chữ ký tổ chức phát hành!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <div className="certificates__form-button">
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

export default UpdateCertificatePage;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Select, Typography } from "antd";
import { toast } from "react-toastify";

import { getCookie } from "../../helpers/cookies";
import { findCertificateByIdApi } from "../../services/certificates";

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

function FindCertificatePage() {
  const [form] = Form.useForm();
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

  return (
    <>
      <div className="certificates">
        <Title>Chi Tiết Chứng Chỉ</Title>
        <Form form={form} className="certificates__form" layout="vertical">
          <Form.Item<FieldType>
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Hãy nhập tiêu đề!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Điểm"
            name="score"
            rules={[{ required: true, message: "Hãy nhập điểm!" }]}
          >
            <Input type="number" step="0.1" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chi tiết điểm"
            name="scoreDetails"
          >
            <Input.TextArea rows={4} disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="issuedDate"
            rules={[{ required: true, message: "Hãy nhập ngày phát hành!" }]}
          >
            <Input type="date" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Mã băm chứng chỉ"
            name="certHash"
            rules={[{ required: true, message: "Hãy nhập mã băm chứng chỉ!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="ID giao dịch Blockchain"
            name="blockchainTxID"
            rules={[{ required: true, message: "Hãy nhập ID giao dịch Blockchain!" }]}
          >
            <Input disabled={true} />
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
            rules={[{ required: true, message: "Hãy nhập ID tổ chức phát hành!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chữ ký học viên"
            name="studentSignature"
            rules={[{ required: true, message: "Hãy nhập chữ ký học viên!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chữ ký tổ chức phát hành"
            name="issuerSignature"
            rules={[{ required: true, message: "Hãy nhập chữ ký tổ chức phát hành!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default FindCertificatePage;
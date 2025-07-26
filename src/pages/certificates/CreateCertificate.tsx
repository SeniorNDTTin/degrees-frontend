import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { createCertificateApi } from "../../services/certificates";

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
  studentSignature?: string;
  issuerSignature?: string;
};

function CreateCertificatePage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await createCertificateApi({
        accessToken,
        title: values.title as string,
        score: values.score as number,
        scoreDetails: values.scoreDetails,
        issuedDate: values.issuedDate as string,
        certHash: values.certHash as string,
        blockchainTxID: values.blockchainTxID as string,
        status: values.status as string,
        studentEmail: values.studentEmail as string,
        issuerID: values.issuerID as string,
        studentSignature: values.studentSignature as string,
        issuerSignature: values.issuerSignature as string,
      });
      navigate("/admin/certificates");
      toast.success("Tạo chứng chỉ thành công!");
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
      <div className="certificates">
        <Title>Tạo Mới Chứng Chỉ</Title>
        <Form
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
          <Form.Item<FieldType> label="Chi tiết điểm" name="scoreDetails">
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
            rules={[
              { required: true, message: "Hãy nhập ID giao dịch Blockchain!" },
            ]}
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
            rules={[
              { required: true, message: "Hãy nhập ID tổ chức phát hành!" },
            ]}
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
            rules={[
              { required: true, message: "Hãy nhập chữ ký tổ chức phát hành!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <div className="certificates__form-button">
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

export default CreateCertificatePage;

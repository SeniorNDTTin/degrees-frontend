import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import {
  findCertificateByIdApi,
  updateCertificateApi,
} from "../../services/certificates";
import { getIssuingAgencies } from "../../services/issuing-agencies";

const { Title } = Typography;

type FieldType = {
  title?: string;
  score?: number;
  scoreDetails?: string;
  issuedDate?: string;
  studentEmail?: string;
  issuerID?: string;
};

function UpdateCertificatePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");

  const location = useLocation();
  const pathnames = location.pathname.split("/");
  const id = pathnames[pathnames.length - 1];
  const [issuingAgencies, setIssuingAgencies] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await getIssuingAgencies({ accessToken });
        setIssuingAgencies(data.issuingAgencies.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken]);

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
          issuedDate: data.issuedDate
            ? new Date(data.issuedDate).toISOString().split("T")[0]
            : undefined,
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
        studentEmail: values.studentEmail,
        issuerID: values.issuerID,
      });
      navigate("/admin/certificates");
      toast.success("Cập nhật chứng chỉ thành công!");
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
            label="Email học viên"
            name="studentEmail"
            rules={[{ required: true, message: "Hãy nhập email học viên!" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Cơ quan"
            name="issuerID"
            rules={[{ required: true, message: "Hãy chọn cơ quan!" }]}
          >
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="Hãy chọn"
              options={issuingAgencies.map((issuingAgency: any) => ({
                label: issuingAgency.name,
                value: issuingAgency._id,
              }))}
            />
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

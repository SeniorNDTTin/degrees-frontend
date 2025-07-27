import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Typography, type FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { createCertificateApi } from "../../services/certificates";
import { useEffect, useState } from "react";
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

function CreateCertificatePage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [issuingAgencies, setIssuingAgencies] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: { data } } = await getIssuingAgencies({ accessToken });
        setIssuingAgencies(data.issuingAgencies.items);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const score = +values.score;

      await createCertificateApi({
        accessToken,
        title: values.title as string,
        score,
        scoreDetails: values.scoreDetails,
        issuedDate: values.issuedDate as string,
        studentEmail: values.studentEmail as string,
        issuerID: values.issuerID as string,
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
            <Input type="number" />
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

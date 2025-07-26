import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, Spin, Select, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { createVerificationApi } from "../../services/verifications";
import { findVerifiersApi } from "../../services/verifiers";
import { findDegreesApi } from "../../services/degrees";
import { findCertificatesApi } from "../../services/certificates";
import type { IVerifier } from "../../interfaces/verifiers";
import type { IDegree } from "../../interfaces/degrees";
import type { ICertificate } from "../../interfaces/certificates";

import "./verification.scss";

const { Title } = Typography;
const { TextArea } = Input;

type FieldType = {
  type: "degree" | "certificate";
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  status: boolean;
  studentEmail: string;
};

function CreateVerificationPage() {
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);
  const [loadingVerifiers, setLoadingVerifiers] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [verifiers, setVerifiers] = useState<IVerifier[]>([]);
  const [degrees, setDegrees] = useState<IDegree[]>([]);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);

  // Fetch verifiers list
  useEffect(() => {
    const fetchVerifiers = async () => {
      setLoadingVerifiers(true);
      try {
        const response = await findVerifiersApi({ accessToken });
        console.log("Verifiers response:", response.data);
        const verifiersData = response.data.data.verifiers.items || [];
        setVerifiers(verifiersData);
      } catch (error) {
        console.error("Error fetching verifiers:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách người xác thực!");
      } finally {
        setLoadingVerifiers(false);
      }
    };
    fetchVerifiers();
  }, [accessToken]);

  // Fetch degrees list
  useEffect(() => {
    const fetchDegrees = async () => {
      setLoadingDegrees(true);
      try {
        const response = await findDegreesApi({ accessToken });
        console.log("Degrees response:", response.data);
        const degreesData = response.data.data.degrees.items || [];
        setDegrees(degreesData);
      } catch (error) {
        console.error("Error fetching degrees:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách văn bằng!");
      } finally {
        setLoadingDegrees(false);
      }
    };
    fetchDegrees();
  }, [accessToken]);

  // Fetch certificates list
  useEffect(() => {
    const fetchCertificates = async () => {
      setLoadingCertificates(true);
      try {
        const response = await findCertificatesApi({ accessToken });
        console.log("Certificates response:", response.data);
        const certificatesData = response.data.data.certificates.items || [];
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách chứng chỉ!");
      } finally {
        setLoadingCertificates(false);
      }
    };
    fetchCertificates();
  }, [accessToken]);

  // Handle degree change
  const handleDegreeChange = async (value: string) => {
    if (!value) return;
    const selectedDegree = degrees.find((d) => d._id === value);
    if (selectedDegree?.studentEmail) {
      form.setFieldsValue({
        studentEmail: selectedDegree.studentEmail,
      });
    }
  };

  // Handle certificate change
  const handleCertificateChange = async (value: string) => {
    if (!value) return;
    const selectedCertificate = certificates.find((c) => c._id === value);
    if (selectedCertificate?.studentEmail) {
      form.setFieldsValue({
        studentEmail: selectedCertificate.studentEmail,
      });
    }
  };

  // Validate student email
  const validateStudentEmail = async (_: any, value: string) => {
    if (!value) {
      throw new Error("Email sinh viên là bắt buộc");
    }

    const type = form.getFieldValue("type");
    const degreeId = form.getFieldValue("degreeId");
    const certificateId = form.getFieldValue("certificateId");

    if (type === "degree" && degreeId) {
      const selectedDegree = degrees.find((d) => d._id === degreeId);
      if (selectedDegree && selectedDegree.studentEmail !== value) {
        throw new Error("Email sinh viên phải khớp với email trong văn bằng");
      }
    } else if (type === "certificate" && certificateId) {
      const selectedCertificate = certificates.find(
        (c) => c._id === certificateId
      );
      if (selectedCertificate && selectedCertificate.studentEmail !== value) {
        throw new Error("Email sinh viên phải khớp với email trong chứng chỉ");
      }
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      await createVerificationApi({
        accessToken,
        ...values,
      });
      toast.success("Tạo mới thành công!");
      navigate("/admin/verifications");
    } catch (error) {
      if (error.status === 403) {
        toast.error("Bạn không có quyền");
        return;
      }

      toast.error("Có lỗi xảy ra khi tạo mới!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-page">
      <div
        className="verification-page__header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Title level={2}>Thêm mới xác thực</Title>
        <Button
          type="primary"
          onClick={() => navigate("/admin/verifications")}
          style={{ borderRadius: "6px" }}
        >
          Quay lại
        </Button>
      </div>

      <div
        className="verification-page__form"
        style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
      >
        <Spin spinning={loading}>
          <Form<FieldType>
            form={form}
            name="create-verification"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            style={{ maxWidth: "none" }}
            initialValues={{
              type: "degree",
              status: false,
            }}
          >
            <Form.Item
              label="Email học viên"
              name="studentEmail"
              rules={[
                { required: true, message: "Hãy nhập email học viên!" },
                { type: "email", message: "Email không hợp lệ!" },
                { validator: validateStudentEmail },
              ]}
            >
              <Input placeholder="Nhập email học viên" disabled />
            </Form.Item>

            <Form.Item
              label="Loại xác thực"
              name="type"
              rules={[{ required: true, message: "Hãy chọn loại xác thực!" }]}
            >
              <Select>
                <Select.Option value="degree">Văn bằng</Select.Option>
                <Select.Option value="certificate">Chứng chỉ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Người xác thực"
              name="verifierId"
              rules={[{ required: true, message: "Hãy chọn người xác thực!" }]}
            >
              <Select
                loading={loadingVerifiers}
                placeholder="Chọn người xác thực"
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {verifiers.map((v) => (
                  <Select.Option key={v._id} value={v._id}>
                    {v.verifierName} - {v.organization}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("type") === "degree" ? (
                  <Form.Item
                    label="Văn bằng"
                    name="degreeId"
                    rules={[{ required: true, message: "Hãy chọn văn bằng!" }]}
                  >
                    <Select
                      loading={loadingDegrees}
                      placeholder="Chọn văn bằng"
                      showSearch
                      onChange={handleDegreeChange}
                      filterOption={(input, option) =>
                        (option?.children?.toString() ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {degrees.map((d) => (
                        <Select.Option key={d._id} value={d._id}>
                          {d.degreeName} - {d.major} ({d.studentEmail})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="Chứng chỉ"
                    name="certificateId"
                    rules={[{ required: true, message: "Hãy chọn chứng chỉ!" }]}
                  >
                    <Select
                      loading={loadingCertificates}
                      placeholder="Chọn chứng chỉ"
                      showSearch
                      onChange={handleCertificateChange}
                      filterOption={(input, option) =>
                        (option?.children?.toString() ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {certificates.map((c) => (
                        <Select.Option key={c._id} value={c._id}>
                          {c.title} - Điểm: {c.score} ({c.studentEmail})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )
              }
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả" />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ minWidth: "100px", borderRadius: "6px" }}
              >
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}

export default CreateVerificationPage;

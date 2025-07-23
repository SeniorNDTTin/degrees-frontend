import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, Spin, Select, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { FormProps } from "antd";

import { getCookie } from "../../helpers/cookies";
import { findVerificationByIdApi, updateVerificationApi } from "../../services/verifications";
import { findVerifiersApi, findVerifierByIdApi } from "../../services/verifiers";
import { findDegreesApi, findDegreeByIdApi } from "../../services/degrees";
import { findCertificatesApi, findCertificateByIdApi } from "../../services/certificates";
import type { IVerification } from "../../interfaces/verifications";
import type { IVerifier } from "../../interfaces/verifiers";
import type { IDegree } from "../../interfaces/degrees";
import type { ICertificate } from "../../interfaces/certificates";

import "./verification.scss";

const { Title } = Typography;
const { TextArea } = Input;

type FieldType = {
  type: 'degree' | 'certificate';
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  status: boolean;
  studentEmail: string;
};

interface FormData {
  type: 'degree' | 'certificate';
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  status: boolean;
  studentEmail: string;
}

function UpdateVerificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);
  const [loadingVerifiers, setLoadingVerifiers] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [verification, setVerification] = useState<IVerification | null>(null);
  const [verifier, setVerifier] = useState<IVerifier | null>(null);
  const [verifiers, setVerifiers] = useState<IVerifier[]>([]);
  const [degree, setDegree] = useState<IDegree | null>(null);
  const [degrees, setDegrees] = useState<IDegree[]>([]);
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);

  // Fetch verifiers list
  useEffect(() => {
    const fetchVerifiers = async () => {
      setLoadingVerifiers(true);
      try {
        const response = await findVerifiersApi({ accessToken });
        console.log('Verifiers response:', response.data);
        const verifiersData = response.data.data.verifiers.items || [];
        setVerifiers(verifiersData);
      } catch (error) {
        console.error('Error fetching verifiers:', error);
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
        console.log('Degrees response:', response.data);
        const degreesData = response.data.data.degrees.items || [];
        setDegrees(degreesData);
      } catch (error) {
        console.error('Error fetching degrees:', error);
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
        console.log('Certificates response:', response.data);
        const certificatesData = response.data.data.certificates.items || [];
        setCertificates(certificatesData);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        toast.error("Có lỗi xảy ra khi tải danh sách chứng chỉ!");
      } finally {
        setLoadingCertificates(false);
      }
    };
    fetchCertificates();
  }, [accessToken]);

  // Fetch verification details
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch verification details
        const verificationResponse = await findVerificationByIdApi({ accessToken, id });
        console.log('Verification response:', verificationResponse.data);
        
        if (verificationResponse.data?.data) {
          const verificationData = verificationResponse.data.data;
          setVerification(verificationData);

          // Fetch degree/certificate details based on type
          let studentEmail;
          if (verificationData.type === 'degree' && verificationData.degreeId) {
            try {
              const degreeResponse = await findDegreeByIdApi({
                accessToken,
                id: verificationData.degreeId
              });
              if (degreeResponse.data?.data) {
                const degreeData = degreeResponse.data.data;
                setDegree(degreeData);
                studentEmail = degreeData.studentEmail;
                // Add degree to degrees list if not exists
                setDegrees(prev => {
                  if (!prev.find(d => d._id === degreeData._id)) {
                    return [...prev, degreeData];
                  }
                  return prev;
                });
              }
            } catch (error) {
              console.error('Error fetching degree:', error);
            }
          } else if (verificationData.type === 'certificate' && verificationData.certificateId) {
            try {
              const certificateResponse = await findCertificateByIdApi({
                accessToken,
                id: verificationData.certificateId
              });
              if (certificateResponse.data?.data) {
                const certificateData = certificateResponse.data.data;
                setCertificate(certificateData);
                studentEmail = certificateData.studentEmail;
                // Add certificate to certificates list if not exists
                setCertificates(prev => {
                  if (!prev.find(c => c._id === certificateData._id)) {
                    return [...prev, certificateData];
                  }
                  return prev;
                });
              }
            } catch (error) {
              console.error('Error fetching certificate:', error);
            }
          }

          // Fetch verifier details
          if (verificationData.verifierId) {
            try {
              const verifierResponse = await findVerifierByIdApi({ 
                accessToken, 
                id: verificationData.verifierId 
              });
              if (verifierResponse.data?.data) {
                const verifierData = verifierResponse.data.data;
                setVerifier(verifierData);
                // Add verifier to verifiers list if not exists
                setVerifiers(prev => {
                  if (!prev.find(v => v._id === verifierData._id)) {
                    return [...prev, verifierData];
                  }
                  return prev;
                });
              }
            } catch (error) {
              console.error('Error fetching verifier:', error);
            }
          }

          // Set form values
          const formValues = {
            type: verificationData.type,
            verifierId: verificationData.verifierId,
            degreeId: verificationData.degreeId,
            certificateId: verificationData.certificateId,
            description: verificationData.description,
            status: verificationData.status,
            studentEmail
          };
          console.log('Setting form values:', formValues);
          form.setFieldsValue(formValues);
        }
      } catch (error) {
        console.error('Error fetching verification:', error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu xác thực!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, accessToken, form]);

  // Validate student email
  const validateStudentEmail = async (_: any, value: string) => {
    if (!value) {
      throw new Error('Email sinh viên là bắt buộc');
    }

    const type = form.getFieldValue('type');
    console.log('Current type:', type);

    // Only validate based on current type
    if (type === 'degree') {
      const degreeId = form.getFieldValue('degreeId');
      if (!degreeId) return; // Skip validation if no degree selected

      const selectedDegree = degrees.find(d => d._id === degreeId);
      console.log('Selected degree:', selectedDegree);
      if (selectedDegree && selectedDegree.studentEmail !== value) {
        throw new Error('Email sinh viên phải khớp với email trong văn bằng');
      }
    } else if (type === 'certificate') {
      const certificateId = form.getFieldValue('certificateId');
      if (!certificateId) return; // Skip validation if no certificate selected

      const selectedCertificate = certificates.find(c => c._id === certificateId);
      console.log('Selected certificate:', selectedCertificate);
      if (selectedCertificate && selectedCertificate.studentEmail !== value) {
        throw new Error('Email sinh viên phải khớp với email trong chứng chỉ');
      }
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log('Form submitted with values:', values);
    console.log('Current form values:', form.getFieldsValue());
    
    setLoading(true);
    try {
      // Prepare form data
      const formData: FormData = {
        type: values.type,
        verifierId: values.verifierId,
        description: values.description,
        status: values.status,
        studentEmail: values.studentEmail
      };

      // Add degreeId or certificateId based on type
      if (values.type === 'degree') {
        formData.degreeId = values.degreeId;
        // Make sure to remove certificateId if it exists
        delete formData.certificateId;
      } else {
        formData.certificateId = values.certificateId;
        // Make sure to remove degreeId if it exists
        delete formData.degreeId;
      }

      console.log('Sending data to API:', formData);

      // Update verification
      await updateVerificationApi({
        accessToken,
        id: id as string,
        ...formData
      });

      toast.success("Cập nhật thành công!");
      navigate("/admin/verifications");
    } catch (error) {
      console.error('Error updating verification:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật!";
        toast.error(errorMessage);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle type change
  const handleTypeChange = (value: 'degree' | 'certificate') => {
    console.log('Type changed to:', value);
    // Clear degreeId/certificateId and studentEmail when type changes
    if (value === 'degree') {
      form.setFieldsValue({
        certificateId: undefined,
        degreeId: undefined,
        studentEmail: ''
      });
    } else {
      form.setFieldsValue({
        degreeId: undefined,
        certificateId: undefined,
        studentEmail: ''
      });
    }
  };

  // Handle degree change
  const handleDegreeChange = async (value: string) => {
    console.log('Degree changed to:', value);
    if (!value) {
      form.setFieldsValue({ studentEmail: '' });
      return;
    }
    const selectedDegree = degrees.find(d => d._id === value);
    console.log('Selected degree:', selectedDegree);
    if (selectedDegree?.studentEmail) {
      form.setFieldsValue({
        studentEmail: selectedDegree.studentEmail
      });
    }
  };

  // Handle certificate change
  const handleCertificateChange = async (value: string) => {
    console.log('Certificate changed to:', value);
    if (!value) {
      form.setFieldsValue({ studentEmail: '' });
      return;
    }
    const selectedCertificate = certificates.find(c => c._id === value);
    console.log('Selected certificate:', selectedCertificate);
    if (selectedCertificate?.studentEmail) {
      form.setFieldsValue({
        studentEmail: selectedCertificate.studentEmail
      });
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-page__header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Title level={2}>Cập nhật xác thực</Title>
        <Button 
          type="primary"
          onClick={() => navigate("/admin/verifications")}
          style={{ borderRadius: '6px' }}
        >
          Quay lại
        </Button>
      </div>

      <div className="verification-page__form" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Spin spinning={loading}>
          <Form<FieldType>
            form={form}
            name="update-verification"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            style={{ maxWidth: 'none' }}
            initialValues={{
              type: 'degree',
              status: false
            }}
          >
            <Form.Item
              label="Email học viên"
              name="studentEmail"
              rules={[
                { required: true, message: "Hãy nhập email học viên!" },
                { type: "email", message: "Email không hợp lệ!" },
                { validator: validateStudentEmail }
              ]}
            >
              <Input placeholder="Nhập email học viên" disabled />
            </Form.Item>

            <Form.Item
              label="Loại xác thực"
              name="type"
              rules={[{ required: true, message: "Hãy chọn loại xác thực!" }]}
            >
              <Select onChange={handleTypeChange}>
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
                  (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
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
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => 
                getFieldValue('type') === 'degree' ? (
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
                        (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
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
                        (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
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

            <Form.Item
              label="Trạng thái"
              name="status"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ minWidth: '100px', borderRadius: '6px' }}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}

export default UpdateVerificationPage; 
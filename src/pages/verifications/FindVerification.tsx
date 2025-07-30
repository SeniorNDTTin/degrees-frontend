import { useEffect, useState } from "react";
import { Button, Typography, Spin, Descriptions, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCookie } from "../../helpers/cookies";
import { findVerificationByIdApi } from "../../services/verifications";
import { findVerifierByIdApi } from "../../services/verifiers";
import { findDegreeByIdApi } from "../../services/degrees";
import { findCertificateByIdApi } from "../../services/certificates";
import { findUserByIdApi } from "../../services/users";
import type { IVerification } from "../../interfaces/verifications";
import type { IVerifier } from "../../interfaces/verifiers";
import type { IDegree } from "../../interfaces/degrees";
import type { ICertificate } from "../../interfaces/certificates";
import type { IUser } from "../../interfaces/users";

import "./verification.scss";

const { Title } = Typography;

interface UserInfo {
  userId: string;
  userName: string;
  timestamp: string;
}

function FindVerificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<IVerification | null>(null);
  const [verifier, setVerifier] = useState<IVerifier | null>(null);
  const [degree, setDegree] = useState<IDegree | null>(null);
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const [creator, setCreator] = useState<UserInfo | null>(null);
  const [updaters, setUpdaters] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch verification details
        const verificationResponse = await findVerificationByIdApi({
          accessToken,
          id,
        });
        const verificationData = verificationResponse.data.data;
        setVerification(verificationData);

        // Fetch verifier details
        if (verificationData.verifierId) {
          try {
            const verifierResponse = await findVerifierByIdApi({
              accessToken,
              id: verificationData.verifierId,
            });
            if (verifierResponse.data?.data) {
              setVerifier(verifierResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching verifier:", error);
          }
        }

        // Fetch degree/certificate details
        if (verificationData.type === "degree" && verificationData.degreeId) {
          try {
            const degreeResponse = await findDegreeByIdApi({
              accessToken,
              id: verificationData.degreeId,
            });
            if (degreeResponse.data?.data) {
              setDegree(degreeResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching degree:", error);
          }
        } else if (
          verificationData.type === "certificate" &&
          verificationData.certificateId
        ) {
          try {
            const certificateResponse = await findCertificateByIdApi({
              accessToken,
              id: verificationData.certificateId,
            });
            if (certificateResponse.data?.data) {
              setCertificate(certificateResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching certificate:", error);
          }
        }

        // Fetch creator info
        if (verificationData.createdBy?.userId) {
          try {
            const creatorResponse = await findUserByIdApi({
              accessToken,
              id: verificationData.createdBy.userId,
            });
            if (creatorResponse.data?.data) {
              setCreator({
                userId: verificationData.createdBy.userId,
                userName: creatorResponse.data.data.fullName,
                timestamp: verificationData.createdBy.createdAt,
              });
            }
          } catch (error) {
            console.error("Error fetching creator:", error);
          }
        }

        // Fetch updaters info
        if (
          verificationData.updatedBy &&
          verificationData.updatedBy.length > 0
        ) {
          try {
            const updaterInfos = await Promise.all(
              verificationData.updatedBy.map(async (update) => {
                const updaterResponse = await findUserByIdApi({
                  accessToken,
                  id: update.userId,
                });
                return {
                  userId: update.userId,
                  userName: updaterResponse.data?.data?.fullName || "Unknown",
                  timestamp: update.updatedAt,
                };
              })
            );
            setUpdaters(updaterInfos);
          } catch (error) {
            console.error("Error fetching updaters:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching verification:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, accessToken]);

  return (
    <div className="verification-page">
      <div className="verification-page__header">
        <Title level={2}>Chi tiết xác thực</Title>
        <Button type="primary" onClick={() => navigate("/admin/verifications")}>
          Quay lại
        </Button>
      </div>

      <Spin spinning={loading}>
        <div className="verification-page__content">
          {verification && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã giấy tờ">
                {degree?._id || certificate?._id || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Email học viên">
                {degree?.studentEmail || certificate?.studentEmail || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Loại xác thực">
                {verification.type === "degree" ? "Văn bằng" : "Chứng chỉ"}
              </Descriptions.Item>

              <Descriptions.Item label="Người xác thực">
                {verifier
                  ? `${verifier.verifierName} - ${verifier.organization}`
                  : "Không có thông tin"}
              </Descriptions.Item>

              {verification.type === "degree" ? (
                <Descriptions.Item label="Văn bằng">
                  {degree
                    ? `${degree.degreeName} - ${degree.major}`
                    : "Không có thông tin"}
                </Descriptions.Item>
              ) : (
                <Descriptions.Item label="Chứng chỉ">
                  {certificate
                    ? `${certificate.title} - Điểm: ${certificate.score}`
                    : "Không có thông tin"}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Mô tả">
                {verification.description}
              </Descriptions.Item>

              {creator && (
                <Descriptions.Item label="Người tạo">
                  {creator.userName} -{" "}
                  {new Date(creator.timestamp).toLocaleString()}
                </Descriptions.Item>
              )}

              {updaters.length > 0 && (
                <Descriptions.Item label="Người cập nhật">
                  {updaters.map((updater, index) => (
                    <div key={index}>
                      {updater.userName} -{" "}
                      {new Date(updater.timestamp).toLocaleString()}
                    </div>
                  ))}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </div>
      </Spin>
    </div>
  );
}

export default FindVerificationPage;

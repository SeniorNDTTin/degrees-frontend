import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Descriptions, Typography } from "antd";
import { toast } from "react-toastify";

import { getCookie } from "../../helpers/cookies";
import type { IVerifier } from "../../interfaces/verifiers";
import { findVerifierByIdApi } from "../../services/verifiers";

const { Title } = Typography;

function FindVerifierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [verifier, setVerifier] = useState<IVerifier | null>(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await findVerifierByIdApi({ accessToken, id: id as string });
        setVerifier(data);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, id]);

  return (
    <>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <Title>Chi tiết người xác thực</Title>
          <Button type="primary" onClick={() => navigate("/admin/verifiers")}>
            Quay lại
          </Button>
        </div>

        {verifier && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên người xác thực">
              {verifier.verifierName}
            </Descriptions.Item>
            <Descriptions.Item label="Tổ chức">
              {verifier.organization}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {verifier.verifierEmail}
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    </>
  );
}

export default FindVerifierPage; 
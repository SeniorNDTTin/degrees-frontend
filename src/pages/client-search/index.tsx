import { useState } from "react";
import { getCookie } from "../../helpers/cookies";
import { findDegreeByDegreeHash } from "../../services/degrees";
import { findCertificateByCertificateHash } from "../../services/certificates";
import { toast } from "react-toastify";

import type { IDegree } from "../../interfaces/degrees";
import type { ICertificate } from "../../interfaces/certificates";

import "./SearchClient.scss";

function ClientSearch() {
  const [hash, setHash] = useState("");
  const accessToken = getCookie("access_token");
  const [isDegree, setIsDegree] = useState(false);
  const [degree, setDegree] = useState<IDegree>();
  const [certificate, setCertificate] = useState<ICertificate>();

  const handleSearch = async () => {
    setDegree(undefined);
    setCertificate(undefined);

    try {
      const {
        data: { data },
      } = await findDegreeByDegreeHash({
        accessToken,
        degreeHash: hash,
      });

      setIsDegree(true);
      setDegree(data);
    } catch (error: any) {
      const status = error.status as number;

      if (status !== 404) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }

      try {
        const {
          data: { data },
        } = await findCertificateByCertificateHash({
          accessToken,
          certificateHash: hash,
        });

        setIsDegree(false);
        setCertificate(data);
      } catch {
        toast.error("Không tìm thấy thông tin phù hợp!");
      }
    }
  };

  const formatDate = (iso: string | Date) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <>
      <div className="search-client-container">
        <h1>Tra cứu văn bằng / chứng chỉ</h1>
        <p>
          Vui lòng nhập mã băm (hash) được gửi qua email để tra cứu thông tin.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Nhập mã băm..."
            value={hash}
            onChange={(e) => setHash(e.target.value.trim())}
          />
          <button onClick={handleSearch} disabled={!hash}>
            Tìm kiếm
          </button>
        </div>
      </div>

      <div>
        {(degree || certificate) && (
          <div className="result-panel">
            {isDegree && degree && (
              <>
                <h2 style={{ textAlign: "center" }}>Thông tin Văn bằng</h2>
                <ul className="info-list">
                  <li>
                    <strong>Tên văn bằng:</strong> {degree.degreeName}
                  </li>
                  <li>
                    <strong>Chuyên ngành:</strong> {degree.major}
                  </li>
                  <li>
                    <strong>GPA:</strong> {degree.GPA.toFixed(2)}
                  </li>
                  <li>
                    <strong>Xếp loại:</strong> {degree.classification}
                  </li>
                  <li>
                    <strong>Ngày cấp:</strong> {formatDate(degree.issuedDate)}
                  </li>
                  <li>
                    <strong>Trạng thái:</strong> {degree.status}
                  </li>
                  <li>
                    <strong>Email sinh viên:</strong> {degree.studentEmail}
                  </li>
                  <li>
                    <strong>Issuer ID:</strong> {degree.issuerID}
                  </li>
                  <li>
                    <strong>Tên nhà phát hành:</strong>{" "}
                    {degree.issuingAgencyName}
                  </li>
                  <li>
                    <strong>Degree Hash:</strong> {degree.degreeHash}
                  </li>
                  {degree.qrCode && (
                    <li>
                      <strong>QR Code:</strong>
                      <div
                        style={{ width: "30%", height: "30%" }}
                        className="qr-code"
                        dangerouslySetInnerHTML={{ __html: degree.qrCode }}
                      />
                    </li>
                  )}
                </ul>
              </>
            )}

            {!isDegree && certificate && (
              <>
                <h2 style={{ textAlign: "center" }}>Thông tin Chứng chỉ</h2>
                <ul className="info-list">
                  <li>
                    <strong>Tiêu đề:</strong> {certificate.title}
                  </li>
                  <li>
                    <strong>Điểm:</strong> {certificate.score}
                  </li>
                  {certificate.scoreDetails && (
                    <li>
                      <strong>Chi tiết điểm:</strong> {certificate.scoreDetails}
                    </li>
                  )}
                  <li>
                    <strong>Ngày cấp:</strong>{" "}
                    {formatDate(certificate.issuedDate)}
                  </li>
                  <li>
                    <strong>Trạng thái:</strong> {certificate.status}
                  </li>
                  <li>
                    <strong>Email sinh viên:</strong> {certificate.studentEmail}
                  </li>
                  <li>
                    <strong>Issuer ID:</strong> {certificate.issuerID}
                  </li>
                  <li>
                    <strong>Tên nhà phát hành:</strong>{" "}
                    {certificate.issuingAgencyName}
                  </li>
                  <li>
                    <strong>Certificate Hash:</strong>{" "}
                    {certificate.certificateHash}
                  </li>
                  {certificate.qrCode && (
                    <li>
                      <strong>QR Code:</strong>
                      <div
                        style={{ width: "30%", height: "30%" }}
                        className="qr-code"
                        dangerouslySetInnerHTML={{ __html: certificate.qrCode }}
                      />
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ClientSearch;

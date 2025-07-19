
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="footer__content">
        <div className="footer__left">
          © {new Date().getFullYear()} Hệ thống quản lý văn bằng - Bộ Giáo dục và Đào tạo
        </div>
        <div className="footer__right">
          <a href="/privacy">Chính sách bảo mật</a> |{" "}
          <a href="/terms">Điều khoản</a> |{" "}
          <span>Phiên bản: v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;

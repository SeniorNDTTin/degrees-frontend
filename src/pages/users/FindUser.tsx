import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Descriptions, Typography, Spin, Tag } from "antd";

import { getCookie } from "../../helpers/cookies";
import { findUserByIdApi } from "../../services/users";
import type { IUser } from "../../interfaces/users";

const { Title } = Typography;

interface UserInfo {
  userId: string;
  userName: string;
  timestamp: string;
}

function FindUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = getCookie("access_token");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser>();
  const [userInfoMap, setUserInfoMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchApi = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Lấy thông tin user chính
        const userResponse = await findUserByIdApi({ accessToken, id });
        const userData = userResponse.data.data;
        setUser(userData);

        // Tạo danh sách các userId cần lấy thông tin
        const userIds = new Set<string>();
        if (userData.createdBy?.userId) userIds.add(userData.createdBy.userId);
        if (userData.updatedBy?.length > 0) {
          userData.updatedBy.forEach(update => userIds.add(update.userId));
        }
        if (userData.deletedBy?.userId) userIds.add(userData.deletedBy.userId);

        // Lấy thông tin tất cả users một lần
        const userInfoPromises = Array.from(userIds).map(async (userId) => {
          try {
            const response = await findUserByIdApi({ accessToken, id: userId });
            return [userId, response.data.data.fullName];
          } catch (error) {
            return [userId, "Người dùng không tồn tại"];
          }
        });

        const userInfoResults = await Promise.all(userInfoPromises);
        const newUserInfoMap = Object.fromEntries(userInfoResults);
        setUserInfoMap(newUserInfoMap);

      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, id]);

  const formatUserInfo = (userId: string | undefined, timestamp: string | undefined) => {
    if (!userId || !timestamp) return "N/A";
    return (
      <div>
        <div>
          <span style={{ 
            color: userInfoMap[userId] === "Người dùng không tồn tại" ? "#ff4d4f" : "inherit" 
          }}>
            {userInfoMap[userId] || `ID: ${userId}`}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {new Date(timestamp).toLocaleString("vi-VN")}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title>Chi tiết người dùng</Title>
        <Button type="primary" onClick={() => navigate("/admin/users")}>
          Quay lại
        </Button>
      </div>

      <Spin spinning={loading}>
        {user && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {user.gender === "female" ? "Nữ" : "Nam"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={user.isDeleted ? "red" : "green"}>
                {user.isDeleted ? "Đã xóa" : "Đang hoạt động"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Người tạo">
              {formatUserInfo(user.createdBy?.userId, user.createdBy?.createdAt)}
            </Descriptions.Item>
            {user.updatedBy && user.updatedBy.length > 0 && (
              <Descriptions.Item label="Cập nhật cuối">
                {formatUserInfo(
                  user.updatedBy[user.updatedBy.length - 1].userId,
                  user.updatedBy[user.updatedBy.length - 1].updatedAt
                )}
              </Descriptions.Item>
            )}
            {user.deletedBy && (
              <Descriptions.Item label="Người xóa">
                {formatUserInfo(user.deletedBy.userId, user.deletedBy.deletedAt)}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Spin>
    </div>
  );
}

export default FindUserPage; 
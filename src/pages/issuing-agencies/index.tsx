import { useEffect, useState } from "react";
import { Table, Button, Input, Typography, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { IIssuingAgency } from "../../interfaces/issuing-agencies";
import {
  deleteIssuingAgency,
  getIssuingAgencies,
} from "../../services/issuing-agencies";
import { getCookie } from "../../helpers/cookies";
import "./issuing-agencies.scss";

const { Title } = Typography;

interface DataType extends IIssuingAgency {
  key: string;
}

const IssuingAgencies = () => {
  const navigate = useNavigate();
  const [issuingAgencies, setIssuingAgencies] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const accessToken = getCookie("access_token");

  const fetchIssuingAgencies = async () => {
    try {
      setLoading(true);
      const response = await getIssuingAgencies({
        accessToken,
        page,
        limit: 10,
        searchKey,
      });

      console.log("API Response:", response);

      const { data: { data: { issuingAgencies } } } = response;
      if (issuingAgencies?.items) {
        const { items, total } = issuingAgencies;
        console.log("Issuing Agencies data:", { items, total });
        setIssuingAgencies(items.map((item) => ({ ...item, key: item._id })));
        setTotal(total);
      } else {
        console.error("Invalid response format:", response);
        toast.error("Dữ liệu không hợp lệ!");
      }
    } catch (error: any) {
      console.error("Error fetching issuing agencies:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchIssuingAgencies();
    }
  }, [page, searchKey, accessToken]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) {
      return;
    }

    try {
      await deleteIssuingAgency({ accessToken, id });
      toast.success("Xóa thành công!");
      fetchIssuingAgencies();
    } catch (error: any) {
      console.error("Error deleting issuing agency:", error);
      if (error?.response?.status === 403) {
        toast.error("Bạn không có quyền thực hiện thao tác này!");
        return;
      } else if (error?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn!");
        navigate("/login");
        return;
      }

      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa!");
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tên cơ sở",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || "Chưa cập nhật",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text ? <a href={`mailto:${text}`}>{text}</a> : "Chưa cập nhật",
    },
    {
      title: "Địa chỉ",
      dataIndex: "location",
      key: "location",
      render: (text: string) => text || "Chưa cập nhật",
    },
    {
      title: "Loại cơ sở",
      dataIndex: "isUniversity",
      key: "isUniversity",
      render: (isUniversity: boolean | undefined) => (
        <Tag color={isUniversity === undefined ? "default" : isUniversity ? "blue" : "orange"}>
          {isUniversity === undefined ? "Chưa cập nhật" : isUniversity ? "Trường đại học" : "Trung tâm đào tạo"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              if (!record._id) {
                toast.error("Không tìm thấy ID cơ quan!");
                return;
              }
              navigate(`/admin/issuing-agencies/find/${record._id}`);
            }}
          >
            Xem
          </Button>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              borderColor: "orange",
            }}
            onClick={() => {
              if (!record._id) {
                toast.error("Không tìm thấy ID cơ quan!");
                return;
              }
              navigate(`/admin/issuing-agencies/update/${record._id}`);
            }}
          >
            Sửa
          </Button>
          <Button 
            danger 
            onClick={() => {
              if (!record._id) {
                toast.error("Không tìm thấy ID cơ quan!");
                return;
              }
              handleDelete(record._id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="issuing-agencies-page">
      <div className="issuing-agencies-page__header">
        <Title level={2}>Danh sách cơ sở cấp bằng</Title>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tên..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onSearch={() => {
              setPage(1);
              fetchIssuingAgencies();
            }}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => navigate("/admin/issuing-agencies/create")}
          >
            Tạo mới
          </Button>
        </Space>
      </div>

      <div className="issuing-agencies-page__table">
        <Table
          columns={columns}
          dataSource={issuingAgencies}
          loading={loading}
          pagination={{
            total,
            current: page,
            onChange: (newPage) => setPage(newPage),
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
          }}
        />
      </div>
    </div>
  );
};

export default IssuingAgencies;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Badge,
  Empty,
  Form,
  Input,
  Select,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { toast } from "react-toastify";

import { getCookie } from "../../helpers/cookies";
import { findDegreeByIdApi } from "../../services/degrees";
import { findBlocksApi, getBlocksQuantityApi } from "../../services/block";
import type { IBlock } from "../../interfaces/block";
import type { ColumnsType } from "antd/es/table";
import { findUserByIdApi } from "../../services/users";

const { Title } = Typography;

type FieldType = {
  degreeName?: string;
  major?: string;
  GPA?: number;
  classification?: string;
  issuedDate?: string;
  status?: string;
  studentEmail?: string;
  issuerID?: string;
};

function FindDegreePage() {
  const [form] = Form.useForm();
  const [qrCode, setQrCode] = useState("");
  const accessToken = getCookie("access_token");

  const location = useLocation();
  const pathnames = location.pathname.split("/");
  const id = pathnames[pathnames.length - 1];

  const [blocksQuantity, setBlocksQuantity] = useState(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await findDegreeByIdApi({ accessToken, id });
        form.setFieldsValue({
          degreeName: data.degreeName,
          major: data.major,
          GPA: data.GPA,
          classification: data.classification,
          issuedDate: data.issuedDate
            ? new Date(data.issuedDate).toISOString().split("T")[0]
            : undefined,
          status: data.status,
          studentEmail: data.studentEmail,
          issuerID: data.issuerID,
        });
        setQrCode(data.qrCode as string);
      } catch {
        toast.error("Có lỗi xảy ra!");
      }
    };
    fetchApi();
  }, [accessToken, id, form]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await getBlocksQuantityApi({
          accessToken,
          collection: "degrees",
          collectionId: id,
        });

        setBlocksQuantity(data.quantity);
      } catch {
        toast.error("Có lỗi xảy ra");
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const {
          data: { data },
        } = await findBlocksApi({
          accessToken,
          collection: "degrees",
          collectionId: id,
        });

        const { items } = data.blocks;

        for (const item of items) {
          const user = await findUserByIdApi({ accessToken, id: item.data.userId });
          item.data.userName = user.data.data.fullName;
        }

        setBlocks(items);
      } catch {
        toast.error("Có lỗi xảy ra");
      }
    };
    fetchApi();
  }, []);

  const columns: ColumnsType<IBlock> = [
    {
      title: "Previous Hash",
      dataIndex: "previousHash",
      key: "previousHash",
      render: (text: string) => (
        <Tooltip title={text}>
          <Typography.Text
            copyable
            ellipsis
            style={{ maxWidth: 200, display: "inline-block" }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Current Hash",
      dataIndex: "currentHash",
      key: "currentHash",
      render: (text: string) => (
        <Tooltip title={text}>
          <Typography.Text
            copyable
            ellipsis
            style={{ maxWidth: 200, display: "inline-block" }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Collection",
      dataIndex: ["data", "collection"],
      key: "collection",
    },
    {
      title: "Collection ID",
      dataIndex: ["data", "collectionId"],
      key: "collectionId",
      render: (text: string) => (
        <Tooltip title={text}>
          <Typography.Text
            copyable
            ellipsis
            style={{ maxWidth: 180, display: "inline-block" }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "User ID",
      dataIndex: ["data", "userId"],
      key: "userId",
      render: (text: string) => (
        <Tooltip title={text}>
          <Typography.Text
            copyable
            ellipsis
            style={{ maxWidth: 180, display: "inline-block" }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "User Name",
      dataIndex: ["data", "userName"],
      key: "userName",
      render: (text) => text,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <>
      <div className="degrees">
        <Title>Chi Tiết Bằng Cấp</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge count={blocksQuantity} showZero color="#faad14" />
          <p style={{ marginLeft: "2px" }}>Blocks</p>
        </div>

        <Form form={form} className="degrees__form" layout="vertical">
          <Form.Item<FieldType>
            label="Tên bằng cấp"
            name="degreeName"
            rules={[{ required: true, message: "Hãy nhập tên bằng cấp!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Chuyên ngành"
            name="major"
            rules={[{ required: true, message: "Hãy nhập chuyên ngành!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="GPA"
            name="GPA"
            rules={[{ required: true, message: "Hãy nhập GPA!" }]}
          >
            <Input type="number" step="0.1" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Xếp loại"
            name="classification"
            rules={[{ required: true, message: "Hãy chọn xếp loại!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn xếp loại"
              disabled={true}
              options={[
                { label: "Xuất sắc", value: "Excellent" },
                { label: "Giỏi", value: "Good" },
                { label: "Trung bình", value: "Average" },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="issuedDate"
            rules={[{ required: true, message: "Hãy nhập ngày phát hành!" }]}
          >
            <Input type="date" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn trạng thái"
              disabled={true}
              options={[
                { label: "Active", value: "Active" },
                { label: "Revoked", value: "Revoked" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email học viên"
            name="studentEmail"
            rules={[{ required: true, message: "Hãy nhập email học viên!" }]}
          >
            <Input type="email" disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="ID tổ chức phát hành"
            name="issuerID"
            rules={[
              { required: true, message: "Hãy nhập ID tổ chức phát hành!" },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
        </Form>

        {qrCode && qrCode !== "n" && (
          <>
            <h3>Mã QR</h3>
            <div
              style={{ width: "50%", height: "50%" }}
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          </>
        )}

        <div style={{ padding: 24 }}>
          <Title level={3}>Danh sách Blocks</Title>
          {blocks.length > 0 ? (
            <Table
              dataSource={blocks}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <Empty description="Không có dữ liệu block" />
          )}
        </div>
      </div>
    </>
  );
}

export default FindDegreePage;

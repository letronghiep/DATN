import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createBanner, getBannerById, updateBanner } from "~/services/banner";
import { uploadImage } from "~/services/upload";

const BannerForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (location.pathname.includes('create')) {
      form.resetFields();
      setImageUrl("");
    } else if (id) {
      fetchBanner();
    }
  }, [id, location.pathname]);

  const fetchBanner = async () => {
    try {
      const response = await getBannerById(id);
      const banner = response.metadata;
      form.setFieldsValue({
        title: banner.title,
        linkTo: banner.linkTo,
      });
      setImageUrl(banner.thumb);
    } catch (error) {
      console.error("Lỗi khi tải thông tin banner:", error);
      message.error("Không thể tải thông tin banner");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        title: values.title,
        linkTo: values.linkTo,
        thumb: imageUrl,
      };

      if (id) {
        await updateBanner(id, data);
        message.success("Cập nhật banner thành công");
      } else {
        await createBanner(data);
        message.success("Thêm banner thành công");
      }
      navigate("/seller/banners");
    } catch (error) {
      console.error("Lỗi khi lưu banner:", error);
      message.error(id ? "Không thể cập nhật banner" : "Không thể thêm banner");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImage(formData);
      setImageUrl(response.metadata.thumb);
      return false;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      message.error("Không thể tải ảnh lên");
      return false;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Cập nhật Banner" : "Thêm Banner mới"}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-2xl"
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Link"
          name="linkTo"
          rules={[{ required: true, message: "Vui lòng nhập link" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="banner"
              className="mt-2"
              style={{ maxWidth: 200 }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {id ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BannerForm; 
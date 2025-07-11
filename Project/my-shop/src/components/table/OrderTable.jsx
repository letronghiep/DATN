import { formatDate } from "@fullcalendar/core/index.js";
import { Button, Modal, notification, Select, Table, Tag } from "antd";
import { useState } from "react";
import { useUpdateStatusMutation } from "../../apis/ordersApi";

const OrderTable = ({ data, limit, setCurrentPage, isLoading }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tableId, setTableId] = useState();
  const [orderData, setOrderData] = useState();
  const [status, setStatus] = useState();
  const [updateStatus] = useUpdateStatusMutation();
  // const handleOpenModal = (id) => {
  //   setIsModalOpen(true);
  //   setTableId(id);  
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };
  // const handleOk = () => {
  //   try {

  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsModalOpen(false);
  //   }
  // };
  const handleOpenPopupUpdate = (id) => {
    setIsPopupOpen(true);
    setTableId(id);
    setOrderData(data.data.find((item) => item._id === id));
  };
  const handleSubmit = async () => {
    try {
      const response = await updateStatus({
        data: {
          order_status: status,
        },
        order_id: tableId,
      }).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Cap nhat trang thai thanh cong",
          showProgress: true,
          placement: "top",
          onClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelUpdate = () => {
    setIsPopupOpen(false);
  };
  const columns = [
    {
      title: "Mã vận đơn",
      dataIndex: "order_trackingNumber",
      key: "order_trackingNumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      render: (status) => {
        switch (status) {
          case "pending":
            return <Tag color="gold">Chờ xác nhận</Tag>;

          case "confirmed":
            return <Tag color="lime">Đã xác nhận</Tag>;

          case "processing":
            return <Tag color="blue">Đang xử lý</Tag>;

          case "packed":
            return <Tag color="geekblue">Đã đóng gói</Tag>;

          case "delivering":
            return <Tag color="cyan">Đang giao hàng</Tag>;

          case "shipped":
            return <Tag color="green">Đã giao hàng</Tag>;

          case "completed":
            return <Tag color="success">Hoàn tất</Tag>;

          case "cancelled":
            return <Tag color="red">Đã hủy</Tag>;

          case "returned":
            return <Tag color="volcano">Khách trả hàng</Tag>;

          case "exchanged":
            return <Tag color="purple">Đã đổi hàng</Tag>;

          case "refunded":
            return <Tag color="magenta">Đã hoàn tiền</Tag>;

          case "failed_delivery":
            return <Tag color="error">Giao hàng thất bại</Tag>;

          case "on_hold":
            return <Tag color="warning">Tạm giữ</Tag>;

          default:
            return <Tag>{status}</Tag>;
        }
      },
    },
    {
      title: "Số lượng",
      key: "total_product",
      dataIndex: "total_product",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "order_payment",
      key: "order_payment",
      render: (order) => <a>{order.paymentMethod}</a>,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => <a>{formatDate(text)}</a>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <div className="flex flex-col">
          <Button
            variant="link"
            color="primary"
            onClick={() => handleOpenPopupUpdate(record._id)}
            className=""
          >
            Cập nhật
          </Button>
          {/* <Button
            variant="link"
            color="danger"
            onClick={() => handleOpenModal(record._id)}
          >
            Xóa
          </Button> */}
          {/* <button className="btn btn-sm btn-success">Xem chi tiet</button> */}
        </div>
      ),
    },
  ];
  const handleChangePage = (pagination) => {
    setCurrentPage(pagination.current);
  };
  return (
    <>
      <Table 
        columns={columns} 
        dataSource={data.data} 
        onChange={handleChangePage}
        loading={isLoading}
        pagination={{
          pageSize: limit,
          total: data.totalRows,

          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
        }}
      />
      {/* <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Xóa đơn hàng này?</p>
      </Modal> */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isPopupOpen}
        onOk={handleSubmit}
        onCancel={handleCancelUpdate}
      >
        <Select
          style={{ width: "100%" }}
          onChange={(value) => setStatus(value)}
          value={status || orderData?.order_status}
        >
          <Select.Option value="pending">Chờ xác nhận</Select.Option>
          <Select.Option value="confirmed">Đã xác nhận</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="packed">Đã đóng gói</Select.Option>
          <Select.Option value="delivering">Đang giao hàng</Select.Option>
          <Select.Option value="shipped">Đã giao hàng</Select.Option>
          <Select.Option value="completed">Hoàn tất</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
          <Select.Option value="returned">Khách trả hàng</Select.Option>
          <Select.Option value="exchanged">Đã đổi hàng</Select.Option>
          <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
          <Select.Option value="failed_delivery">
            Giao hàng thất bại
          </Select.Option>
          <Select.Option value="on_hold">Tạm giữ</Select.Option>
        </Select>
      </Modal>
    </>
  );
};
export default OrderTable;

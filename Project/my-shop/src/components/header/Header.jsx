import {
  DownOutlined,
  HeartOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Input,
  notification,
  Space,
  Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { handleLogout } from "../../services/auth/logout";
import { logoutAuth } from "../../stores/slices/authSlice";

function HomeHeader({ user }) {
  const { Search } = Input;
  const dispatch = useDispatch();
  const logoutUser = async () => {
    try {
      await handleLogout();
      await dispatch(logoutAuth()).unwrap();
      notification.success({
        message: "Logged out successfully",
        showProgress: true,
        placement: "top",
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      notification.error({
        message: error,
        showProgress: true,
        placement: "top",
      });
    }
  };
  const profileMenu = [
    {
      key: "1",
      label: (
        <Flex
          gap="middle"
          vertical
          align="center"
          flex="center"
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${
              user?.usr_avatar
                ? user?.usr_avatar
                : user?.usr_name?.split("")[0].toUpperCase()
            }`}
            alt="avatar"
            size={60}
          />
          <Typography className="hidden md:block">
            {user?.usr_full_name || user?.usr_name}
          </Typography>
        </Flex>
      ),
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Typography>Hồ Sơ Cá nhân</Typography>,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: <Typography>Đăng xuất</Typography>,
      danger: true,
      onClick: logoutUser,
    },
  ];
  const onNavigateFavoritePage = () => {};
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 40px",
        position: "sticky",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "100",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          maxWidth: "1200px",
          minWidth: "1200px",
          margin: "auto",
          width: "100%",
          padding: "0px 24px",
        }}
      >
        <Link
          to="/"
          onClick={() => {
            window.location.refresh();
          }}
          className="flex items-center gap-x-2"
        >
          <img alt="Logo" src="/logo-l.png" width={120} height={100} />
        </Link>
        <Search
          placeholder="Tìm kiếm sản phẩm"
          size="large"
          style={{ width: 600 }}
        />
        <Flex className="flex items-center gap-x-4">
          <div onClick={onNavigateFavoritePage}>
            <HeartOutlined />
          </div>
          <div>
            <ShoppingCartOutlined />
          </div>
          <div>
            {user ? (
              <Dropdown
                menu={{ items: profileMenu }}
                placement="bottomLeft"
                trigger={[`${"hover"}`]}
                overlayStyle={{ width: "240px" }}
              >
                <Space align="center">
                  <Avatar
                    src={`${
                      user?.usr_avatar
                        ? user?.usr_avatar
                        : user?.usr_name?.split("")[0].toUpperCase()
                    }`}
                    alt="avatar"
                  />
                  <DownOutlined />
                </Space>
              </Dropdown>
            ) : (
              <Link to="/login">Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </Flex>
      </Flex>
    </Header>
  );
}

export default HomeHeader;

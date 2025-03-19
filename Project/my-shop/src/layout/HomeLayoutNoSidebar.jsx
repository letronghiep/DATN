import { Layout, theme } from "antd";
import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/header/Header";
import { getAuth } from "../stores/slices/authSlice";

function HomeLayoutNoSidebar({ children }) {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStorage = useSelector((state) => state.user);
  const userData = userStorage?.user;
  console.log(userData);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");

    const getUserData = async () => {
      // Nếu đã có dữ liệu hợp lệ, không cần gọi API nữa
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        return;
      }

      // Nếu không có userData nhưng có token, thử xác thực
      if (
        (!userData || Object.keys(userData).length === 0) &&
        token &&
        client_id
      ) {
        try {
          const data = await dispatch(getAuth()).unwrap();
          if (data?.user) {
            console.log("Fetched user data:", data);
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Nếu lỗi xác thực, chỉ xóa token nhưng không điều hướng
          localStorage.removeItem("token");
          localStorage.removeItem("client_id");
        }
      }
    };

    getUserData();
  }, [userData, dispatch]);
  return (
    <Layout>
      <HomeHeader user={user} />
      <Content
        style={{
          maxWidth: "1200px",
          minWidth: "1200px",
          margin: "auto",
          width: "100%",
          padding: "0px 24px",
        }}
      >
        <Layout
          style={{
            margin: "20px 0",
            borderRadius: borderRadiusLG,
            display: "flex",
            columnGap: "20px",
          }}
        >
          {children}
        </Layout>
      </Content>
    </Layout>
  );
}

export default HomeLayoutNoSidebar;

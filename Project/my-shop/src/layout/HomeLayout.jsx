import { Layout, theme } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Filter from "../components/filters/Filter";
import HomeHeader from "../components/header/Header";
import { getAuth } from "../stores/slices/authSlice";
import { getCategoryByParentId } from "../services/category";

function HomeLayout({ children }) {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStorage = useSelector((state) => state.user);

  const userId = userStorage._id;
  useEffect(() => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    async function getUserData() {
      if (!userId && token && client_id) {
        const data = await dispatch(getAuth()).unwrap();
        if (data) {
          setUser(data.user);
        }
      }
    }
    getUserData();
  }, [dispatch, navigate, userId]);
   const [categories, setCategories] = useState([]);
    useEffect(() => {
      async function fetchData() {
        try {
          const [categoryList] = await Promise.all([
            getCategoryByParentId(""),
          ]);
          setCategories(categoryList.metadata);
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }, []);
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
          <Filter categories={categories} />
          {children}
        </Layout>
      </Content>
    </Layout>
  );
}

export default HomeLayout;

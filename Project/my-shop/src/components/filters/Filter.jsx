import { Layout, Skeleton, theme, Tooltip, Tree, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FilterSection from "./filter-section";

function Filter({ categories }) {
  const { Sider } = Layout;
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const { category_id } = useParams();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [treeData, setTreeData] = useState([]);
  console.log(categories);
  const findCategoryById = (list, id) => {
    for (const item of list) {
      if (item.category_id.toString() === id) return item;
      if (item.children?.length) {
        const found = findCategoryById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  useEffect(() => {
    if (category_id && categories.length) {
    //   const filtered = categories?.find(
    //     (item) => item.category_id.toString() === category_id
    //   );
    const filtered = findCategoryById(categories, category_id);
      if (!filtered) return;
      if (filtered.children.length) {
        setFilteredCategories(filtered.children);
      }
    }
  }, [category_id, categories]);
  console.log({ filteredCategories });
  useEffect(() => {
    const formattedTree = [
      {
        title: "Danh mục",
        key: "0",
        children: filteredCategories.map((category) => ({
          title: (
            <Link to={`/category/${category.category_id}`}>
              {category.category_name}
            </Link>
          ),
          key: category.category_id.toString(),
        })),
      },
    ];
    setTreeData(formattedTree);
  }, [filteredCategories]);
  const MemoTooltip = Tooltip || React.memo(Tooltip);
  const queryCategories = filteredCategories.map((category) => ({
    id: category.category_id,
    label: category.category_name,
  }));
  if (!categories.length) return <Skeleton />;
  return (
    <Sider
      style={{
        background: colorBgContainer,
        color: colorText,
        padding: "16px",
      }}
      className="site-layout-background"
      width={240}
    >
      <Tree
        treeData={treeData}
        defaultExpandAll={true}
        expandedKeys={["0"]}
        titleRender={(item) => {
          const title = item.title;
          return <MemoTooltip title={title}>{title}</MemoTooltip>;
        }}
      />
      <div className="mt-2">
        <Typography.Title level={5}>Bộ lọc tìm kiếm</Typography.Title>
        <FilterSection title="Theo danh mục" filterQueries={queryCategories} />
      </div>
    </Sider>
  );
}

export default Filter;

import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useSearchProductQuery } from "../apis/productsApi";
import ProductCard from "../components/product/product-card";
import { searchProductService } from "../services/product";
function ProductByCategory() {
  // const { category_id } = useParams();
  const { product_category } = useSelector((state) => state.filter);
  const [keySearch, setKeySearch] = useState("");
  const [products, setProducts] = useState();
  const [totalRows, setTotalRows] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector((state) => state.filter);
  const handleSearch = (e) => {
    setKeySearch(e.target.value);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page, offset: limit });
  };
  useEffect(() => {
    const offset = Number(searchParams.get("offset")) || 5;
    const currentPage = Number(searchParams.get("page")) || 1;
    setLimit(Number(offset));
    setCurrentPage(Number(currentPage));
  }, [searchParams]);
  const { data, isLoading, refetch } = useSearchProductQuery(
    { filters },
    {
      skip: true, // Chỉ gọi API khi người dùng bấm nút
    }
  );
  useEffect(() => {
    // if (!category_id) return;
    async function getProductByCategory() {
      const response = await searchProductService(
        keySearch,
        "published",
        product_category,
        currentPage,
        limit,
        ""
      );
      if (response.status === 200) {
        setProducts(response.metadata.data);
        setTotalRows(response.metadata.totalRows);
      }
    }
    getProductByCategory();
  }, [product_category, keySearch, limit, currentPage]);
  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        {products &&
          products.map((product) => (
            <ProductCard
              className="col-span-3 bg-white"
              key={product._id}
              product={product}
            />
          ))}
      </div>
      <Pagination
        className="flex justify-center mt-4"
        align="center"
        current={currentPage}
        onChange={handlePageChange}
        total={totalRows}
        pageSize={limit}
      />
    </div>
  );
}

export default ProductByCategory;

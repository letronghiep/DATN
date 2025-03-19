import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategorySlide from "../components/slider/category-slider";
import { modifyImageDimensions } from "../helpers";
import { getBanners } from "../services/banner";
import { getCategoryByParentId } from "../services/category";

function HomePage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryList, bannerList] = await Promise.all([
          getCategoryByParentId(""),
          getBanners(),
        ]);
        setBanners(bannerList.metadata);
        setCategories(categoryList.metadata);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      {/* Banner */}
      {banners.length > 0 && (
        <div>
          <Carousel arrows={true}>
            {banners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => navigate(`flashsale/${banner.linkTo}`)}
              >
                <img
                  src={modifyImageDimensions(banner.thumb, 1200, 345)}
                  alt={banner.title}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      {/* End Banner */}
      {/* Category */}
      <div>
        <CategorySlide categories={categories} title="Danh mục sản phẩm" />
      </div>
      {/* End Category */}
    </div>
  );
}

export default HomePage;

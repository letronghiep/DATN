import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions } from "../../helpers";

function CategorySlide({ categories, title }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -278 : 278,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      {categories.length > 0 && (
        <>
          <Typography.Title
            level={4}
            style={{
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography.Title>
          <div className="p-6 bg-white relative">
            <div className="relative ">
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10"
                onClick={() => scroll("left")}
              >
                <LeftOutlined />
              </button>
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-hidden scroll-smooth no-scrollbar"
              >
                {categories.map((category) => (
                  <Card
                    hoverable
                    key={category._id}
                    className="relative text-center border shadow-md min-w-[200px] cursor-pointer"
                    onClick={() => navigate(`/category/${category.category_id}`)}
                  >
                    <img
                      src={modifyImageDimensions(
                        category.category_thumb,
                        80,
                        80
                      )}
                      className="w-full h-[80px] object-cover"
                      alt="category"
                    />
                    <p>{category.category_name}</p>
                  </Card>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10"
                onClick={() => scroll("right")}
              >
                <RightOutlined />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CategorySlide;

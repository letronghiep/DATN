import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions, validateFormMoney } from "../../helpers";

function ProductSlide({ products, title, href }) {
  const user = useSelector((state) => state.user.user);
  console.log({ user });
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
    <div className="my-4">
      {products.length > 0 && (
        <>
          <Typography.Title
            level={4}
            style={{
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {title}
          </Typography.Title>
          <div className="p-6 bg-white relative my-4">
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
                {products.map((product) => (
                  <Card
                    hoverable
                    key={product._id}
                    className="relative text-center border shadow-md min-w-[200px] cursor-pointer group"
                    onClick={() => navigate(`/${product.product_slug}`)}
                  >
                    <img
                      src={modifyImageDimensions(
                        product.product_thumb,
                        370,
                        270
                      )}
                      className="object-cover"
                      alt="product"
                    />
                    <p className="text-base text-essential-800 ease-linear text-ellipsis overflow-hidden font-medium mt-3">
                      {product.product_name}
                    </p>
                    <p className="text-[#7C3FFF] font-semibold text-lg mt-2 mb-2">
                      {validateFormMoney(product.product_price)} VND
                    </p>
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
          <Button
            classNames="w-fit"
            style={{
              width: "fit-content",
              margin: "0 auto",
              display: "flex",
            }}
            link
            href={href}
            className="w-full"
          >
            Xem thêm
          </Button>
        </>
      )}
    </div>
  );
}

export default ProductSlide;

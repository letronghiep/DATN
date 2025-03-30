import { Button, Card, Flex, InputNumber, Typography, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./shopping-cart.css";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} from "../apis/cartApis";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function ShoppingCart({ onClose }) {
  const navigate = useNavigate();
  // Queries & Mutations
  const { data, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const cartItems = data?.metadata?.cart_products || [];
  console.log({ data, cartItems });
  const totalAmount = data?.metadata?.cart_count_product || 0;

  // Hàm cập nhật số lượng sản phẩm
  const handleQuantityChange = async (id, value) => {
    try {
      console.log({ id });
      await updateCartItem({
        cartItemId: id,
        data: { ...value },
      }).unwrap();
    } catch (error) {
      message.error("Không thể cập nhật số lượng");
    }
  };

  // Hàm tăng số lượng
  const handleIncrement = async (id) => {
    console.log({ id });
    const item = cartItems.find((item) => item.productId === id);
    if (item && item.quantity < 10) {
      await handleQuantityChange(id, [
        {
          shopId: item.shopId,
          item_products: [
            {
              quantity: item.quantity + 1,
              shopId: item.shopId,
              old_quantity: item.quantity,
              productId: item.productId,
            },
          ],
        },
      ]);
    }
  };

  // Hàm giảm số lượng
  const handleDecrement = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      await handleQuantityChange(id, [
        {
          shopId: item.shopId,
          item_products: [
            {
              quantity: item.quantity - 1,
              shopId: item.shopId,
              old_quantity: item.quantity,
              productId: item.productId,
            },
          ],
        },
      ]);
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  // Hàm thanh toán
  const handleCheckout = async () => {
    try {
      navigate("/checkout");
      // message.success("Đặt hàng thành công");
      onClose?.();
    } catch (error) {
      message.error("Không thể hoàn tất đơn hàng");
    }
  };

  return (
    <Card
      className="shopping-cart-drawer"
      title={`Giỏ hàng (${cartItems.length} Item${
        cartItems.length !== 1 ? "s" : ""
      })`}
      extra={
        <Button type="text" onClick={onClose}>
          ×
        </Button>
      }
    >
      <div className="cart-items space-y-4">
        {cartItems.map((item) => (
          <Flex
            key={item.productId}
            align="start"
            className="cart-item"
            gap={16}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover"
            />
            <div className="flex-1">
              <Title level={5} className="m-0">
                {item.name}
              </Title>
              <Text className="text-purple-600 font-medium">${item.price}</Text>
              <Text className="block text-gray-600">
                {item.color} / {item.size}
              </Text>
              <Flex align="center" gap={8} className="mt-2">
                <Button
                  size="small"
                  onClick={() => handleDecrement(item.id)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(value) =>
                    handleQuantityChange(item.productId, [
                      {
                        shopId: item.shopId,
                        item_products: [
                          {
                            quantity: value,
                            shopId: item.shopId,
                            old_quantity: item.quantity,
                            productId: item.productId,
                          },
                        ],
                      },
                    ])
                  }
                  size="small"
                  className="w-12"
                />
                <Button
                  size="small"
                  onClick={() => handleIncrement(item.productId)}
                  disabled={item.quantity >= 10}
                >
                  +
                </Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  className="ml-auto"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </Flex>
            </div>
          </Flex>
        ))}
      </div>

      {cartItems.length > 0 ? (
        <div className="mt-8">
          {/* <div className="klarna-info text-center text-sm text-gray-600 mb-4">
            4-interest-free payments of ${(totalAmount / 4).toFixed(2)} with
            Klarna.
            <Button type="link" className="p-0 ml-1">
              Learn more
            </Button>
          </div> */}

          <Button
            type="primary"
            block
            className="bg-purple-600"
            onClick={handleCheckout}
            loading={isCheckingOut}
          >
            Đi đến thanh toán - ${totalAmount.toFixed(2)}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Text className="text-gray-500">Your shopping bag is empty</Text>
        </div>
      )}
    </Card>
  );
}

export default ShoppingCart;

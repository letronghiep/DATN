"use strict";
const Cart = require("../models/cart.model");
const { getProductById } = require("../models/repo/product.repo");
const { NotFoundError } = require("../core/error.response");
const { Types } = require("mongoose");

// REPO
const createUserCart = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    updateSet = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await Cart.findOneAndUpdate(query, updateSet, options);
};
const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
    updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  const existingCart = await Cart.findOne(query);
  let cartUpdated;
  if (existingCart) {
    cartUpdated = await Cart.findOneAndUpdate(query, updateSet, options);
  } else {
    cartUpdated = await Cart.findOneAndUpdate(
      { cart_userId: userId, cart_state: "active" },
      {
        $push: { cart_products: { ...product, quantity } },
      },
      { upsert: true, new: true }
    );
  }

  return cartUpdated;
};
// END REPO

const addToCartService = async ({ userId, product }) => {
  try {
    // Tìm giỏ hàng của user
    const userCart = await Cart.findOne({
      cart_userId: new Types.ObjectId(userId),
    }).lean();

    // Nếu chưa có giỏ hàng hoặc giỏ hàng trống, tạo mới
    if (!userCart || !userCart.cart_products.length) {
      return await createUserCart({ userId, product });
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = userCart.cart_products.find(
      (p) => p.productId.toString() === product.productId.toString()
    );

    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      return await updateUserCartQuantity({ userId, product });
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
      return await createUserCart({ userId, product });
    }
  } catch (error) {
    throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng: " + error.message);
  }
};

/* 
    shop_order_ids: [
        {
        shopId,
        item_products: [
        {
            quantity, 
            shopId,
            old_quantity,
            product_id
        }
            
        ],
    }
    ]
  */
const updateCartService = async ({ userId, shop_order_ids }) => {
  console.log(shop_order_ids);
  const { productId, quantity, old_quantity } =
    shop_order_ids[0]?.item_products[0];
  // check product
  const foundProduct = await getProductById({ productId });
  if (!foundProduct) throw new NotFoundError("Product not found");
  if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
    throw new NotFoundError("Product does not exists");
  // check cart
  if (quantity === 0) {
    await deleteUserCartService({ userId, productId });
  }
  return await updateUserCartQuantity({
    userId,
    product: {
      productId,
      quantity: quantity - old_quantity,
    },
  });
};

const deleteUserCartService = async ({ userId, productId }) => {
  const deleted = await Cart.updateOne(
    {
      cart_userId: new Types.ObjectId(userId),
      cart_state: "active",
    },
    {
      $pull: {
        cart_products: { productId },
      },
    }
  );
  return deleted;
};

const getListUserCartService = async ({ userId }) => {
  return await Cart.findOne({
    cart_userId: new Types.ObjectId(userId),
  }).lean();
};

module.exports = {
  addToCartService,
  updateCartService,
  deleteUserCartService,
  getListUserCartService,
};

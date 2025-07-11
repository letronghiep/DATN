"use strict";
const express = require("express");
const { permission, apiKey } = require("../auth/checkAuth");
const { callbackZaloPay } = require("../controllers/checkout.controller");
const router = express.Router();
// router.use(apiKey);
// router.use(permission("0000"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/category", require("./category"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/notifications", require("./notification"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/shipping", require("./shipping"));
router.use("/v1/api/pageview", require("./pageview"));
router.use("/v1/api/analysis", require("./analysis"));
router.use("/v1/api/shipment", require("./shipment"));
router.use("/v1/api/variations", require("./variations"));
router.use("/v1/api/brands", require("./brands"));
router.use("/v1/api/attributes", require("./attributes"));
router.use("/v1/api/flashsale", require("./flashsale"));
router.use("/v1/api/banners", require("./banner"));
router.use("/v1/api/chat", require("./chat"));

module.exports = router;

"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/authentication");
const {
  createBanner,
  getBanner,
} = require("../../controllers/banner.controller");
const router = express.Router();
// shop
router.post("", authentication, asyncHandler(createBanner));
router.get("/", asyncHandler(getBanner));
module.exports = router;

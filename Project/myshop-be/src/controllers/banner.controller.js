"use strict";

const { NotFoundError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createBannerService,
  getBannerService,
} = require("../services/banner.service");

const createBanner = async (req, res, next) => {
  new CREATED({
    message: "Banner created",
    metadata: await createBannerService(req.body),
  }).send(res);
};
const getBanner = async (req, res, next) => {
  new SuccessResponse({
    message: "Banner",
    metadata: await getBannerService(),
  }).send(res);
};
module.exports = {
  createBanner,
  getBanner,
};

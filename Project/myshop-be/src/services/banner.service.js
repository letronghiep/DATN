"use strict";
const Banner = require("../models/banner.model");
const { randomBannerId } = require("../utils");
const createBannerService = async (banner) => {
  const { title, thumb, linkTo, isActive, startDate, endDate } = banner;
  const newBanner = new Banner({
    id: randomBannerId(),
    title: title,
    thumb: thumb,
    linkTo: linkTo,
    isActive: isActive,
    startDate: startDate,
    endDate: endDate,
  });
  await newBanner.save();
  return newBanner;
};
const getBannerService = async () => {
  const now = new Date();
  return await Banner.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

module.exports = {
  createBannerService,
  getBannerService,
};

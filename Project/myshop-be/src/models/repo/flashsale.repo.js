"use strict";

const FlashSale = require("../flashsale.model");
const getFlashSale = async ({ flashSaleId }) => {
  return await FlashSale.findOne({ id: flashSaleId });
};
module.exports = {
  getFlashSale,
};

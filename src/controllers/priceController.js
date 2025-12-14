const { comparePrices } = require('../services/priceComparisonService');

exports.comparePrices = (req, res) => {
  const result = comparePrices();
  res.json(result)
};

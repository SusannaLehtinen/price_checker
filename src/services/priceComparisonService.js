function comparePrices() {
  return {
    label: "average",
    stores: [
      { name: "Store A", price: 2.99 },
      { name: "Store B", price: 3.49 }
    ]
  };
}

module.exports = { comparePrices };

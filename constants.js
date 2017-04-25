// Constants

const coinSpec = {
  nickel: {
    diameter: 21.21, // mm
    weight: 5.000, // g
    value: 5 // cents
  },
  dime: {
    diameter: 17.91, // mm
    weight: 2.268, // g
    value: 10 // cents
  },
  quarter: {
    diameter: 24.26, // mm
    weight: 5.670, // g
    value: 25 // cents
  }
};

const products = {
  cola: 100,
  chips: 50,
  candy: 65
}; // cents

const inventory = {
  cola: 0,
  chips: 0,
  candy: 0
};

module.exports = {
  coinSpec,
  products,
  inventory
};

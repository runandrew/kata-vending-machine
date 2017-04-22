// Vending Machine

const coinSpec = {
  penny: {
    diameter: 19.05, // mm
    weight: 2.500 // g
  },
  nickel: {
    diameter: 21.21, // mm
    weight: 5.000 // g
  },
  dime: {
    diameter: 17.91, // mm
    weight: 2.268 // g
  },
  quarter: {
    diameter: 24.26, // mm
    weight: 5.670 // g
  }
};

class VendingMachine {
  static validateCoin ({weight, diameter}) {
    if (weight === coinSpec.nickel.weight && diameter === coinSpec.nickel.diameter) {
      return 5;
    } else if (weight === coinSpec.dime.weight && diameter === coinSpec.dime.diameter) {
      return 10;
    } else if (weight === coinSpec.quarter.weight && diameter === coinSpec.quarter.diameter) {
      return 25;
    } else {
      return 0;
    }
  }
}

module.exports = {
  VendingMachine,
  coinSpec
};

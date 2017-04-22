// Vending Machine

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

class VendingMachine {
  constructor () {
    this.currentAmount = 0;
    this.displayText = 'INSERT COIN';
  }

  insertCoin (insertedCoin) {
    this.currentAmount += VendingMachine.validateCoin(insertedCoin);
    this.displayText = VendingMachine.centToDollarStr(this.currentAmount);
  }

  checkDisplay () {
    return this.displayText;
  }

  static validateCoin ({weight, diameter}) {
    for (let coin in coinSpec) {
      if (weight === coinSpec[coin].weight && diameter === coinSpec[coin].diameter) {
        return coinSpec[coin].value;
      }
    }
    return 0;
  }

  static centToDollarStr (cents) {
    const dollars = Math.floor(cents / 100);
    const centsRemainder = cents % 100;
    return `$${dollars}.${centsRemainder > 9 ? centsRemainder : `0${centsRemainder}`}`;
  }
}

module.exports = {
  VendingMachine,
  coinSpec
};

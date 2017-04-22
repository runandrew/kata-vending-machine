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

const products = {
  cola: 100,
  chips: 50,
  candy: 65
};

class VendingMachine {
  constructor () {
    this.currentAmount = 0;
    this.displayText = 'INSERT COIN';
  }

  insertCoin (insertedCoin) {
    const coinValue = VendingMachine.validateCoin(insertedCoin);
    if (coinValue) {
      this.currentAmount += VendingMachine.validateCoin(insertedCoin);
      this.displayText = VendingMachine.centToDollarStr(this.currentAmount);
    } else {
      VendingMachine.returnCoin();
    }
    return this;
  }

  checkDisplay () {
    return this.displayText;
  }

  selectProduct () {
    VendingMachine.dispenseProduct('chips');
    this.displayText = 'THANK YOU';
    this.currentAmount = 0;
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

  static returnCoin () {
    // will physically return the coin
  }

  static dispenseProduct (product) {
    // will physically dispense the product
  }
}

module.exports = {
  VendingMachine
};

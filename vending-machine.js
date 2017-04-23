// Vending Machine

const Immutable = require('immutable');

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

class VendingMachine {
  constructor () {
    this.currentAmount = 0;
    this.displayText = 'INSERT COIN';
    this.bank = Immutable.Map().set(25, 0).set(10, 0).set(5, 0);
  }

  insertCoin (insertedCoin) {
    const coinValue = VendingMachine.validateCoin(insertedCoin);
    if (coinValue) {
      this.currentAmount += coinValue;
      this.updateBank('add', [coinValue]);
      this.displayText = VendingMachine.centToDollarStr(this.currentAmount);
    } else {
      VendingMachine.returnCoin(['invalid']);
    }
    return this;
  }

  checkDisplay () {
    let outputText = this.displayText;
    if (outputText === 'THANK YOU') this.displayText = 'INSERT COIN';
    else if (outputText.indexOf('PRICE') !== -1) this.displayText = this.currentAmount ? VendingMachine.centToDollarStr(this.currentAmount) : 'INSERT COIN';
    return outputText;
  }

  selectProduct (product) {
    const productPrice = products[product];
    if (productPrice > this.currentAmount) {
      this.displayText = `PRICE: ${VendingMachine.centToDollarStr(productPrice)}`;
    } else {
      VendingMachine.dispenseProduct(product);
      this.displayText = 'THANK YOU';

      const remainingAmount = this.currentAmount - productPrice;
      if (remainingAmount) {
        const coinsToMakeRemainder = this.makeChange(remainingAmount);
        this.updateBank('subtract', coinsToMakeRemainder);
        VendingMachine.returnCoin(coinsToMakeRemainder);
      }
      this.currentAmount = 0;
    }
  }

  makeChange (requestedChange) {
    const changeTypes = this.bank.keySeq().toArray();
    const memo = new Map();

    return findCoinsToMakeChange(requestedChange, this.bank, [], 0);

    function findCoinsToMakeChange (change, bank, coins, coinTypeStartIdx) {
      if (!change) return coins;
      if (change < 0 || change % 5) return [];
      if (memo.has(change)) return memo.get(change);

      for (let coinTypeIndex = coinTypeStartIdx; coinTypeIndex < changeTypes.length; coinTypeIndex++) {
        if (bank.get(changeTypes[coinTypeIndex]) > 0) {
          let possiblePath = findCoinsToMakeChange(
            change - changeTypes[coinTypeIndex],
            bank.update(changeTypes[coinTypeIndex], val => val - 1),
            [...coins, changeTypes[coinTypeIndex]],
            coinTypeIndex
          );

          if (possiblePath.length) {
            return possiblePath;
          }
        }
      }

      memo.set(change, []);
      return [];
    }
  }

  updateBank (operator, coins) {
    coins.forEach(coin => {
      this.bank = this.bank.update(coin, val => {
        return operator === 'add' ? val + 1 : val - 1;
      });
    });
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

  static returnCoin (coinsToBeReturned) {
    // will physically return the coin
  }

  static dispenseProduct (product) {
    // will physically dispense the product
  }
}

module.exports = {
  VendingMachine
};

// Vending Machine

const Immutable = require('immutable');
const { coinSpec, products } = require('./constants');

class VendingMachine {
  constructor () {
    this.currentAmount = 0;
    this.displayText = 'INSERT COIN';
    this.bank = Immutable.Map().set(25, 0).set(10, 0).set(5, 0);
    this.inventory = { cola: 0, chips: 0, candy: 0 };
  }

  // insertCoin: validates the coins, and adjusts the display and bank accordingly
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

  // checkDisplay: return the current output display based on machine state
  checkDisplay () {
    let outputText = this.displayText;

    if (outputText === 'THANK YOU') {
      this.displayText = 'INSERT COIN';
    } else if (outputText.indexOf('PRICE') !== -1 || outputText === 'SOLD OUT') {
      this.displayText = this.currentAmount ? VendingMachine.centToDollarStr(this.currentAmount) : 'INSERT COIN';
    }
    return outputText;
  }

  // selectProduct: dispenses products and updates the bank and inventory
  selectProduct (product) {
    // Product is sold out
    if (!this.inventory[product]) {
      this.displayText = 'SOLD OUT';
      return;
    }

    // Product is not sold out. Checks if there is enough money, if so, vend and return change if necessary
    const productPrice = products[product];
    if (productPrice > this.currentAmount) {
      this.displayText = `PRICE: ${VendingMachine.centToDollarStr(productPrice)}`;
    } else {
      VendingMachine.dispenseProduct(product);
      this.updateInventory('subtract', product);
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

  // selectReturnCoin: returns the inserted coins to the user with the least amount of coins
  selectReturnCoin () {
    const coinsToMakeRemainder = this.makeChange(this.currentAmount);
    this.updateBank('subtract', coinsToMakeRemainder);
    VendingMachine.returnCoin(coinsToMakeRemainder);
    this.displayText = 'INSERT COIN';
    this.currentAmount = 0;
  }

  // makeChange: finds the least amount of coins to return given the bank state and request change amount
  makeChange (requestedChange) {
    const changeTypes = this.bank.keySeq().toArray(); // define the denominations
    const memo = new Map(); // establish memo to prevent duplicated calculations

    return findCoinsToMakeChange(requestedChange, this.bank, [], 0);

    function findCoinsToMakeChange (change, bank, coins, coinTypeStartIdx) {
      if (!change) return coins;                                      // base case: remaining change of zero, return the coins so far
      if (change < 0 || change % 5) return [];                        // if the previous coin is over the desired amount, or if it isn't divisible by 5 (specific to this set of coins), then return with no path
      if (memo.has(change)) return memo.get(change);                  // check if the calculation has been completed before

      for (let coinTypeIndex = coinTypeStartIdx; coinTypeIndex < changeTypes.length; coinTypeIndex++) {
        if (bank.get(changeTypes[coinTypeIndex]) > 0) {               // if there are coins left of this denomination
          let possiblePath = findCoinsToMakeChange(
            change - changeTypes[coinTypeIndex],                      // find the change for the remainder after the current coin
            bank.update(changeTypes[coinTypeIndex], val => val - 1),
            [...coins, changeTypes[coinTypeIndex]],                   // keep track of the coins used
            coinTypeIndex                                             // prevent the use of prior coins
          );

          if (possiblePath.length) {
            return possiblePath;
          }
        }
      }

      memo.set(change, []); // save paths that aren't feasible
      return [];
    }
  }

  // updateBank: allows the addition or subtraction of coins in the bank
  updateBank (operator, coins) {
    coins.forEach(coin => {
      this.bank = this.bank.update(coin, val => {
        return operator === 'add' ? val + 1 : val - 1;
      });
    });
  }

  // updateInventory: allows the addition or subtraction of items in the machine
  updateInventory (operator, product) {
    operator === 'add' ? this.inventory[product]++ : this.inventory[product]--;
  }

  // validateCoin: takes in physical properties of a coin and returns a value for a valid coin
  static validateCoin ({weight, diameter}) {
    for (let coin in coinSpec) {
      if (weight === coinSpec[coin].weight && diameter === coinSpec[coin].diameter) {
        return coinSpec[coin].value;
      }
    }
    return 0;
  }

  // centToDollarStr: converts a cents amount to a formatted dollar string
  static centToDollarStr (cents) {
    const dollars = Math.floor(cents / 100);
    const centsRemainder = cents % 100;
    return `$${dollars}.${centsRemainder > 9 ? centsRemainder : `0${centsRemainder}`}`;
  }

  // returnCoin: represents passing the coin to the coin return
  static returnCoin (coinsToBeReturned) {
    // will physically return the coin
  }

  // dispenseProduct: represents dispensing the product for the customer to retrieve
  static dispenseProduct (product) {
    // will physically dispense the product
  }
}

module.exports = {
  VendingMachine
};

// Tests for Vending Machine

const { expect } = require('chai');
const { spy, assert } = require('sinon');
const { VendingMachine } = require('../vending-machine');

const coinSpecTests = {
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

describe('Vending Machine Class', () => {
  it('is a function', () => {
    expect(typeof VendingMachine).to.equal('function');
  });

  describe('constructor function', () => {
    let aVendingMachine;

    beforeEach(() => {
      aVendingMachine = new VendingMachine();
    });

    it('has a currentAmount property that is a number', () => {
      expect(typeof aVendingMachine.currentAmount).to.equal('number');
    });

    it('currentAmount starts at 0', () => {
      expect(aVendingMachine.currentAmount).to.equal(0);
    });

    it('has a displayText property', () => {
      expect(typeof aVendingMachine.displayText).to.equal('string');
    });

    it('displayText starts at "INSERT COIN"', () => {
      expect(aVendingMachine.displayText).to.equal('INSERT COIN');
    });

    it('has a bank property', () => {
      expect(typeof aVendingMachine.bank).to.equal('object');
    });

    it('bank starts with no coins', () => {
      expect(aVendingMachine.bank.toJS()).to.eql({ '5': 0, '10': 0, '25': 0 });
    });
  });

  describe('validateCoin static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.validateCoin).to.equal('function');
    });

    it('returns a number', () => {
      expect(typeof VendingMachine.validateCoin(coinSpecTests.nickel)).to.equal('number');
    });

    it('returns 5 for a nickel', () => {
      expect(VendingMachine.validateCoin(coinSpecTests.nickel)).to.equal(5);
    });

    it('returns 10 for a dime', () => {
      expect(VendingMachine.validateCoin(coinSpecTests.dime)).to.equal(10);
    });

    it('returns 25 for a quarter', () => {
      expect(VendingMachine.validateCoin(coinSpecTests.quarter)).to.equal(25);
    });

    it('returns 0 for an invalid coin', () => {
      expect(VendingMachine.validateCoin(coinSpecTests.penny)).to.equal(0);
      expect(VendingMachine.validateCoin({ diameter: 7, weight: 7 })).to.equal(0);
    });
  });

  describe('centToDollarStr static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.centToDollarStr).to.equal('function');
    });

    it('returns dollar string from cent input', () => {
      expect(VendingMachine.centToDollarStr(5)).to.equal('$0.05');
      expect(VendingMachine.centToDollarStr(80)).to.equal('$0.80');
      expect(VendingMachine.centToDollarStr(120)).to.equal('$1.20');
      expect(VendingMachine.centToDollarStr(205)).to.equal('$2.05');
    });
  });

  describe('returnCoin static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.returnCoin).to.equal('function');
    });

    it('is called when an invalid coin is inserted', () => {
      const originalReturnCoin = VendingMachine.returnCoin;
      VendingMachine.returnCoin = spy(VendingMachine.returnCoin);
      let aVendingMachine = new VendingMachine();
      aVendingMachine.insertCoin(coinSpecTests.dime);
      expect(VendingMachine.returnCoin.called).to.be.false;
      aVendingMachine.insertCoin(coinSpecTests.penny);
      expect(VendingMachine.returnCoin.calledOnce).to.be.true;
      VendingMachine.returnCoin = originalReturnCoin;
    });
  });

  describe('dispenseProduct static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.dispenseProduct).to.equal('function');
    });
  });

  describe('insertCoin method', () => {
    let aVendingMachine;
    beforeEach(() => {
      aVendingMachine = new VendingMachine();
    });

    it('is a function', () => {
      expect(typeof aVendingMachine.insertCoin).to.equal('function');
    });

    it('updates the currentAmount after insertCoin', () => {
      aVendingMachine.insertCoin(coinSpecTests.nickel);
      expect(aVendingMachine.currentAmount).to.equal(5);
      aVendingMachine.insertCoin(coinSpecTests.dime);
      expect(aVendingMachine.currentAmount).to.equal(15);
      aVendingMachine.insertCoin(coinSpecTests.penny);
      expect(aVendingMachine.currentAmount).to.equal(15);
    });

    it('updates the displayText after insertCoin', () => {
      aVendingMachine.insertCoin(coinSpecTests.nickel);
      expect(aVendingMachine.displayText).to.equal('$0.05');
      aVendingMachine.insertCoin(coinSpecTests.dime);
      expect(aVendingMachine.displayText).to.equal('$0.15');
    });

    it('updates the bank with the inserted coin', () => {
      aVendingMachine.insertCoin(coinSpecTests.nickel);
      expect(aVendingMachine.bank.get(5)).to.equal(1);
      aVendingMachine.insertCoin(coinSpecTests.quarter);
      expect(aVendingMachine.bank.get(25)).to.equal(1);
      aVendingMachine.insertCoin(coinSpecTests.dime);
      expect(aVendingMachine.bank.get(10)).to.equal(1);
      aVendingMachine.insertCoin(coinSpecTests.quarter)
        .insertCoin(coinSpecTests.quarter);
      expect(aVendingMachine.bank.get(25)).to.equal(3);
    });
  });

  describe('checkDisplay method', () => {
    let aVendingMachine;
    beforeEach(() => {
      aVendingMachine = new VendingMachine();
    });

    it('is a function', () => {
      expect(typeof aVendingMachine.checkDisplay).to.equal('function');
    });

    it('initially displays INSERT COIN', () => {
      expect(aVendingMachine.checkDisplay()).to.equal('INSERT COIN');
    });
  });

  describe('selectProduct method', () => {
    let aVendingMachine;
    let oldDispenseProduct;
    let originalReturnCoin;
    
    beforeEach(() => {
      aVendingMachine = new VendingMachine();

      oldDispenseProduct = VendingMachine.dispenseProduct;
      VendingMachine.dispenseProduct = spy(VendingMachine.dispenseProduct);

      originalReturnCoin = VendingMachine.returnCoin;
      VendingMachine.returnCoin = spy(VendingMachine.returnCoin);

      aVendingMachine.insertCoin(coinSpecTests.quarter)
        .insertCoin(coinSpecTests.quarter);
    });

    afterEach(() => {
      VendingMachine.dispenseProduct = oldDispenseProduct;
      VendingMachine.returnCoin = originalReturnCoin;
    });

    it('is a function', () => {
      expect(typeof aVendingMachine.selectProduct).to.equal('function');
    });

    it('dispenses a product when selected and has enough money', () => {
      aVendingMachine.selectProduct('chips');
      expect(VendingMachine.dispenseProduct.calledOnce).to.be.true;
      expect(VendingMachine.dispenseProduct.calledWith('chips')).to.be.true;

      aVendingMachine.insertCoin(coinSpecTests.quarter)
        .insertCoin(coinSpecTests.quarter)
        .insertCoin(coinSpecTests.quarter);

      aVendingMachine.selectProduct('candy');
      expect(VendingMachine.dispenseProduct.calledTwice).to.be.true;
      expect(VendingMachine.dispenseProduct.calledWith('candy')).to.be.true;
    });

    it('after dispensing a product, the display will show "THANK YOU", and then INSERT COIN', () => {
      aVendingMachine.selectProduct('chips');

      expect(aVendingMachine.checkDisplay()).to.equal('THANK YOU');
      expect(aVendingMachine.checkDisplay()).to.equal('INSERT COIN');
      expect(aVendingMachine.checkDisplay()).to.equal('INSERT COIN');
    });

    it('after dispensing a product, it should reset the currentAmount', () => {
      aVendingMachine.selectProduct('chips');

      expect(aVendingMachine.currentAmount).to.equal(0);
    });

    it('if there is not enough money, it should not dispense and display PRICE and then the currentAmount', () => {
      aVendingMachine.selectProduct('cola');
      expect(VendingMachine.dispenseProduct.callCount).to.equal(0);
      expect(aVendingMachine.currentAmount).to.equal(50);
      expect(aVendingMachine.checkDisplay()).to.equal('PRICE: $1.00');
      expect(aVendingMachine.checkDisplay()).to.equal('$0.50');
    });

    it('if there is not enough money, and there are no coins, it should display INSERT COIN', () => {
      aVendingMachine.currentAmount = 0;
      aVendingMachine.selectProduct('cola');
      expect(aVendingMachine.checkDisplay()).to.equal('PRICE: $1.00');
      expect(aVendingMachine.checkDisplay()).to.equal('INSERT COIN');
      expect(aVendingMachine.checkDisplay()).to.equal('INSERT COIN');
    });
    
    it('does not invoke returnCoin with exact currentAmount', () => {
      aVendingMachine.selectProduct('chips');
      expect(VendingMachine.returnCoin.callCount).to.equal(0);
    });

    it('invokes returnCoin when the product price is less than current amount', () => {
      aVendingMachine.insertCoin(coinSpecTests.quarter);
      aVendingMachine.selectProduct('chips');
      expect(VendingMachine.returnCoin.calledOnce).to.be.true;
    });

    it('invokes returnCoin with an array of coins, which are the least number of coins to make the change', () => {
      aVendingMachine.insertCoin(coinSpecTests.quarter)
        .insertCoin(coinSpecTests.quarter);
      aVendingMachine.selectProduct('chips');
      assert.calledWithMatch(VendingMachine.returnCoin, [25, 25]);
    });
  });

  describe('makeChange method', () => {
    let aVendingMachine;

    beforeEach(() => {
      aVendingMachine = new VendingMachine();
    });

    it('is a function', () => {
      expect(typeof aVendingMachine.makeChange).to.equal('function');
    });

    it('returns an array', () => {
      expect(Array.isArray(aVendingMachine.makeChange())).to.be.true;
    });

    it('returns an array of the least amount of coins needed to make change', () => {
      aVendingMachine.bank = aVendingMachine.bank.set(25, 2).set(10, 3).set(5, 0);
      expect(aVendingMachine.makeChange(50)).to.eql([25, 25]);
      expect(aVendingMachine.makeChange(30)).to.eql([10, 10, 10]);
      expect(aVendingMachine.makeChange(60)).to.eql([25, 25, 10]);
      aVendingMachine.bank = aVendingMachine.bank.set(25, 2).set(10, 2).set(5, 2);
      expect(aVendingMachine.makeChange(75)).to.eql([25, 25, 10, 10, 5]);
      expect(aVendingMachine.makeChange(80)).to.eql([25, 25, 10, 10, 5, 5]);
      expect(aVendingMachine.makeChange(85)).to.eql([]);
    });
  });

  describe('updateBank method', () => {
    let aVendingMachine;
    beforeEach(() => {
      aVendingMachine = new VendingMachine();
    });

    it('is a function', () => {
      expect(typeof aVendingMachine.updateBank).to.equal('function');
    });

    it('can add coins to the bank', () => {
      aVendingMachine.updateBank('add', [25]);
      expect(aVendingMachine.bank.get(25)).to.equal(1);
      aVendingMachine.updateBank('add', [10]);
      expect(aVendingMachine.bank.get(10)).to.equal(1);
      aVendingMachine.updateBank('add', [25, 10, 5]);
      expect(aVendingMachine.bank.toJS()).to.eql({ 25: 2, 10: 2, 5: 1 });
    });

    it('can subtract coins from the bank', () => {
      aVendingMachine.bank = aVendingMachine.bank.set(25, 2).set(10, 3).set(5, 2);
      aVendingMachine.updateBank('subtract', [25]);
      expect(aVendingMachine.bank.get(25)).to.equal(1);
      aVendingMachine.updateBank('subtract', [25, 10, 5]);
      expect(aVendingMachine.bank.toJS()).to.eql({ 25: 0, 10: 2, 5: 1 });
    });
  });
});


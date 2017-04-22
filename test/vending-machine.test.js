// Tests for Vending Machine

const { expect } = require('chai');
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

  describe('insertCoin method', () => {
    it('is a function', () => {
      let aVendingMachine = new VendingMachine();
      expect(typeof aVendingMachine.insertCoin).to.equal('function');
    });

    it('updates the currentAmount after insertCoin', () => {
      let aVendingMachine = new VendingMachine();
      aVendingMachine.insertCoin(coinSpecTests.nickel);
      expect(aVendingMachine.currentAmount).to.equal(5);
      aVendingMachine.insertCoin(coinSpecTests.dime);
      expect(aVendingMachine.currentAmount).to.equal(15);
      aVendingMachine.insertCoin(coinSpecTests.penny);
      expect(aVendingMachine.currentAmount).to.equal(15);
    });
  });

  describe('checkDisplay method', () => {
    it('is a function', () => {
      let aVendingMachine = new VendingMachine();
      expect(typeof aVendingMachine.checkDisplay).to.equal('function');
    });
  });
});


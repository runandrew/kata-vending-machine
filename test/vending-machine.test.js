// Tests for Vending Machine

const { expect } = require('chai');
const { VendingMachine, coinSpec } = require('../vending-machine');

const penny = {
  diameter: 19.05, // mm
  weight: 2.500 // g
};

describe('Vending Machine Class', () => {
  it('is a function', () => {
    expect(typeof VendingMachine).to.equal('function');
  });

  describe('constructor function', () => {
    it('has a currentAmount property that is a number', () => {
      let aVendingMachine = new VendingMachine();
      expect(typeof aVendingMachine.currentAmount).to.equal('number');
    });

    it('currentAmount starts at 0', () => {
      let aVendingMachine = new VendingMachine();
      expect(aVendingMachine.currentAmount).to.equal(0);
    });
  });

  describe('validateCoin static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.validateCoin).to.equal('function');
    });

    it('returns a number', () => {
      expect(typeof VendingMachine.validateCoin(coinSpec.nickel)).to.equal('number');
    });

    it('returns 5 for a nickel', () => {
      expect(VendingMachine.validateCoin(coinSpec.nickel)).to.equal(5);
    });

    it('returns 10 for a dime', () => {
      expect(VendingMachine.validateCoin(coinSpec.dime)).to.equal(10);
    });

    it('returns 25 for a quarter', () => {
      expect(VendingMachine.validateCoin(coinSpec.quarter)).to.equal(25);
    });

    it('returns 0 for an invalid coin', () => {
      expect(VendingMachine.validateCoin(penny)).to.equal(0);
      expect(VendingMachine.validateCoin({ diameter: 7, weight: 7 })).to.equal(0);
    });
  });
});


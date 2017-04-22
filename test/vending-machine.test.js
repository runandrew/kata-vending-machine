// Tests for Vending Machine

const { expect } = require('chai');
const { VendingMachine, coinSpec } = require('../vending-machine');

describe('Vending Machine Class', () => {
  it('is a function', () => {
    expect(typeof VendingMachine).to.equal('function');
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
      expect(VendingMachine.validateCoin(coinSpec.penny)).to.equal(0);
    });
  });
});

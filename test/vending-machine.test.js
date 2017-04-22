// Tests for Vending Machine

const { expect } = require('chai');
const { VendingMachine } = require('../vending-machine');

describe('Vending Machine Class', () => {
  it('is a function', () => {
    expect(typeof VendingMachine).to.equal('function');
  });

  describe('validateCoin static method', () => {
    it('is a function', () => {
      expect(typeof VendingMachine.validateCoin).to.equal('function');
    });
  });
});


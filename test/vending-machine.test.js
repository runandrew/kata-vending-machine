// Tests for Vending Machine

const { expect } = require('chai');
const { VendingMachine } = require('../vending-machine');

describe('Vending Machine Constructor', () => {
  it('is a function', () => {
    expect(typeof VendingMachine).to.equal('function');
  });
});


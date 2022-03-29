const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const provider = waffle.provider;
async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("contracts/SimpleRegistry", function() {
  beforeEach(async function() {
    this.registry = await deploy('SimpleRegistry');
    this.accounts = await ethers.getSigners();
  });

  it("registers a name", async function() {
    const sender = this.accounts[1];
    const initialSenderBalance = await provider.getBalance(sender.address);
    const registry = this.registry.connect(sender);
    
    const receipt = await registry.register('defender').then(tx => tx.wait());
    const endSenderBalance = await provider.getBalance(sender.address);

    expect(receipt.events[0].event).to.equal('Registered');
    expect(await registry.owners('defender')).to.equal(sender.address);
    expect(await registry.names(sender.address)).to.equal('defender');
    expect(initialSenderBalance - endSenderBalance).to.above(0) // sender should pay for the gas
  });
});

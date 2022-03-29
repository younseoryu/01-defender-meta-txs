const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { signMetaTxRequest } = require("../../src/signer");

const provider = waffle.provider;
async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("contracts/Registry", function() {
  beforeEach(async function() {
    this.forwarder = await deploy('MinimalForwarder');
    this.registry = await deploy("Registry", this.forwarder.address);    
    this.accounts = await ethers.getSigners();
  });

  it("registers a name directly", async function() {
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

  it("registers a name via a meta-tx", async function() {
    const signer = this.accounts[2];
    const relayer = this.accounts[3];
    const forwarder = this.forwarder.connect(relayer);
    const registry = this.registry;

    const initialSignerBalance = await provider.getBalance(signer.address);
    const initialRelayerBalance = await provider.getBalance(relayer.address);

    const { request, signature } = await signMetaTxRequest(signer.provider, forwarder, {
      from: signer.address,
      to: registry.address,
      data: registry.interface.encodeFunctionData('register', ['meta-txs']),
    });
    
    await forwarder.execute(request, signature).then(tx => tx.wait());

    const endSignerBalance = await provider.getBalance(signer.address);
    const endRelayerBalance = await provider.getBalance(relayer.address);

    expect(await registry.owners('meta-txs')).to.equal(signer.address);
    expect(await registry.names(signer.address)).to.equal('meta-txs');
    expect(initialSignerBalance - endSignerBalance).to.equal(0); // signer should not spend any eth
    expect(initialRelayerBalance - endRelayerBalance).to.above(0); // relayer should pay for the gas
  });
});

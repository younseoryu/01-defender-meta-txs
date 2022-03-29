const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Burn", function () {
  it("Should burn addr1 tokens", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Wt = await ethers.getContractFactory("WrappedToken", owner);
    const wt = await upgrades.deployProxy(Wt, []);
    // Fund addr1 by minting 50 tokens from owner to addr1
    await wt.connect(owner).mint(addr1.address, 50);
    // Burn 30 token in addr 1
    await wt.connect(addr1).burn(40)
    expect(await wt.balanceOf(addr1.address)).to.equal(10);
    expect(await wt.totalSupply()).to.equal(10);
  });
});

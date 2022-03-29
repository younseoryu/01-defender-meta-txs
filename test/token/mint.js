const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Mint", function () {
  it("Should mint 50 tokens to an account", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Wt = await ethers.getContractFactory("WrappedToken", owner);
    const wt = await upgrades.deployProxy(Wt, []);
    // Mint 50 tokens from owner to addr1
    await wt.connect(owner).mint(addr1.address, 50);
    expect(await wt.balanceOf(addr1.address)).to.equal(50);
  });
});

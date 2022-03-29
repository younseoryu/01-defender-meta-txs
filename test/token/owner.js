const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Owner", function () {
  it("Should contract owner and signer owner be same", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Wt = await ethers.getContractFactory("WrappedToken");
    const wt = await upgrades.deployProxy(Wt, []);
    // This test expects the owner variable stored in the contract to be equal to our Signer's owner.
    expect(await wt.owner()).to.equal(owner.address);
  });

  it("Should be reverted as mint() is not called by the owner", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Wt = await ethers.getContractFactory("WrappedToken");
    const wt = await upgrades.deployProxy(Wt, []);
    // This test expects the function to be reverted
    await expect( wt.connect(addr1).mint(addr2.address, 50)).to.be.reverted;
  });
});

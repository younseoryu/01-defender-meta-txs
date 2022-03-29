const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
// const { ethers } = require("ethers");

describe("Cap", function () {
  it("Should not mint more than cap", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Wt = await ethers.getContractFactory("WrappedToken", owner);
    const wt = await upgrades.deployProxy(Wt, []);
    // mint more tokens than cap. Expected to be reverted
    await expect( wt.connect(owner).mint(addr1.address, ethers.utils.parseEther("1000000001.0") )).to.be.reverted;
    // mint as many tokens as the cap. Expected to be successful
    await expect( wt.connect(owner).mint(addr1.address, ethers.utils.parseEther("1000000000.0") )).to.not.be.reverted;
    // minting it will cause maxing out cap. Expected to be reverted
    await expect( wt.connect(owner).mint(addr1.address, ethers.utils.parseEther("0.000000000000000001") )).to.be.reverted;
  });
});
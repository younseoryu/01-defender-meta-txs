const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Transfer", function () {
    it("Should addr1 and addr2 have 30 and 20 tokens", async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Wt = await ethers.getContractFactory("WrappedToken", owner);
        const wt = await upgrades.deployProxy(Wt, []);
        
        // Fund addr1 by minting 50 tokens from owner to addr1
        await wt.connect(owner).mint(addr1.address, 50);
        // Transfer 30 token from addr 1 to add2
        await wt.connect(addr1).transfer(addr2.address, 20);
        // add1 should have 30, addr2 should have 20 tokens 
        expect(await wt.balanceOf(addr1.address)).to.equal(30);
        expect(await wt.balanceOf(addr2.address)).to.equal(20);
    });
    it("Should fail if sender doesn’t have enough tokens", async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Wt = await ethers.getContractFactory("WrappedToken", owner);
        const wt = await upgrades.deployProxy(Wt, []);

        const initialOwnerBalance = await wt.balanceOf(owner.address);
        // Try to send 1 token from addr1 (0 tokens) to owner (0 tokens).
        // `require` will evaluate false and revert the transaction.
        await expect(
            wt.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
        // Owner balance shouldn't have changed.
        expect(await wt.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
        );
    });
});

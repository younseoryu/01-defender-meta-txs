// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
// or use erc2771 https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/tree/master/contracts/metatx

contract WrappedToken is Initializable, ERC20Upgradeable, ERC20CappedUpgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, OwnableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer  {
        __ERC20_init("WrappedToken", "WT");
        __ERC20Burnable_init();
        __ERC20Capped_init(1000000000 * 10 ** decimals());
        __Pausable_init();
        __Ownable_init();
    }

    // function initialize(address forwarder) public initializer  {
    //     __ERC20_init("WrappedToken", "WT");
    //     __ERC20Burnable_init();
    //     __ERC20Capped_init(1000000000 * 10 ** decimals());
    //     __Pausable_init();
    //     __Ownable_init();
    //     __ERC2771Context_init(forwarder);
    // }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function metaTransfer(address to, uint256 amount) public returns (bool)  {
        address owner = msg.sender; // address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal 
        virtual
        override (ERC20CappedUpgradeable, ERC20Upgradeable)
    {
        super._mint(to, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interface/IBlastPoints.sol";
import "./interface/IBlast.sol";


contract Storefront is ERC721, ERC721Enumerable, ERC721Burnable, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    string private _baseDomain;

    // The Storefront NFT minting price
    uint256 private mintPrice;

    // Mapping User address with balance: used for withdrawal later
    mapping(address => uint256) public balance;

    // Claimable varible used for withdrawal when the event finishes
    bool public claimable;

    /** BlastPoints Point Operator contract address
    testnet BlastPointsAddress = 0x2fc95838c71e76ec69ff817983BFf17c710F34E0 
    mainnet BlastPointsAddress = 0x2536FE9ab3F511540F2f9e2eC2A805005C3Dd800
    */ 
    IBlastPoints public constant BLASTPOINT = IBlastPoints(0x2fc95838c71e76ec69ff817983BFf17c710F34E0);

    /** Blast yield contract address
    BlastAddress = 0x4300000000000000000000000000000000000002 
    */ 
    IBlast public constant BLAST = IBlast(0x4300000000000000000000000000000000000002);

    // Modifier
    modifier whenClaimable() {
        if (claimable == false) {
            revert();
        }
        _;
    }

    constructor(address initialOwner, address _pointsOperator, uint256 _mintPrice)
        ERC721("Storefront", "STR")
        Ownable(initialOwner)
    {
        mintPrice = _mintPrice;
        claimable = false;
        BLASTPOINT.configurePointsOperator(_pointsOperator);
        BLAST.configureClaimableYield();
        BLAST.configureClaimableGas(); 
        BLAST.configureGovernor(initialOwner);
        setBaseURI("https://flexing.site/v1/ipfs/");
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseDomain;
    }

    function safeMint(string memory uri) public payable {
        require(msg.value == mintPrice, "Insufficient Minting Price");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        balance[msg.sender] += mintPrice;   
    }

    function withdrawMintFee() public whenClaimable nonReentrant {
        uint256 senderBalance = balance[msg.sender];
        require(senderBalance > 0, "Sender didn't participate in the NFT Minting");

        balance[msg.sender] = 0;
        (bool success, ) = address(msg.sender).call{ value: senderBalance }("");
        require(success, "Withdrawal process failed to send");
    }

    // Setter
    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    function setClaimable(bool _claimable) public onlyOwner {
        claimable = _claimable;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseDomain = baseURI;
    }

    // Getter
    function getStorefrontBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalance(address user) public view returns (uint256) {
        return balance[user];
    }

    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }

    function getBaseURI() public view returns (string memory) {
        return _baseDomain;
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {}

    // Blast function
    function claimYield(address recipient, uint256 amount) external onlyOwner {
		BLAST.claimYield(address(this), recipient, amount);
    }

	function claimAllYield(address recipient) external onlyOwner {
		BLAST.claimAllYield(address(this), recipient);
    }

    function claimMyContractsGas() external onlyOwner {
        BLAST.claimAllGas(address(this), msg.sender);
    }
}

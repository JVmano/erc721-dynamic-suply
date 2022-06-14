// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftContract is ERC721A, Ownable, ReentrancyGuard {
  using Strings for uint256;

  bytes32 public merkleRoot;
  mapping(address => bool) public whitelistClaimed;

  string public uriPrefix = "";
  string public uriSuffix = ".json";
  string public hiddenMetadataUri;

  uint256 public cost;
  uint256 public maxSupply;
  uint256 public maxFree;
  uint256 public maxperAddressFreeLimit;
  uint256 public maxperAddressPublicMint;

  bool public paused = true;
  bool public whitelistMintEnabled = false;
  bool public revealed = false;

  mapping(address => uint256) public addressFreeMintedBalance;

  constructor(
      string memory _tokenName,
      string memory _tokenSymbol,
      uint256 _cost,
      uint256 _maxSupply,
      uint256 _maxFree,
      uint256 _maxperAddressFreeLimit,
      uint256 _maxperAddressPublicMint,
      string memory _hiddenMetadataUri
  ) ERC721A(_tokenName, _tokenSymbol) {
      setCost(_cost);
      maxSupply = _maxSupply;
      maxFree = _maxFree;
      setMaxperAddressFreeMint(_maxperAddressFreeLimit);
      setMaxperAddressPublicMint(_maxperAddressPublicMint);
      setHiddenMetadataUri(_hiddenMetadataUri);
  }

  modifier mintCompliance(uint256 _mintAmount) {
    require(_mintAmount > 0, "Can't mint 0");
    require(_mintAmount <= maxperAddressPublicMint, "Can't mint more than max mint");
    require(totalSupply() + _mintAmount <= maxSupply, "Max supply exceeded!");
    _;
  }

  modifier mintPriceCompliance(uint256 _mintAmount) {
    require(msg.value >= cost * _mintAmount, "Insufficient funds!");
    _;
  }

  function mintFree(uint256 _mintAmount) public payable nonReentrant {
    require(!paused, "The contract is paused!");
    uint256 s = totalSupply();
    uint256 addressFreeMintedCount = addressFreeMintedBalance[msg.sender];
    require(addressFreeMintedCount + _mintAmount <= maxperAddressFreeLimit, "max free NFT per address exceeded");
    require(_mintAmount > 0, "Can't mind 0");
    require(s + _mintAmount <= maxFree, "Can't go over free supply");
    for (uint256 i = 0; i < _mintAmount; ++i) {
      addressFreeMintedBalance[msg.sender]++;
    }
    _safeMint(msg.sender, _mintAmount);
    delete s;
    delete addressFreeMintedCount;
  }

  function mint(uint256 _mintAmount) public payable nonReentrant mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) {
    require(!paused, "The contract is paused!");
    uint256 s = totalSupply();
    require(s + _mintAmount <= maxSupply, "Can't go over supply");
    require(msg.value >= cost * _mintAmount);
    _safeMint(msg.sender, _mintAmount);
    delete s;
  }

  function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) {
    require(whitelistMintEnabled, "Whitelist sale not enabled!");
    require(!whitelistClaimed[msg.sender], "Address already claimed");
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(
      MerkleProof.verify(_merkleProof, merkleRoot, leaf),
      "Invalid Proof!"
    );

    whitelistClaimed[msg.sender] = true;
    _safeMint(msg.sender, _mintAmount);
  }

  function mintForAddress(uint256 _mintAmount, address _receiver)
      public
      onlyOwner
  {
      require(_mintAmount > 0 && _mintAmount <= maxperAddressPublicMint, "Invalid mint amount!");
      require(totalSupply() + _mintAmount <= maxSupply, "Max supply exceeded!");
      _safeMint(_receiver, _mintAmount);
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

  function walletOfOwner(address _owner) public view returns (uint256[] memory) {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
    uint256 currentTokenId = _startTokenId();
    uint256 ownedTokenIndex = 0;
    address latestOwnerAddress;

    while(
      ownedTokenIndex < ownerTokenCount && currentTokenId < _currentIndex
    ) {
      TokenOwnership memory ownership = _ownerships[currentTokenId];

      if (!ownership.burned) {
        if (ownership.addr != address(0)) {
          latestOwnerAddress = ownership.addr;
        }

        if (latestOwnerAddress == _owner) {
          ownedTokenIds[ownedTokenIndex] = currentTokenId;

          ownedTokenIndex++;
        }
      }

      currentTokenId++;
    }

    return ownedTokenIds;
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(_exists(_tokenId), "URI query nonexistant token");

    if (revealed == false) {
      return hiddenMetadataUri;
    }

    string memory currentBaseURI = _baseURI();
    return
      bytes(currentBaseURI).length > 0
        ? string(
            abi.encodePacked(
              currentBaseURI,
              _tokenId.toString(),
              uriSuffix
            )
        )
        : "";
  }

  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setRevealed(bool _state) public onlyOwner {
    revealed = _state;
  }

  function setMaxSupply(uint256 _supply) public onlyOwner {
    require(_supply <= maxSupply && _supply >= totalSupply(), "Cannot increase max supply!");
    maxSupply = _supply;
  }

  function setFreeMaxSupply(uint256 _freeSupply) public onlyOwner {
    require(_freeSupply >= totalSupply(), "Cannot increase free max supply!");
    maxFree = _freeSupply;
  }

  function setMaxperAddressPublicMint(uint256 _amount) public onlyOwner {
    maxperAddressPublicMint = _amount;
  }

  function setMaxperAddressFreeMint(uint256 _amount) public onlyOwner{
    maxperAddressFreeLimit = _amount;
  }

  function setHiddenMetadataUri(string memory _hiddenMetadataUri)
      public
      onlyOwner
  {
      hiddenMetadataUri = _hiddenMetadataUri;
  }

  function setUriPrefix(string memory _uriPrefix) public onlyOwner {
      uriPrefix = _uriPrefix;
  }

  function setUriSuffix(string memory _uriSuffix) public onlyOwner {
      uriSuffix = _uriSuffix;
  }

  function setPaused(bool _state) public onlyOwner {
      paused = _state;
  }

  function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
      merkleRoot = _merkleRoot;
  }

  function setWhitelistMintEnabled(bool _state) public onlyOwner {
      whitelistMintEnabled = _state;
  }

  function _baseURI() internal view virtual override returns (string memory) {
      return uriPrefix;
  }

  function withdraw() public onlyOwner nonReentrant {
      (bool os, ) = payable(owner()).call{value: address(this).balance}("");
      require(os);
  }

  // function withdrawAny(uint256 _amount) public payable onlyOwner {
  //     (bool success, ) = payable(msg.sender).call{value: _amount}("");
  //     require(success);
  // }
}
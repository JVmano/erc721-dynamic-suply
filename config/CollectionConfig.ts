import CollectionConfigInterface from "../lib/CollectionConfigInterface";
import * as Networks from "../lib/Networks";
import * as Marketplaces from "../lib/Marketplaces";
import whitelistAddresses from "./whitelist.json";

const CollectionConfig: CollectionConfigInterface = {
  rinkeby: Networks.ethereumTestnet,
  ropsten: Networks.ethereumRopsten,
  kovan: Networks.ethereumKovan,
  goerli: Networks.ethereumGoerli,
  mainnet: Networks.ethereumMainnet,
  // use yarn rename-contract NEW_CONTRACT_NAME
  contractName: "NftContract",
  tokenName: "NftContract",
  tokenSymbol: "MNT",
  hiddenMetadataUri: "ipfs://__CID__/hidden.json", // * the url to your hidden nft image before reveal
  maxperAddressFreeLimit: 1,
  maxperAddressPublicMint: 5,
  maxSupply: 200,
  maxFree: 50, // * use 0 if doesn't want to have free mint on your project
  whitelistSale: {
    price: 0.005,
    maxperAddressPublicMint: 1,
  },
  preSale: {
    price: 0.007,
    maxperAddressPublicMint: 2,
  },
  publicSale: {
    price: 0.009,
    maxperAddressPublicMint: 5,
  },
  contractAddress: null,
  marketplaceIdentifier: "my-nft-token",
  marketplaceConfig: Marketplaces.Opensea,
  whitelistAddresses,
};

export default CollectionConfig;

import NetworkConfigInterface from "../lib/NetworkConfigInterface";
import MarketplaceConfigInterface from "../lib/MarketplaceConfigInterface";

interface SaleConfig {
  price: number;
  maxperAddressPublicMint: number;
}

export default interface CollectionConfigInterface {
  rinkeby: NetworkConfigInterface;
  ropsten: NetworkConfigInterface;
  kovan: NetworkConfigInterface;
  goerli: NetworkConfigInterface;
  mainnet: NetworkConfigInterface;
  contractName: string;
  tokenName: string;
  tokenSymbol: string;
  hiddenMetadataUri: string;
  maxSupply: number;
  maxFree: number;
  maxperAddressFreeLimit: number;
  maxperAddressPublicMint: number;
  whitelistSale: SaleConfig;
  preSale: SaleConfig;
  publicSale: SaleConfig;
  contractAddress: string | null;
  marketplaceIdentifier: string;
  marketplaceConfig: MarketplaceConfigInterface;
  whitelistAddresses: string[];
}

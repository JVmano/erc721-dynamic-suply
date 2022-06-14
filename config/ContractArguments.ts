// eslint-disable-next-line node/no-unpublished-import
import { utils } from "ethers";
import CollectionConfig from "./CollectionConfig";

const ContractArguments = [
  CollectionConfig.tokenName,
  CollectionConfig.tokenSymbol,
  utils.parseEther(CollectionConfig.whitelistSale.price.toString()),
  CollectionConfig.maxSupply,
  CollectionConfig.maxFree,
  CollectionConfig.maxperAddressFreeLimit,
  CollectionConfig.whitelistSale.maxperAddressPublicMint,
  CollectionConfig.hiddenMetadataUri,
] as const;

export default ContractArguments;

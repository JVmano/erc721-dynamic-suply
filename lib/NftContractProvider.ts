// eslint-disable-next-line node/no-unpublished-import
import { ethers } from "hardhat";
import { NftContract as ContractType } from "../typechain/index";
import CollectionConfig from "./../config/CollectionConfig";

export default class NftContractProvider {
  public static async getContract(): Promise<ContractType> {
    // Check config
    if (
      CollectionConfig.contractAddress === null ||
      !CollectionConfig.contractAddress
    ) {
      throw new Error(
        "\x1b[31merror\x1b[0m " +
          "Please add the contract address to the configuration before running this command."
      );
    }

    if (
      (await ethers.provider.getCode(CollectionConfig.contractAddress)) === "0x"
    ) {
      throw new Error(
        "\x1b[31merror\x1b[0m " +
          `Can't find a contract deployed to the target address: ${CollectionConfig.contractAddress}`
      );
    }

    return (await ethers.getContractAt(
      CollectionConfig.contractName,
      CollectionConfig.contractAddress
    )) as ContractType;
  }
}

export type NftContractType = ContractType;

import hre, { ethers } from "hardhat";
import CollectionConfig from "../config/CollectionConfig";
import { NftContractType } from "../lib/NftContractProvider";
import ContractArguments from "./../config/ContractArguments";

async function main() {
  console.log("Re running compilation...");

  await hre.run("compile");

  console.log("Deploying contract...");

  const Contract = await ethers.getContractFactory(
    CollectionConfig.contractName
  );
  const contract = (await Contract.deploy(
    ...ContractArguments
  )) as NftContractType;

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

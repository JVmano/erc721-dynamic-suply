import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import CollectionConfig from "./../config/CollectionConfig";
import NftContractProvider from "../lib/NftContractProvider";

async function main() {
  // Check config
  if (CollectionConfig.whitelistAddresses.length < 1) {
    throw new Error(
      "\x1b[31merror\x1b[0m " +
        "The whitelist is empty, please add some addresses to the configuration."
    );
  }

  // build the merkle tree
  const leafNodes = CollectionConfig.whitelistAddresses.map((addr) =>
    keccak256(addr)
  );
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const rootHash = "0x" + merkleTree.getRoot().toString("hex");

  // attach to deployed contract
  const contract = await NftContractProvider.getContract();

  // update stage price (if needed)
  const whitelistPrice = utils.parseEther(
    CollectionConfig.whitelistSale.price.toString()
  );
  if (!(await (await contract.cost()).eq(whitelistPrice))) {
    console.log(
      `Updating the token price to ${CollectionConfig.whitelistSale.price} ${CollectionConfig.mainnet.symbol}...`
    );

    await (await contract.setCost(whitelistPrice)).wait();
  }

  // update max amount per TX (if needed)
  if (
    !(await (
      await contract.maxperAddressPublicMint()
    ).eq(CollectionConfig.whitelistSale.maxperAddressPublicMint))
  ) {
    console.log(
      `Updating the max mint amount per TX to ${CollectionConfig.whitelistSale.maxperAddressPublicMint}...`
    );

    await (
      await contract.setMaxperAddressPublicMint(
        CollectionConfig.whitelistSale.maxperAddressPublicMint
      )
    ).wait();
  }

  // update root hash (if changed)
  if ((await contract.merkleRoot()) !== rootHash) {
    console.log(`Updating the root hash to: ${rootHash}`);

    await (await contract.setMerkleRoot(rootHash)).wait();
  }

  // enable whitelist sale (if needed)
  if (!(await contract.whitelistMintEnabled())) {
    console.log("Enabling whitelist sale...");

    await (await contract.setWhitelistMintEnabled(true)).wait();
  }

  console.log("Whitelist sale has been enabled!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

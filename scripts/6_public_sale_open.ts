import { utils } from "ethers";
import CollectionConfig from "./../config/CollectionConfig";
import NftContractProvider from "../lib/NftContractProvider";

async function main() {
  // Attach to deployed contract
  const contract = await NftContractProvider.getContract();

  if (await contract.whitelistMintEnabled()) {
    throw new Error(
      "\x1b[31merror\x1b[0m " +
        "Please close the whitelist sale before opening a public sale."
    );
  }

  // Update sale price (if needed)
  const publicSalePrice = utils.parseEther(
    CollectionConfig.publicSale.price.toString()
  );
  if (!(await (await contract.cost()).eq(publicSalePrice))) {
    console.log(
      `Updating the token price to ${CollectionConfig.publicSale.price} ${CollectionConfig.mainnet.symbol}...`
    );

    await (await contract.setCost(publicSalePrice)).wait();
  }

  // Update max amount per TX (if needed)
  if (
    !(await (
      await contract.maxperAddressPublicMint()
    ).eq(CollectionConfig.publicSale.maxperAddressPublicMint))
  ) {
    console.log(
      `Updating the max mint amount per TX to ${CollectionConfig.publicSale.maxperAddressPublicMint}...`
    );

    await (
      await contract.setMaxperAddressPublicMint(
        CollectionConfig.publicSale.maxperAddressPublicMint
      )
    ).wait();
  }

  // Unpause the contract (if needed)
  if (await contract.paused()) {
    console.log("Unpausing the contract...");

    await (await contract.setPaused(false)).wait();
  }

  console.log("Public sale is now open!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# ERC721 Dynamic Supply
This is a erc721 smart contract with the possibility of changing the collection cost, free mint supply and paid supply at any time on a deployed contract.

## How to use
All the configuration needed are in ``config/CollectionConfig.ts`` for max supply, contract name and others.
Sensitive data need to be stored in a env file so copy the ``.env.example`` file and rename it to ``.env`` and insert the data.

The package.json file have all the commands to operate this project but here's a quick look for the most crucial steps:

1. Install the dependencies with ``yarn install`` or ``npm install``.
2. Set up the information needed described above.
3. Use ``yarn deploy --network [testnet or mainnet]`` to deploy the contract to a network.
4. Verify the deployed contract with ``yarn verify [given contract address by deploy command] --network [network used above]``
5. There's three stage that can be used in contract like:

  ```yarn whitelist-open --network [network]```

  ```yarn presale-open --network [network]```

  ```yarn public-sale-open --network [network]```

For all these commands there are a close stage option by changing open to close with the same parameters.

6. To reveal the NFT deployed on the contract use ``yarn reveal --network [network]``
7. Finally to withdraw the ETH from the contract wallet use ``yarn withdraw --network [network]``

## Why?
The idea of this project was to simpy study solidity and how this can be functional in real world NFT collections although this project can be used in production, this ins't the best code possible and can enhanced in the future.

## Disclaimer
This code was **heavily** based on [Hashlips smart contract repository](https://github.com/hashlips-lab/nft-erc721-collection/tree/main/smart-contract) so give a star on that project too!

## Found a bug?
Create a issue in the repo or simply create a pull request with the solution and a description about it (I'll thank a lot)

import MarketplaceConfigInterface from "./MarketplaceConfigInterface";

export const Opensea: MarketplaceConfigInterface = {
  name: "Opensea",
  generateCollectionUrl: (marketplaceIdentifier: string, isMainnet: boolean) =>
    "https://" +
    (isMainnet ? "www" : "testnets") +
    ".opensea.io/collection/" +
    marketplaceIdentifier,
};

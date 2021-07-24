import BN from "bn.js";
import * as StellarSdk from "stellar-sdk";
import * as shared from "../shared";

const price = {
  GOLD: new BN(100),
  ETH: new BN(3000),
  BOND: new BN(2323),
  APPL: new BN(420),
};

export function getAssetPrice(code: string): BN {
  if (!Object.keys(price).includes(code)) {
    throw new Error("couldnt get price");
  }
  //@ts-ignore
  return price[code];
}

export function getAssetsData(assets: StellarSdk.Asset[], balancePerAsset: BN) {
  return assets.map((a) => {
    const assetPrice = getAssetPrice(a.code);
    const buyAmount = shared.BNtoStellarString(balancePerAsset.div(assetPrice));
    const price = shared.BNtoStellarString(assetPrice);
    return {
      buyAmount,
      price,
      asset: a,
    };
  });
}

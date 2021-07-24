import BN from "bn.js";
import * as StellarSdk from "stellar-sdk";
import * as shared from "../shared";

const price = {
  // in terms of XLM
  GOLD: new BN(1).mul(shared.decimals),
  ETH: new BN(4).mul(shared.decimals),
  BOND: new BN(2).mul(shared.decimals),
  APPL: new BN(10).mul(shared.decimals),
};

export function getXLMUnitPrice(code: string): BN {
  return shared.decimals
    .mul(shared.decimals)
    .div(getAssetUnitPrice(code))
}

export function getAssetUnitPrice(code: string): BN {
  if (!Object.keys(price).includes(code)) {
    throw new Error("couldnt get price");
  }
  //@ts-ignore
  return price[code];
}

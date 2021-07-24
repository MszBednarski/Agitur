import BN from "bn.js";
import * as StellarSdk from "stellar-sdk";
import * as shared from "../shared";



const price = {
  // in terms of XLM
  GOLD: new BN(100).mul(shared.decimals),
  ETH: new BN(3000).mul(shared.decimals),
  BOND: new BN(2323).mul(shared.decimals),
  APPL: new BN(420).mul(shared.decimals),
};

export function getAssetPrice(code: string): BN {
  if (!Object.keys(price).includes(code)) {
    throw new Error("couldnt get price");
  }
  //@ts-ignore
  return price[code];
}

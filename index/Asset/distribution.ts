import { assetKeys } from "./config";
import * as StellarSdk from "stellar-sdk";
import { getKeypair } from "../shared";
import { AssetKeypair } from "./interfaces";

export function getDistributionKeypairs(): AssetKeypair[] {
  return assetKeys.map((k) => ({
    code: k,
    keypair: getKeypair(getDistAccountName(k)),
  }));
}

export function getDistAccountName(assetKey: string) {
  return `${assetKey}_DIST`;
}

export async function createDistributionAccountKeypairs() {
  assetKeys.map((k) => {
    const key = StellarSdk.Keypair.random();
    console.log(`${getDistAccountName(k)}=${key.secret()}`);
  });
}

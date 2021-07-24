import { assetKeys } from "./config";
import * as StellarSdk from "stellar-sdk";
import { getKeypair } from "../shared";

export function getDistributionKeypairs() {
  return assetKeys.map((k) => getKeypair(getDistAccountName(k)));
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

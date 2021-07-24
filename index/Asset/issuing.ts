import { assetKeys } from "./config";
import * as StellarSdk from "stellar-sdk";
import { getKeypair } from "../shared";
import { AssetKeypair } from "./interfaces";

export function getIssuingKeypairs(): AssetKeypair[] {
  return assetKeys.map((k) => ({
    code: k,
    keypair: getKeypair(k),
  }));
}

export async function createIssuingAccountKeypairs() {
  assetKeys.map((k) => {
    const key = StellarSdk.Keypair.random();
    console.log(`${k}=${key.secret()}`);
  });
}

import { assetKeys } from "./config";
import * as StellarSdk from "stellar-sdk";
import { getKeypair } from "../shared";

export function getIssuingKeypairs() {
  return assetKeys.map((k) => getKeypair(k));
}

export async function createIssuingAccountKeypairs() {
  assetKeys.map((k) => {
    const key = StellarSdk.Keypair.random();
    console.log(`${k}=${key.secret()}`);
  });
}

import * as StellarSdk from "stellar-sdk";

export interface AssetKeypair {
  code: string;
  keypair: StellarSdk.Keypair;
}

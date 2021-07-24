import * as StellarSdk from "stellar-sdk";
import { TX } from "../shared";
import { AssetKeypair } from "./interfaces";

export async function changeTrust(
  both: {
    issuing: AssetKeypair;
    distribution: AssetKeypair;
  }[],
  lim?: string
) {
  for (let pair of both) {
    await TX(pair.distribution.keypair, async (tx) => {
      const toSpread: { limit?: string } = {};
      if (lim) {
        toSpread.limit = lim;
      }
      tx = tx.addOperation(
        // this operation funds the new account with XLM
        StellarSdk.Operation.changeTrust({
          asset: new StellarSdk.Asset(
            pair.issuing.code,
            pair.issuing.keypair.publicKey()
          ),
          ...toSpread,
        })
      );
      return tx.setTimeout(30).build();
    });
  }
}

export async function issueAsset(
  both: {
    issuing: AssetKeypair;
    distribution: AssetKeypair;
  }[],
  amount: string
) {
  for (let pair of both) {
    await TX(pair.issuing.keypair, async (tx) => {
      tx = tx.addOperation(
        // this operation funds the new account with XLM
        StellarSdk.Operation.payment({
          destination: pair.distribution.keypair.publicKey(),
          asset: new StellarSdk.Asset(
            pair.issuing.code,
            pair.issuing.keypair.publicKey()
          ),
          amount,
        })
      );
      return tx.setTimeout(30).build();
    });
  }
}

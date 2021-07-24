import * as StellarSdk from "stellar-sdk";
import BN from "bn.js";
import * as asset from "../Asset";
import * as shared from "../shared";
import * as oracle from "../Oracle";

function getIssuingAndDistPairs() {
  const issuing = asset.getIssuingKeypairs();
  const dist = asset.getDistributionKeypairs();
  return issuing.map((i, index) => ({ issuing: i, distribution: dist[index] }));
}

export async function logDistributionAccounts() {
  const pairs = getIssuingAndDistPairs();
  pairs.map((p) => shared.logBalance(p.distribution.keypair.publicKey()));
}

export async function listAssets(assetsAmount: BN) {
  const pairs = getIssuingAndDistPairs();
  for (const pair of pairs) {
    await shared.TX(pair.distribution.keypair, async (tx) => {
      tx = tx.addOperation(
        StellarSdk.Operation.manageSellOffer({
          selling: new StellarSdk.Asset(
            pair.issuing.code,
            pair.issuing.keypair.publicKey()
          ),
          buying: StellarSdk.Asset.native(),
          price: shared.BNtoStellarString(
            oracle.getAssetPrice(pair.issuing.code)
          ),
          amount: shared.BNtoStellarString(assetsAmount),
          offerId: 0,
        })
      );
      return tx.setTimeout(30).build();
    });
  }
}

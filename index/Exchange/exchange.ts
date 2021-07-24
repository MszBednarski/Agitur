import * as StellarSdk from "stellar-sdk";
import BN from "bn.js";
import * as asset from "../Asset";
import * as shared from "../shared";
import * as oracle from "../Oracle";

export function getIssuingAndDistPairs() {
  const issuing = asset.getIssuingKeypairs();
  const dist = asset.getDistributionKeypairs();
  return issuing.map((i, index) => ({ issuing: i, distribution: dist[index] }));
}

export function getAssets() {
  return getIssuingAndDistPairs().map(
    (p) => new StellarSdk.Asset(p.issuing.code, p.issuing.keypair.publicKey())
  );
}

export async function logAssetSells() {
  getIssuingAndDistPairs().map((p) =>
    shared.server
      .offers()
      .selling(
        new StellarSdk.Asset(p.issuing.code, p.issuing.keypair.publicKey())
      )
      .call()
      .then((p) => console.log(p.records))
  );
}

export async function logDistribution() {
  getIssuingAndDistPairs().map((p) =>
    shared.logBalance(p.distribution.keypair.publicKey())
  );
}

export async function logOffers() {
  getIssuingAndDistPairs().map((p) =>
    shared.server
      .offers()
      .forAccount(p.distribution.keypair.publicKey())
      .call()
      .then((p) => console.log(p.records))
  );
}

export async function takeDownOffers() {
  getIssuingAndDistPairs().map((p) =>
    shared.server
      .offers()
      .forAccount(p.distribution.keypair.publicKey())
      .call()
      .then((page) => {
        shared.TX(p.distribution.keypair, async (tx) => {
          for (const offer of page.records) {
            const asset = new StellarSdk.Asset(
              p.issuing.code,
              p.issuing.keypair.publicKey()
            );
            if (offer.buying.asset_code == "native") {
              tx = tx.addOperation(
                StellarSdk.Operation.manageSellOffer({
                  selling: asset,
                  buying: StellarSdk.Asset.native(),
                  price: shared.BNtoStellarString(
                    oracle.getAssetUnitPrice(p.issuing.code)
                  ),
                  amount: "0",
                  offerId: offer.id,
                })
              );
            } else {
              tx = tx.addOperation(
                StellarSdk.Operation.manageSellOffer({
                  selling: StellarSdk.Asset.native(),
                  buying: asset,
                  price: shared.BNtoStellarString(
                    oracle.getXLMUnitPrice(p.issuing.code)
                  ),
                  amount: "0",
                  offerId: offer.id,
                })
              );
            }
          }
          return tx.setTimeout(30).build();
        });
      })
  );
}

export async function makeMarket(assetsAmount: BN) {
  const pairs = getIssuingAndDistPairs();
  for (const pair of pairs) {
    const asset = new StellarSdk.Asset(
      pair.issuing.code,
      pair.issuing.keypair.publicKey()
    );
    const assetUnitPrice = oracle.getAssetUnitPrice(pair.issuing.code);
    const xlmUnitPrice = oracle.getXLMUnitPrice(pair.issuing.code);
    shared.TX(pair.distribution.keypair, async (tx) => {
      tx = tx
        .addOperation(
          StellarSdk.Operation.createPassiveSellOffer({
            selling: asset,
            buying: StellarSdk.Asset.native(),
            // Price of 1 unit of selling in terms of buying.
            price: shared.BNtoStellarString(assetUnitPrice),
            amount: shared.BNtoStellarString(assetsAmount),
          })
        )
        .addOperation(
          StellarSdk.Operation.createPassiveSellOffer({
            selling: StellarSdk.Asset.native(),
            buying: asset,
            price: shared.BNtoStellarString(xlmUnitPrice),
            amount: shared.BNtoStellarString(
              // mirrored amount of xlm
              assetsAmount.mul(assetUnitPrice).div(shared.decimals)
            ),
          })
        );
      return tx.setTimeout(30).build();
    });
  }
}

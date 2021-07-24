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

export async function logDistributionAccounts() {
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

export async function takeDownOffers() {
  getIssuingAndDistPairs().map((p) =>
    shared.server
      .offers()
      .selling(
        new StellarSdk.Asset(p.issuing.code, p.issuing.keypair.publicKey())
      )
      .call()
      .then((page) => {
        shared.TX(p.distribution.keypair, async (tx) => {
          for (const offer of page.records) {
            tx = tx.addOperation(
              StellarSdk.Operation.manageSellOffer({
                selling: new StellarSdk.Asset(
                  p.issuing.code,
                  p.issuing.keypair.publicKey()
                ),
                buying: StellarSdk.Asset.native(),
                price: shared.BNtoStellarString(
                  oracle.getAssetPrice(p.issuing.code)
                ),
                amount: "0",
                offerId: offer.id,
              })
            );
          }
          return tx.setTimeout(30).build();
        });
      })
  );
}

export async function listAssets(assetsAmount: BN) {
  const pairs = getIssuingAndDistPairs();
  for (const pair of pairs) {
    shared.TX(pair.distribution.keypair, async (tx) => {
      tx = tx.addOperation(
        StellarSdk.Operation.manageSellOffer({
          //ex selling 100 gold
          selling: new StellarSdk.Asset(
            pair.issuing.code,
            pair.issuing.keypair.publicKey()
          ),
          // thus buying 1000 xlm
          buying: StellarSdk.Asset.native(),
          //	Price of 1 unit of selling in terms of buying.
          // 1 gold costs 10
          price: shared.BNtoStellarString(
            oracle.getAssetPrice(pair.issuing.code)
          ),
          // total amount of GOLD we are selling
          amount: shared.BNtoStellarString(assetsAmount),
          offerId: 0,
        })
      );
      return tx.setTimeout(30).build();
    });
  }
}

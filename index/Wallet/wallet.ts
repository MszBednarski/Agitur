import * as StellarSdk from "stellar-sdk";
import { Keypair } from "stellar-sdk";
import * as shared from "../shared";
import BN from "bn.js";
import * as oracle from "../Oracle";

export async function optIntoAssets(
  walletAcc: StellarSdk.Keypair,
  assets: StellarSdk.Asset[]
) {
  for (let asset of assets) {
    await shared.TX(walletAcc, async (tx) => {
      tx = tx.addOperation(
        StellarSdk.Operation.changeTrust({
          asset: asset,
        })
      );
      return tx.setTimeout(30).build();
    });
  }
}

export async function createWallet(
  from: Keypair,
  pubKey: string,
  startingBalance: string
) {
  await shared.TX(from, async (tx) => {
    tx = tx.addOperation(
      StellarSdk.Operation.createAccount({
        destination: pubKey,
        startingBalance,
      })
    );
    return tx.setTimeout(30).build();
  });
}

export function getWallet() {
  return shared.getKeypair("WALLET");
}

export async function logWallet() {
  await shared.logBalance(getWallet().publicKey());
}

export async function createAssetOrders(
  walletAcc: StellarSdk.Keypair,
  assets: StellarSdk.Asset[],
  balance: BN
) {
  const balancePerAsset = balance.div(new BN(assets.length));
  const assetsData = assets.map((a) => {
    /**
     * balancePerAsset * 10^7 / price
     */
    const assetPrice = oracle.getAssetPrice(a.code);
    const buyAmount = shared.BNtoStellarString(
      balancePerAsset.mul(shared.decimals).div(assetPrice)
    );
    const price = shared.BNtoStellarString(assetPrice);
    return {
      buyAmount,
      price,
      asset: a,
    };
  });
  console.log({ balanceToConvert: shared.BNtoStellarString(balance) });
  console.log({ balancePerAsset: shared.BNtoStellarString(balancePerAsset) });
  console.log(assetsData);
  await shared.TX(walletAcc, async (tx) => {
    for (let data of assetsData) {
      tx = tx.addOperation(
        StellarSdk.Operation.manageBuyOffer({
          selling: StellarSdk.Asset.native(),
          buying: data.asset,
          // The total amount you're buying. If 0, deletes the offer.
          buyAmount: data.buyAmount,
          // Price of 1 unit of buying in terms of selling.
          price: data.price,
          offerId: 0,
        })
      );
    }
    return tx.setTimeout(30).build();
  });
}

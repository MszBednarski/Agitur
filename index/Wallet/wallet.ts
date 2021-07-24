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
  const assetsData = oracle.getAssetsData(assets, balancePerAsset);
  console.log(assetsData);
  await shared.TX(walletAcc, async (tx) => {
    for (let data of assetsData) {
      tx = tx.addOperation(
        StellarSdk.Operation.manageBuyOffer({
          selling: StellarSdk.Asset.native(),
          buying: data.asset,
          buyAmount: data.buyAmount,
          price: data.price,
          offerId: 0,
        })
      );
    }
    return tx.setTimeout(30).build();
  });
}

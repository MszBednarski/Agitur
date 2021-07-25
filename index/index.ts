require("dotenv").config();
import * as StellarSdk from "stellar-sdk";
import * as shared from "./shared";
import * as asset from "./Asset";
import * as wallet from "./Wallet";
import * as exchange from "./Exchange";
import { BN } from "bn.js";

async function getEths() {
  const code = "ETH";
  console.log(code);
  const eths = [];
  let page = await shared.server.assets().forCode(code).order("desc").call();
  while (page.records.length != 0) {
    console.log(page.records);
    eths.push(...page.records);
    page = await page.next();
  }
}

async function logMain() {
  await shared.logBalance(shared.getKeypair("SECRET").publicKey());
}

(async () => {
  // await logMain();
  await wallet.logWallet();
  // exchange.logAssetSells();
  exchange.logDistribution()
  // exchange.logOffers();
  // exchange.takeDownOffers()
  // exchange.makeMarket(shared.decimals.mul(new BN(2)));
  // wallet.takeDownOffers()

  // await shared.TX(shared.getKeypair("SECRET"), async (tx) => {
  //   for (const pair of exchange.getIssuingAndDistPairs()) {
  //     tx = tx.addOperation(
  //       StellarSdk.Operation.payment({
  //         destination: pair.distribution.keypair.publicKey(),
  //         asset: StellarSdk.Asset.native(),
  //         amount: "100",
  //       })
  //     );
  //   }
  //   return tx.setTimeout(30).build();
  // });
  // asset.issueAsset(exchange.getIssuingAndDistPairs(), "15");
  // await exchange.listBuyOfAssets(new BN(200))
  // await wallet.takeDownOffers();
  // await wallet.sellDiversifiedPortfolio(
  //   wallet.getWallet(),
  //   exchange.getAssets()
  // );
  // await exchange.logAssetSells();
  // await exchange.takeDownOffers();
  // await exchange.listAssets(new BN(100000000));
  // await wallet.diversifyXLM(
  //   wallet.getWallet(),
  //   exchange.getAssets(),
  //   // diversify 9 XLM
  //   new BN(90000001)
  // );
})();

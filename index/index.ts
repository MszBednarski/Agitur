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
  // await exchange.logDistributionAccounts();
  // await exchange.takeDownOffers();
  // await exchange.listAssets(new BN(100000000));
  // await wallet.createAssetOrders(
  //   wallet.getWallet(),
  //   exchange.getAssets(),
  //   // diversify 9 XLM
  //   new BN(90000001)
  // );
})();

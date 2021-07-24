require("dotenv").config();
import * as StellarSdk from "stellar-sdk";
import * as shared from "./shared";
import * as asset from "./Asset";
import * as exchange from "./Exchange";
import * as wallet from "./Wallet";

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

function getIssuingAndDistPairs() {
  const issuing = asset.getIssuingKeypairs();
  const dist = asset.getDistributionKeypairs();
  return issuing.map((i, index) => ({ issuing: i, distribution: dist[index] }));
}

(async () => {
  await logMain();
  await wallet.logWallet();
  const pairs = getIssuingAndDistPairs();
})();

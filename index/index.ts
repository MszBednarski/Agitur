require("dotenv").config();
import * as StellarSdk from "stellar-sdk";
import { getKeypair, server, logBalance, fundAccounts } from "./shared";
import { getDistributionKeypairs, getIssuingKeypairs } from "./Asset";

const acc = getKeypair("SECRET");

async function test() {
  const account = await server.loadAccount(acc.publicKey());
  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: fee + "",
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      // this operation funds the new account with XLM
      StellarSdk.Operation.payment({
        destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
        asset: StellarSdk.Asset.native(),
        amount: "2",
      })
    )
    .setTimeout(30)
    .build();
  // sign the transaction
  transaction.sign(acc);
  try {
    const transactionResult = await server.submitTransaction(transaction);
    console.log(transactionResult);
  } catch (err) {
    console.error(err);
  }
}

async function getEths() {
  const code = "ETH";
  console.log(code);
  const eths = [];
  let page = await server.assets().forCode(code).order("desc").call();
  while (page.records.length != 0) {
    console.log(page.records);
    eths.push(...page.records);
    page = await page.next();
  }
}

async function logMain() {
  await logBalance(acc.publicKey());
}

(async () => {
  await logMain();
    // const issuing = getIssuingKeypairs();
    // issuing.map((i) => logBalance(i.publicKey()));
    // const dist = getDistributionKeypairs();
    // dist.map((i) => logBalance(i.publicKey()));

})();

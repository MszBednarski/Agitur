require("dotenv").config();
import * as StellarSdk from "stellar-sdk";
import { getSecret } from "./utill";
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const acc = StellarSdk.Keypair.fromSecret(getSecret());
console.log(acc);

(async () => {
  //   const account = await server.loadAccount(publicKey);
  //   /*
  //         Right now, we have one function that fetches the base fee.
  //         In the future, we'll have functions that are smarter about suggesting fees,
  //         e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
  //     */
  //   const fee = await server.fetchBaseFee();
  //   const transaction = new StellarSdk.TransactionBuilder(account, {
  //     fee: fee + "",
  //     networkPassphrase: StellarSdk.Networks.TESTNET,
  //   })
  //     .addOperation(
  //       // this operation funds the new account with XLM
  //       StellarSdk.Operation.payment({
  //         destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
  //         asset: StellarSdk.Asset.native(),
  //         amount: "2",
  //       })
  //     )
  //     .setTimeout(30)
  //     .build();
  //   // sign the transaction
  //   transaction.sign(StellarSdk.Keypair.fromSecret(secretString));
  //   try {
  //     const transactionResult = await server.submitTransaction(transaction);
  //     console.log(transactionResult);
  //   } catch (err) {
  //     console.error(err);
  //   }
})();

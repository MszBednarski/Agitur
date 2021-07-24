import * as StellarSdk from "stellar-sdk";

export function getKeypair(key: string) {
  return StellarSdk.Keypair.fromSecret(getSecret(key));
}

export const server = new StellarSdk.Server(
  "https://horizon-testnet.stellar.org"
);

export function getSecret(name: string) {
  const key = process.env[name];
  if (!key) {
    throw new Error(`No ${name} in .env`);
  }
  return key;
}

export async function TX<T extends StellarSdk.Memo<StellarSdk.MemoType>>(
  tx: (
    account: StellarSdk.AccountResponse,
    fee: string
  ) => Promise<StellarSdk.Transaction<T>>
) {
  const acc = getKeypair("SECRET");
  const account = await server.loadAccount(acc.publicKey());
  const fee = (await server.fetchBaseFee()) + "";
  const trans = await tx(account, fee);
  trans.sign(acc);
  try {
    await server.submitTransaction(trans);
    const res = await server
      .transactions()
      .forAccount(acc.publicKey())
      .limit(1)
      .call();
    console.log(res.records[0]._links.self);
  } catch (err) {
    console.error(err.response.data.extras.result_codes);
  }
}

export async function logBalance(pubkey: string) {
  const account = await server.loadAccount(pubkey);
  console.log(account.account_id);
  console.log(account.balances);
}

export async function createAccounts(
  accountIds: string[],
  startingBalance: string
) {
  await TX(async (a, fee) => {
    let tx = new StellarSdk.TransactionBuilder(a, {
      fee: fee,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    for (let acc of accountIds) {
      tx = tx.addOperation(
        // this operation funds the new account with XLM
        StellarSdk.Operation.createAccount({
          destination: acc,
          startingBalance: startingBalance,
        })
      );
    }
    return tx.setTimeout(30).build();
  });
}

export async function fundAccounts(accountIds: string[], num: string) {
  await TX(async (a, fee) => {
    let tx = new StellarSdk.TransactionBuilder(a, {
      fee: fee,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    for (let acc of accountIds) {
      tx = tx.addOperation(
        // this operation funds the new account with XLM
        StellarSdk.Operation.payment({
          destination: acc,
          asset: StellarSdk.Asset.native(),
          amount: num,
        })
      );
    }
    return tx.setTimeout(30).build();
  });
}

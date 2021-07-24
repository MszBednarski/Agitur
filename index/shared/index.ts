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
  from: StellarSdk.Keypair,
  txFunction: (
    tx: StellarSdk.TransactionBuilder
  ) => Promise<StellarSdk.Transaction<T>>
) {
  const acc = from;
  const account = await server.loadAccount(acc.publicKey());
  const fee = (await server.fetchBaseFee()) + "";
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: fee,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });
  const trans = await txFunction(tx);
  trans.sign(acc);
  try {
    const res = await server.submitTransaction(trans);
    console.log(res);
  } catch (err) {
    console.error(err.response.data.extras.result_codes);
  }
}

export async function logBalance(pubkey: string) {
  const account = await server.loadAccount(pubkey);
  console.log(account.account_id);
  console.log(account.balances);
}
export async function logAccount(pubkey: string) {
  const account = await server.loadAccount(pubkey);
  console.log(account);
}

export async function createAccounts(
  accountIds: string[],
  startingBalance: string
) {
  await TX(getKeypair("SECRET"), async (tx) => {
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
  await TX(getKeypair("SECRET"), async (tx) => {
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

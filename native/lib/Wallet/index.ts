import {makeAutoObservable, runInAction} from 'mobx';
import {getSecret, storeSecret} from './storage';
import * as StellarSdk from 'stellar-sdk';

const initWalletInfo: {pubkey: string} = {pubkey: ''};

class WalletManager {
  loading = true;
  walletExists = false;
  walletInfo = initWalletInfo;
  private pair: StellarSdk.Keypair | undefined;
  constructor() {
    makeAutoObservable(this);
  }
  async init() {
    const secret = await getSecret();
    const walletExists = !!secret;
    if (walletExists) {
      const pair = StellarSdk.Keypair.fromSecret(secret as string);
      runInAction(() => {
        this.walletInfo = {pubkey: pair.publicKey()};
        this.pair = pair;
      });
    }
    runInAction(() => {
      this.loading = false;
      this.walletExists = walletExists;
    });
  }
  async createWallet() {
    const random = StellarSdk.Keypair.random();
    const secret = random.secret();
    await storeSecret(secret);
    this.init();
  }
}

export const walletManager = new WalletManager();

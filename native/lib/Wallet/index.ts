import {makeAutoObservable, runInAction} from 'mobx';
import {getSecret, storeSecret} from './storage';
// import * as StellarSdk from 'stellar-sdk';

class WalletManager {
  loading = true;
  walletExists = false;
  constructor() {
    makeAutoObservable(this);
  }
  async init() {
    const secret = await getSecret();
    const walletExists = !!secret;
    if (walletExists) {
    }
    runInAction(() => {
      this.loading = false;
      this.walletExists = walletExists;
    });
  }
  async createWallet() {
    // const random = StellarSdk.Keypair.random();
    // const secret = random.secret();
    // await storeSecret(secret);
    // this.init();
  }
}

export const walletManager = new WalletManager();

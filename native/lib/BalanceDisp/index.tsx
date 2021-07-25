import React from 'react';
import {observer} from 'mobx-react-lite';
import {makeAutoObservable, runInAction} from 'mobx';
import {getNewServer} from '../shared';
import {View} from 'react-native';
import {useEffect, useMemo} from 'react';
import {AssetResponse, OfferResponse, SomeAsset} from './interfaces';
import * as StellarSdk from 'stellar-sdk';
import {Section} from '../Section';

class BalanceDispState {
  assetBalances: AssetResponse[] = [];
  native: {balance: string} = {balance: '0'};
  offers: OfferResponse[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  getDisp(pubkey: string) {
    const unmount1 = getNewServer()
      .accounts()
      .accountId(pubkey)
      .cursor('now')
      .stream({
        onmessage: message => {
          const assets = message.balances.filter(
            b => b.asset_type != 'native',
          ) as AssetResponse[];
          const native = message.balances.filter(
            b => b.asset_type == 'native',
          )[0];
          runInAction(() => {
            this.assetBalances = assets;
            this.native = native;
          });
        },
      });
    getNewServer()
      .accounts()
      .accountId(pubkey)
      .call()
      .then(message => {
        const assets = message.balances.filter(
          b => b.asset_type != 'native',
        ) as AssetResponse[];
        const native = message.balances.filter(
          b => b.asset_type == 'native',
        )[0];
        runInAction(() => {
          this.assetBalances = assets;
          this.native = native;
        });
      });
    const handleOffer = async (
      page: StellarSdk.ServerApi.CollectionPage<StellarSdk.ServerApi.OfferRecord>,
    ) => {
      const offers = page.records as OfferResponse[];
      runInAction(() => {
        this.offers = offers;
      });
    };
    getNewServer()
      .offers()
      .forAccount(pubkey)
      .call()
      .then(page => handleOffer(page));
    return unmount1;
  }

  private getAssetString(asset: OfferResponse['buying']) {
    if (asset.asset_type == 'native') {
      return 'XLM';
    }
    const someAsset = asset as SomeAsset;
    return `${someAsset.asset_code}`;
  }
  get disp() {
    return (
      <>
        <Section title={'XLM'}>{`Balance: ${this.native.balance}`}</Section>
        {this.assetBalances.map(asset => (
          <Section
            key={`assetdisp${asset.asset_code}${asset.asset_issuer}`}
            title={asset.asset_code}>
            {`Balance: ${asset.balance}`}
          </Section>
        ))}
      </>
    );
  }
}

/**
 * Displays asset balances
 */
export const BalanceDisp = observer(({pubkey}: {pubkey: string}) => {
  const state = useMemo(() => new BalanceDispState(), []);
  useEffect(() => {
    return state.getDisp(pubkey);
  }, [pubkey, state]);
  return <View>{state.disp}</View>;
});

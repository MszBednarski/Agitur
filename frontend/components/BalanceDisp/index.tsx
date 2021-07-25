import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Box, Text } from "grommet";
import { getNewServer } from "../../shared";
import { useEffect, useMemo } from "react";
import { AssetResponse, OfferResponse, SomeAsset } from "./interfaces";
import * as StellarSdk from "stellar-sdk";

class BalanceDispState {
  assetBalances: AssetResponse[] = [];
  offers: OfferResponse[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  getDisp(pubkey: string) {
    const unmount1 = getNewServer()
      .accounts()
      .accountId(pubkey)
      .cursor("now")
      .stream({
        onmessage: (message) => {
          message.balances[0];
          const assets = message.balances.filter(
            (b) => b.asset_type != "native"
          ) as AssetResponse[];
          runInAction(() => {
            this.assetBalances = assets;
          });
        },
      });
    const handleOffer = async (
      page: StellarSdk.ServerApi.CollectionPage<StellarSdk.ServerApi.OfferRecord>
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
      .then((page) => handleOffer(page));
    return () => {
      unmount1();
    };
  }

  private getAssetString(asset: OfferResponse["buying"]) {
    if (asset.asset_type == "native") {
      return "XLM";
    }
    const someAsset = asset as SomeAsset;
    return `${someAsset.asset_code}`;
  }
  get disp() {
    return this.assetBalances.map((asset) => (
      <Box key={`assetdisp${asset.asset_code}${asset.asset_issuer}`}>
        <Text>{`Asset issuer: ${asset.asset_issuer}`}</Text>
        <Text>{`${asset.asset_code}: ${asset.balance}`}</Text>
        {this.offers.length != 0 && (
          <>
            <Text>{`Market:`}</Text>
            {this.offers.map((offer) => (
              <Text key={`offr${offer.id}`}>{`${this.getAssetString(
                offer.buying
              )} -> ${this.getAssetString(offer.selling)} Price: ${
                offer.price
              } Amount: ${offer.amount}`}</Text>
            ))}
          </>
        )}
      </Box>
    ));
  }
}

/**
 * Displays asset balances
 */
export const BalanceDisp = observer(({ pubkey }: { pubkey: string }) => {
  const state = useMemo(() => new BalanceDispState(), []);
  useEffect(() => {
    return state.getDisp(pubkey);
  }, [pubkey, state]);
  return <Box flex="grow">{state.disp}</Box>;
});

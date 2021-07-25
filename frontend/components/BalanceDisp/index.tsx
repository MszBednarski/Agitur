import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { Box, Text } from "grommet";
import { getNewServer } from "../../shared";
import { useEffect, useMemo } from "react";
import { AssetResponse } from "./interfaces";

class BalanceDispState {
  assetBalances: AssetResponse[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  getBalances(pubkey: string) {
    return getNewServer()
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
  }
  get disp() {
    return this.assetBalances.map((asset) => (
      <Box key={`assetdisp${asset.asset_code}${asset.asset_issuer}`}>
        <Text>{`Asset issuer: ${asset.asset_issuer}`}</Text>
        <Text>{`${asset.asset_code}: ${asset.balance}`}</Text>
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
    return state.getBalances(pubkey);
  }, [pubkey, state]);
  return <Box>{state.disp}</Box>;
});

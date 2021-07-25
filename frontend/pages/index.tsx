import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Box, Heading, Text } from "grommet";
import { makeAutoObservable, runInAction } from "mobx";
import BN from "bn.js";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { BalanceDisp } from "../components/BalanceDisp";
import { agiturDistribution } from "../shared";

const decimals = new BN(10).pow(new BN(7));

function BNtoStellarString(b: BN) {
  const fractionalPart = b.mod(decimals);
  const integerPart = b.sub(fractionalPart).div(decimals);
  // need to pad the fractional part with zeroes
  const pad = new Array(7 - fractionalPart.toString().length)
    .fill("0")
    .join("");
  return `${integerPart.toString()}.${pad}${fractionalPart.toString()}`;
}

class XLMPrice {
  private price: BN = new BN(0);
  constructor() {
    makeAutoObservable(this);
  }
  get priceDisp() {
    return BNtoStellarString(this.price);
  }
  async getPrice() {
    const res = await fetch("/api/stellar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    const price = json.price;
    runInAction(() => {
      this.price = new BN(price);
    });
  }
}

const xlmPrice = new XLMPrice();

export default observer(() => {
  useEffect(() => {
    xlmPrice.getPrice();
  }, []);
  return (
    <Box fill overflow="auto" pad="small" gap="small">
      <Head>
        <title>Agitur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading>Agitur</Heading>
      <Box direction="row" align="center" gap="small">
        <img
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/512.png"
          height="32"
          width="32"
          alt="XLM"
        />
        <Text weight={500}>{`XLM: ${xlmPrice.priceDisp} USD`}</Text>
      </Box>
      <Text>{`Available assets:`}</Text>
      <Box gap={"small"}>
        {agiturDistribution.map((pubkey) => (
          <BalanceDisp pubkey={pubkey} key={`disp${pubkey}`} />
        ))}
      </Box>
    </Box>
  );
});

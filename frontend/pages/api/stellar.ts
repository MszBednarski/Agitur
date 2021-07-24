import { NextApiHandler } from "next";
import rp from "request-promise";
import BN from "bn.js";

interface StellarResponse {
  data: {
    "512": {
      id: 512;
      name: "Stellar";
      symbol: "XLM";
      slug: "stellar";
      num_market_pairs: number;
      date_added: string;
      tags: string[];
      max_supply: number;
      circulating_supply: number;
      total_supply: number;
      is_active: number;
      platform: null;
      cmc_rank: number;
      is_fiat: number;
      last_updated: string;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          percent_change_30d: number;
          percent_change_60d: number;
          percent_change_90d: number;
          market_cap: number;
          last_updated: string;
        };
      };
    };
  };
}

const decimals = new BN(10).pow(new BN(7));

/**
 * price with 7 decimals like with stellar js sdk
 */
async function getUSDXLMPrice() {
  const res = (await rp({
    method: "GET",
    uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
    qs: {
      id: 512,
    },
    headers: {
      "X-CMC_PRO_API_KEY": "6b0dfd52-b475-47ff-875d-79ee145b3959",
    },
    json: true,
    gzip: true,
  })) as StellarResponse;

  return res.data[512].quote.USD.price * decimals.toNumber();
}

const handler: NextApiHandler = async (req, res) => {
  const price = await getUSDXLMPrice();
  res.status(200).json({ price: price });
};

export default handler;

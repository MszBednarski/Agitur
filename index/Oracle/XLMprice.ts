import { BN } from "bn.js";
import rp from "request-promise";
import * as shared from "../shared";

const stellarId = 512;

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

/**
 * price with 7 decimals like with stellar js sdk
 */
async function getUSDXLMPrice() {
  const res = (await rp({
    method: "GET",
    uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
    qs: {
      id: stellarId,
    },
    headers: {
      "X-CMC_PRO_API_KEY": "6b0dfd52-b475-47ff-875d-79ee145b3959",
    },
    json: true,
    gzip: true,
  })) as StellarResponse;

  const price = new BN(
    res.data[512].quote.USD.price * shared.decimals.toNumber()
  );
  return price;
}

getUSDXLMPrice();

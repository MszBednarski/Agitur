const price = {
  GOLD: "1",
  ETH: "3",
  BOND: "2",
  APPL: "4",
};

export function getAssetPrice(code: string): string {
  if (!Object.keys(price).includes(code)) {
    throw new Error("couldnt get price");
  }
  //@ts-ignore
  return price[code];
}

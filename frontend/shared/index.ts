import * as StellarSdk from "stellar-sdk";

export const getNewServer = () => {
  return new StellarSdk.Server("https://horizon-testnet.stellar.org");
};

export const agiturDistribution = [
  "GBZAKQLK6LANOAOS56CR5I7J533AAIJDTFBXH7JPENXHKDYIWOPTGQEZ",
  "GA324YWTVOXZR6JHKZQQNWUG7IGURGRK2NQMM4IX6PYSNLUM67DWGAF5",
  "GCLH3ZZDTFU2KNF45TS76WT3YEJDWM75XDXZCJC23OQLXXNAQA4UESFW",
  "GDZL73KUL5WW5ZHR2IO23Y3JDX3EUOONG6HJIIC7NMAX7KQS2ZCBBKSZ",
];

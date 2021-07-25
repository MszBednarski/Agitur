import * as StellarSdk from 'stellar-sdk';
import * as shared from './shared';

export const getNewServer = () => {
  return new StellarSdk.Server('https://horizon-testnet.stellar.org');
};

export const agiturDistribution = [
  'GBZAKQLK6LANOAOS56CR5I7J533AAIJDTFBXH7JPENXHKDYIWOPTGQEZ',
  'GA324YWTVOXZR6JHKZQQNWUG7IGURGRK2NQMM4IX6PYSNLUM67DWGAF5',
  'GCLH3ZZDTFU2KNF45TS76WT3YEJDWM75XDXZCJC23OQLXXNAQA4UESFW',
  'GDZL73KUL5WW5ZHR2IO23Y3JDX3EUOONG6HJIIC7NMAX7KQS2ZCBBKSZ',
];

export const assets = [
  {
    asset_code: 'APPL',
    asset_issuer: 'GCO6H5XNZATJ5VYTFF6SJDLD37WPOOABZR4U5NSDN23LEONDITGZA6F6',
  },
  {
    asset_code: 'BOND',
    asset_issuer: 'GDBWTQKUFB323TS72LKPQVWLVKMYJQZ3H4ORRQAB33QR4OVORTDKWPRW',
  },
  {
    asset_code: 'ETH',
    asset_issuer: 'GCD5Z3ET2D25W27ZK24STZDZ3BMGUI5KAFJE6DAQPCDGXUDYH2AKPBM4',
  },
  {
    asset_code: 'GOLD',
    asset_issuer: 'GDE7EBNLBUQSGY6WBXSINGQY5HRJ3HNJVBYH4EXE26OL7DUFITWKHPX6',
  },
].map(a => new StellarSdk.Asset(a.asset_code, a.asset_issuer));

export async function optIntoAssets(
  walletAcc: StellarSdk.Keypair,
  assets: StellarSdk.Asset[],
) {
  for (let asset of assets) {
    await shared.TX(walletAcc, async tx => {
      tx = tx.addOperation(
        StellarSdk.Operation.changeTrust({
          asset: asset,
        }),
      );
      return tx.setTimeout(30).build();
    });
  }
}

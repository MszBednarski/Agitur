export interface AssetResponse {
  balance: string;
  limit: string;
  buying_liabilities: string;
  selling_liabilities: string;
  last_modified_ledger: number;
  is_authorized: boolean;
  is_authorized_to_maintain_liabilities: boolean;
  asset_type: string;
  asset_code: string;
  asset_issuer: string;
}

interface Native {
  asset_type: 'native';
}

export interface SomeAsset {
  asset_type: string;
  asset_code: string;
  asset_issuer: string;
}

export interface OfferResponse {
  amount: string;
  buying: SomeAsset | Native;
  id: string;
  last_modified_ledger: number;
  last_modified_time: string;
  paging_token: string;
  price: string;
  price_r: {n: number; d: number};
  seller: string;
  selling: SomeAsset | Native;
}

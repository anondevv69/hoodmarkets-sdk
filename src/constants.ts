import type { Address } from 'viem';

/** Robinhood Chain mainnet (4663) — HoodMarkets V3 stack. */
export const ROBINHOOD_CHAIN_ID = 4663;

export const ROBINHOOD_WETH =
  '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73' as const satisfies Address;

export const ROBINHOOD_RPC_DEFAULT = 'https://rpc.mainnet.chain.robinhood.com';

export const ROBINHOOD_EXPLORER = 'https://robinhoodchain.blockscout.com';

export type RobinhoodAddresses = {
  chainId: number;
  weth: Address;
  factory: Address;
  vault: Address;
  lpLocker: Address;
  fractionDeployer: Address;
  platformFeeRecipient: Address;
  owner: Address;
};

/** Latest mainnet addresses — sync with hoodmarkets `contracts/deployed-hoodmarkets-v3-mainnet.json`. */
export const ROBINHOOD_MAINNET: RobinhoodAddresses = {
  chainId: ROBINHOOD_CHAIN_ID,
  weth: ROBINHOOD_WETH,
  factory: '0xbd794cd9E10728Bb1CB5056A92830C3e945cE7b4',
  vault: '0xf445351e478bB73d0A5812B0812c5eb9e374f00D',
  lpLocker: '0x9875B9Ead485dc1C86a03625531bf677A9276089',
  fractionDeployer: '0x39D0e6FB3aaC391a1CC2C3FcAd182c29FEe0c75f',
  platformFeeRecipient: '0xbfD1be7a12A9FeF04D281C2D8D0D9EE15b576d98',
  owner: '0xFA45A3b8d1662E3432D1B5bE3F37e4923D1b796C',
};

/** ~$10k FDV at ~$40k ETH — same starting tick family as hood.markets V3 launches. */
export const DEFAULT_INITIAL_TICK = -230400;

/** Uniswap V3 pool fee tier (1%). */
export const DEFAULT_POOL_FEE = 10_000;

/** Creator share of swap fees (basis points style: 95 = 95%). Platform 5% is fixed in locker. */
export const DEFAULT_CREATOR_REWARD = 95n;

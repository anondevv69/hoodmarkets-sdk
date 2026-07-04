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
  platformFeeRecipient: Address;
  owner: Address;
};

/** Latest mainnet addresses — sync with hoodmarkets `contracts/deployed-robinhood-mainnet.json`. */
export const ROBINHOOD_MAINNET: RobinhoodAddresses = {
  chainId: ROBINHOOD_CHAIN_ID,
  weth: ROBINHOOD_WETH,
  factory: '0xcFE4D69Ac8e5F79a95d99e991162902f68029f09',
  vault: '0xe250a07229Bcf29a2cC02d6070beE82252F71C36',
  lpLocker: '0x209eFAA86568f0Ea0E25d1F0E62f92e81c51a72a',
  platformFeeRecipient: '0xbfD1be7a12A9FeF04D281C2D8D0D9EE15b576d98',
  owner: '0xFA45A3b8d1662E3432D1B5bE3F37e4923D1b796C',
};

/** ~$10k FDV at ~$40k ETH — same starting tick family as hood.markets V3 launches. */
export const DEFAULT_INITIAL_TICK = -230400;

/** Uniswap V3 pool fee tier (1%). */
export const DEFAULT_POOL_FEE = 10_000;

/** Creator share of swap fees (basis points style: 95 = 95%). Platform 5% is fixed in locker. */
export const DEFAULT_CREATOR_REWARD = 95n;

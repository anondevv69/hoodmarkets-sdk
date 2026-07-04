import type { Address, Hex } from 'viem';

export type HoodMarketsV3DeploymentConfig = {
  tokenConfig: {
    name: string;
    symbol: string;
    salt: Hex;
    image: string;
    metadata: string;
    context: string;
    originatingChainId: bigint;
  };
  vaultConfig: {
    vaultPercentage: number;
    vaultDuration: bigint;
  };
  poolConfig: {
    pairedToken: Address;
    tickIfToken0IsNewToken: number;
  };
  initialBuyConfig: {
    pairedTokenPoolFee: number;
    pairedTokenSwapAmountOutMinimum: bigint;
  };
  rewardsConfig: {
    creatorReward: bigint;
    creatorAdmin: Address;
    creatorRewardRecipient: Address;
    interfaceAdmin: Address;
    interfaceRewardRecipient: Address;
  };
};

export type DeployTokenParams = {
  name: string;
  symbol: string;
  /** IPFS or HTTPS image URL stored on-chain. */
  image: string;
  /** Fee recipient + admin (defaults to wallet address). */
  feeRecipient?: Address;
  /** JSON string for on-chain metadata (default `{}`). */
  metadata?: string | Record<string, unknown>;
  /** JSON string for deployment context (default hood.markets SDK context). */
  context?: string | Record<string, unknown>;
  /** ETH attached to deployToken for optional initial buy. */
  devBuyEth?: string | number | bigint;
  /** Optional fixed CREATE2 salt (random if omitted). */
  salt?: Hex;
};

export type DeployTokenResult = {
  tokenAddress: Address;
  positionId: bigint;
  fractionCollection?: Address;
  fractionVaultAmount?: bigint;
  poolId: string;
  transactionHash: Hex;
  blockNumber: bigint;
  uniswapSwapUrl: string;
  hoodmarketsUrl: string;
  explorerUrl: string;
};

export type ClaimRewardsResult = {
  transactionHash: Hex;
  explorerUrl: string;
};

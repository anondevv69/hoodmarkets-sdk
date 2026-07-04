import { randomBytes } from 'node:crypto';
import { getAddress, keccak256, toHex, type Address, type Hex } from 'viem';
import {
  DEFAULT_CREATOR_REWARD,
  DEFAULT_INITIAL_TICK,
  DEFAULT_POOL_FEE,
  ROBINHOOD_CHAIN_ID,
  ROBINHOOD_MAINNET,
  ROBINHOOD_WETH,
} from './constants.js';
import type { HoodMarketsV3DeploymentConfig } from './types.js';

export type BuildDeploymentConfigInput = {
  name: string;
  symbol: string;
  tokenAdmin: Address;
  image: string;
  metadata?: string | Record<string, unknown>;
  context?: string | Record<string, unknown>;
  salt?: Hex;
  feeRecipient?: Address;
};

function toJsonString(value: string | Record<string, unknown> | undefined, fallback: Record<string, unknown>): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return JSON.stringify(fallback);
}

/** Build the struct passed to `HoodMarketsV3.deployToken`. */
export function buildHoodMarketsV3DeploymentConfig(
  input: BuildDeploymentConfigInput,
): HoodMarketsV3DeploymentConfig {
  const tokenAdmin = getAddress(input.tokenAdmin);
  const feeRecipient = getAddress(input.feeRecipient ?? tokenAdmin);
  const salt = input.salt ?? keccak256(toHex(randomBytes(32)));

  return {
    tokenConfig: {
      name: input.name,
      symbol: input.symbol,
      salt,
      image: input.image,
      metadata: toJsonString(input.metadata, {}),
      context: toJsonString(input.context, {
        interface: 'HoodMarkets SDK',
        platform: 'hood.markets',
        id: `${input.symbol}-${Date.now()}`,
      }),
      originatingChainId: BigInt(ROBINHOOD_CHAIN_ID),
    },
    vaultConfig: {
      /** Always zero — v0.4+ embeds a mandatory 10% / 1000-share fraction vault in the factory. */
      vaultPercentage: 0,
      vaultDuration: 0n,
    },
    poolConfig: {
      pairedToken: ROBINHOOD_WETH,
      tickIfToken0IsNewToken: DEFAULT_INITIAL_TICK,
    },
    initialBuyConfig: {
      pairedTokenPoolFee: DEFAULT_POOL_FEE,
      pairedTokenSwapAmountOutMinimum: 0n,
    },
    rewardsConfig: {
      creatorReward: DEFAULT_CREATOR_REWARD,
      creatorAdmin: tokenAdmin,
      creatorRewardRecipient: feeRecipient,
      interfaceAdmin: tokenAdmin,
      interfaceRewardRecipient: '0x0000000000000000000000000000000000000000',
    },
  };
}

export function defaultFactoryAddress(): Address {
  return ROBINHOOD_MAINNET.factory;
}

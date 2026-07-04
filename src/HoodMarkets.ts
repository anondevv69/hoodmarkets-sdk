import { getAddress, parseEther, type Address, type PublicClient, type WalletClient } from 'viem';
import { HOODMARKETS_V3_ABI } from './abis/hoodmarketsV3.js';
import { buildHoodMarketsV3DeploymentConfig, defaultFactoryAddress } from './buildDeploymentConfig.js';
import {
  explorerTokenUrl,
  explorerTxUrl,
  hoodmarketsTokenPageUrl,
  uniswapSwapUrl,
} from './chain.js';
import { ROBINHOOD_MAINNET, type RobinhoodAddresses } from './constants.js';
import { parseHoodMarketsV3TokenCreatedFromReceipt } from './parseTokenCreated.js';
import type {
  ClaimRewardsResult,
  DeployTokenParams,
  DeployTokenResult,
  HoodMarketsV3DeploymentConfig,
} from './types.js';

export type HoodMarketsClientOptions = {
  wallet: WalletClient;
  publicClient: PublicClient;
  /** Override mainnet addresses when testing a fresh deploy. */
  addresses?: Partial<RobinhoodAddresses>;
};

export class HoodMarkets {
  readonly wallet: WalletClient;
  readonly publicClient: PublicClient;
  readonly addresses: RobinhoodAddresses;

  constructor(opts: HoodMarketsClientOptions) {
    this.wallet = opts.wallet;
    this.publicClient = opts.publicClient;
    this.addresses = { ...ROBINHOOD_MAINNET, ...opts.addresses };
  }

  /** Robinhood mainnet contract addresses bundled with the SDK. */
  static get ADDRESSES(): RobinhoodAddresses {
    return ROBINHOOD_MAINNET;
  }

  buildDeploymentConfig(
    params: DeployTokenParams & { tokenAdmin: Address },
  ): HoodMarketsV3DeploymentConfig {
    return buildHoodMarketsV3DeploymentConfig({
      name: params.name,
      symbol: params.symbol,
      tokenAdmin: params.tokenAdmin,
      image: params.image,
      metadata: params.metadata,
      context: params.context,
      salt: params.salt,
      feeRecipient: params.feeRecipient,
    });
  }

  uniswapSwapUrl(tokenAddress: Address, ethAmount?: string): string {
    return uniswapSwapUrl(tokenAddress, ethAmount);
  }

  async deployToken(params: DeployTokenParams): Promise<DeployTokenResult> {
    const account = this.wallet.account;
    if (!account) {
      throw new Error('Wallet client has no account — connect a signer before deployToken().');
    }

    const tokenAdmin = getAddress(params.feeRecipient ?? account.address);
    const deploymentConfig = this.buildDeploymentConfig({
      ...params,
      tokenAdmin,
      feeRecipient: params.feeRecipient ?? tokenAdmin,
    });

    const devBuyAmount =
      params.devBuyEth === undefined
        ? 0n
        : typeof params.devBuyEth === 'bigint'
          ? params.devBuyEth
          : parseEther(String(params.devBuyEth));

    const factory = defaultFactoryAddress();
    const writeParams = {
      address: factory,
      abi: HOODMARKETS_V3_ABI,
      functionName: 'deployToken' as const,
      args: [deploymentConfig] as const,
      value: devBuyAmount,
      account,
    };

    let gasLimit = 15_000_000n;
    try {
      const estimated = await this.publicClient.estimateContractGas(writeParams);
      gasLimit = estimated + estimated / 4n;
      if (gasLimit < 12_000_000n) gasLimit = 12_000_000n;
      if (gasLimit > 20_000_000n) gasLimit = 20_000_000n;
    } catch {
      gasLimit = 15_000_000n;
    }

    const hash = await this.wallet.writeContract({
      ...writeParams,
      chain: this.wallet.chain,
      gas: gasLimit,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== 'success') {
      throw new Error(`HoodMarkets V3 deploy reverted on-chain. Tx: ${hash}`);
    }

    const created = parseHoodMarketsV3TokenCreatedFromReceipt(receipt, factory);

    return {
      tokenAddress: created.tokenAddress,
      positionId: created.positionId,
      poolId: `v3:${created.positionId.toString()}`,
      transactionHash: hash,
      blockNumber: receipt.blockNumber,
      uniswapSwapUrl: uniswapSwapUrl(created.tokenAddress),
      hoodmarketsUrl: hoodmarketsTokenPageUrl(created.tokenAddress),
      explorerUrl: explorerTokenUrl(created.tokenAddress),
    };
  }

  async claimRewards(tokenAddress: Address): Promise<ClaimRewardsResult> {
    const account = this.wallet.account;
    if (!account) {
      throw new Error('Wallet client has no account — connect a signer before claimRewards().');
    }

    const factory = defaultFactoryAddress();
    const hash = await this.wallet.writeContract({
      address: factory,
      abi: HOODMARKETS_V3_ABI,
      functionName: 'claimRewards',
      args: [getAddress(tokenAddress)],
      account,
      chain: this.wallet.chain,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== 'success') {
      throw new Error(`claimRewards reverted on-chain. Tx: ${hash}`);
    }

    return {
      transactionHash: hash,
      explorerUrl: explorerTxUrl(hash),
    };
  }
}

export { HOODMARKETS_V3_ABI, HOODMARKETS_V3_FACTORY_ABI } from './abis/hoodmarketsV3.js';
export { buildHoodMarketsV3DeploymentConfig } from './buildDeploymentConfig.js';
export { parseHoodMarketsV3TokenCreatedFromReceipt } from './parseTokenCreated.js';
export {
  ROBINHOOD_CHAIN_ID,
  ROBINHOOD_EXPLORER,
  ROBINHOOD_MAINNET,
  ROBINHOOD_RPC_DEFAULT,
  ROBINHOOD_WETH,
} from './constants.js';
export { robinhood, explorerTokenUrl, explorerTxUrl, hoodmarketsTokenPageUrl, uniswapSwapUrl } from './chain.js';
export type { RobinhoodAddresses } from './constants.js';
export type {
  ClaimRewardsResult,
  DeployTokenParams,
  DeployTokenResult,
  HoodMarketsV3DeploymentConfig,
} from './types.js';

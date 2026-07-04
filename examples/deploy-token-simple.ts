/**
 * Deploy a HoodMarkets V3 token on Robinhood Chain (4663).
 *
 * Usage:
 *   cp .env.example .env   # set PRIVATE_KEY
 *   npm run example:deploy
 */
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { HoodMarkets, ROBINHOOD_RPC_DEFAULT, robinhood } from '../src/index.js';

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}` | undefined;
const RPC_URL = process.env.RPC_URL || ROBINHOOD_RPC_DEFAULT;

async function main() {
  if (!PRIVATE_KEY) {
    throw new Error('Set PRIVATE_KEY in your environment (see .env.example).');
  }

  const account = privateKeyToAccount(PRIVATE_KEY);
  const publicClient = createPublicClient({
    chain: robinhood,
    transport: http(RPC_URL),
  });
  const wallet = createWalletClient({
    account,
    chain: robinhood,
    transport: http(RPC_URL),
  });

  const hm = new HoodMarkets({ wallet, publicClient });

  console.log('\nDeploying HoodMarkets V3 token on Robinhood Chain…\n');

  const result = await hm.deployToken({
    name: 'SDK Example Token',
    symbol: 'SDKEX',
    image: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadata: {
      description: 'Deployed with hoodmarkets-sdk',
    },
    context: {
      interface: 'hoodmarkets-sdk',
      platform: 'example',
      id: 'sdk-example-1',
    },
    devBuyEth: '0',
  });

  console.log('Token address:', result.tokenAddress);
  console.log('Pool id:', result.poolId);
  console.log('Transaction:', result.transactionHash);
  console.log('Explorer:', result.explorerUrl);
  console.log('Trade on Uniswap:', result.uniswapSwapUrl);
  console.log('hood.markets page:', result.hoodmarketsUrl);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

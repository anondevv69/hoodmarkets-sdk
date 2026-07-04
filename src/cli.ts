#!/usr/bin/env node
import { Command } from 'commander';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { HoodMarkets } from './HoodMarkets.js';
import { ROBINHOOD_RPC_DEFAULT } from './constants.js';
import { robinhood } from './chain.js';

const program = new Command();

program.name('hoodmarkets-sdk').description('HoodMarkets V3 CLI for Robinhood Chain').version('0.1.0');

program
  .command('deploy')
  .description('Deploy a HoodMarkets V3 token')
  .requiredOption('--name <name>', 'Token name')
  .requiredOption('--symbol <symbol>', 'Token symbol')
  .requiredOption('--image <url>', 'Token image URL (IPFS or HTTPS)')
  .option('--fee-recipient <address>', 'Fee recipient wallet (default: deployer)')
  .option('--dev-buy-eth <amount>', 'ETH to attach for initial buy', '0')
  .option('--rpc <url>', 'RPC URL', process.env.RPC_URL || ROBINHOOD_RPC_DEFAULT)
  .option('--private-key <key>', 'Deployer private key', process.env.PRIVATE_KEY)
  .option('--json', 'Print machine-readable JSON')
  .action(async (opts) => {
    if (!opts.privateKey) {
      console.error('Missing private key — set PRIVATE_KEY or pass --private-key');
      process.exit(1);
    }

    const account = privateKeyToAccount(opts.privateKey as `0x${string}`);
    const publicClient = createPublicClient({
      chain: robinhood,
      transport: http(opts.rpc),
    });
    const wallet = createWalletClient({
      account,
      chain: robinhood,
      transport: http(opts.rpc),
    });

    const hm = new HoodMarkets({ wallet, publicClient });
    const result = await hm.deployToken({
      name: opts.name,
      symbol: opts.symbol,
      image: opts.image,
      feeRecipient: opts.feeRecipient,
      devBuyEth: opts.devBuyEth,
    });

    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            ...result,
            positionId: result.positionId.toString(),
            blockNumber: result.blockNumber.toString(),
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log('Token deployed');
    console.log('Address:', result.tokenAddress);
    console.log('Pool id:', result.poolId);
    console.log('Tx:', result.transactionHash);
    console.log('Uniswap:', result.uniswapSwapUrl);
    console.log('hood.markets:', result.hoodmarketsUrl);
  });

program
  .command('claim')
  .description('Claim V3 swap fees for a token (fee recipient wallet)')
  .requiredOption('--token <address>', 'Token contract address')
  .option('--rpc <url>', 'RPC URL', process.env.RPC_URL || ROBINHOOD_RPC_DEFAULT)
  .option('--private-key <key>', 'Fee recipient private key', process.env.PRIVATE_KEY)
  .option('--json', 'Print machine-readable JSON')
  .action(async (opts) => {
    if (!opts.privateKey) {
      console.error('Missing private key — set PRIVATE_KEY or pass --private-key');
      process.exit(1);
    }

    const account = privateKeyToAccount(opts.privateKey as `0x${string}`);
    const publicClient = createPublicClient({
      chain: robinhood,
      transport: http(opts.rpc),
    });
    const wallet = createWalletClient({
      account,
      chain: robinhood,
      transport: http(opts.rpc),
    });

    const hm = new HoodMarkets({ wallet, publicClient });
    const result = await hm.claimRewards(opts.token);

    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log('Fees claimed');
    console.log('Tx:', result.transactionHash);
    console.log('Explorer:', result.explorerUrl);
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

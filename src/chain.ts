import { defineChain } from 'viem';
import { ROBINHOOD_CHAIN_ID, ROBINHOOD_EXPLORER, ROBINHOOD_RPC_DEFAULT } from './constants.js';

export const robinhood = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [ROBINHOOD_RPC_DEFAULT] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: ROBINHOOD_EXPLORER },
  },
});

export function explorerTxUrl(txHash: string): string {
  return `${ROBINHOOD_EXPLORER}/tx/${txHash}`;
}

export function explorerTokenUrl(tokenAddress: string): string {
  return `${ROBINHOOD_EXPLORER}/token/${tokenAddress}`;
}

export function hoodmarketsTokenPageUrl(tokenAddress: string): string {
  return `https://hood.markets/?token=${tokenAddress.toLowerCase()}`;
}

export function uniswapSwapUrl(tokenAddress: string, ethAmount?: string): string {
  const base = `https://app.uniswap.org/swap?chain=robinhood&outputCurrency=${tokenAddress}&inputCurrency=NATIVE`;
  if (ethAmount?.trim() && /^\d+(\.\d+)?$/.test(ethAmount.trim())) {
    return `${base}&exactAmount=${ethAmount.trim()}`;
  }
  return base;
}

import { decodeEventLog, getAddress, type Address, type Hex } from 'viem';
import { HOODMARKETS_V3_ABI } from './abis/hoodmarketsV3.js';

const TOKEN_CREATED_TOPIC =
  '0x6b04d68ca5c822b9c981d731c83ecb1356b96c8596c7659d397d234856a4537b' as const;

function parseTokenCreatedLogFallback(log: {
  topics: readonly Hex[];
  data: Hex;
}): { tokenAddress: Address; positionId: bigint } | null {
  if (log.topics[0]?.toLowerCase() !== TOKEN_CREATED_TOPIC) return null;
  const tokenTopic = log.topics[1];
  if (!tokenTopic) return null;
  const tokenAddress = getAddress(`0x${tokenTopic.slice(-40)}`);
  const dataHex = log.data.startsWith('0x') ? log.data.slice(2) : log.data;
  if (dataHex.length < 192) return null;
  const positionId = BigInt(`0x${dataHex.slice(128, 192)}`);
  return { tokenAddress, positionId };
}

export function parseHoodMarketsV3TokenCreatedFromReceipt(
  receipt: { logs: { address: string; data: Hex; topics: readonly Hex[] }[] },
  factory: Address,
): { tokenAddress: Address; positionId: bigint } {
  const factoryLower = factory.toLowerCase();
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factoryLower) continue;

    const fallback = parseTokenCreatedLogFallback(log);
    if (fallback) return fallback;

    try {
      const decoded = decodeEventLog({
        abi: HOODMARKETS_V3_ABI,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decoded.eventName === 'TokenCreated') {
        const args = decoded.args as { tokenAddress: Address; positionId: bigint };
        return { tokenAddress: args.tokenAddress, positionId: args.positionId };
      }
    } catch {
      // try next factory log
    }
  }
  throw new Error('TokenCreated event not found in transaction receipt');
}

# hoodmarkets-sdk

The official TypeScript SDK for deploying **HoodMarkets V3** tokens on **Robinhood Chain (4663)**.

Use it to launch tokens from your own website, script, or agent — same on-chain contracts as [hood.markets](https://hood.markets), without using the hood.markets UI.

Modeled after [clanker-sdk](https://github.com/clanker-devco/clanker-sdk).

**Contracts repo:** [github.com/anondevv69/hoodmarkets](https://github.com/anondevv69/hoodmarkets)

---

## Installation

```bash
npm install hoodmarkets-sdk viem
# or
pnpm add hoodmarkets-sdk viem
```

---

## Quick start (TypeScript)

```ts
import { HoodMarkets, robinhood, ROBINHOOD_RPC_DEFAULT } from 'hoodmarkets-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({
  chain: robinhood,
  transport: http(ROBINHOOD_RPC_DEFAULT),
});

const wallet = createWalletClient({
  account,
  chain: robinhood,
  transport: http(ROBINHOOD_RPC_DEFAULT),
});

const hm = new HoodMarkets({ wallet, publicClient });

const result = await hm.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  image: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  metadata: { description: 'Launched from my site' },
  feeRecipient: account.address,
  devBuyEth: '0.001', // optional initial buy ETH
});

console.log(result.tokenAddress);
console.log(result.uniswapSwapUrl);
console.log(result.hoodmarketsUrl);
```

---

## CLI

```bash
npm install -g hoodmarkets-sdk

export PRIVATE_KEY=0x...

hoodmarkets-sdk deploy \
  --name "My Token" \
  --symbol "MTK" \
  --image "ipfs://…"

hoodmarkets-sdk claim --token 0x...
```

Or without a global install:

```bash
npx hoodmarkets-sdk deploy --name "My Token" --symbol "MTK" --image "https://…"
```

| Command | Description |
|---------|-------------|
| `deploy` | Deploy a HoodMarkets V3 token |
| `claim` | Claim swap fees (`claimRewards`) for a token |

Global options: `--rpc`, `--private-key`, `--json`

---

## Robinhood mainnet addresses

Bundled in `HoodMarkets.ADDRESSES` / `ROBINHOOD_MAINNET`:

| Contract | Address |
|----------|---------|
| HoodMarketsV3 factory | `0xcFE4D69Ac8e5F79a95d99e991162902f68029f09` |
| HoodMarketsV3 vault | `0xe250a07229Bcf29a2cC02d6070beE82252F71C36` |
| HoodMarketsV3 LP locker | `0x209eFAA86568f0Ea0E25d1F0E62f92e81c51a72a` |
| Platform fee wallet (5%) | `0xbfD1be7a12A9FeF04D281C2D8D0D9EE15b576d98` |
| WETH | `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` |

Fee split: **95%** to your fee recipient · **5%** platform (on-chain in locker).

Source of truth: [`deployed-robinhood-mainnet.json`](./deployed-robinhood-mainnet.json)

---

## Trading

All HoodMarkets V3 tokens trade on **Uniswap V3** on Robinhood Chain:

```ts
hm.uniswapSwapUrl('0xYourToken', '0.005');
// → https://app.uniswap.org/swap?chain=robinhood&outputCurrency=0x…&inputCurrency=NATIVE&exactAmount=0.005
```

---

## Claim fees

Fee recipients call `claimRewards(token)` on the factory:

```ts
await hm.claimRewards('0xYourToken');
```

---

## Examples

- [`examples/deploy-token-simple.ts`](./examples/deploy-token-simple.ts) — minimal deploy script

---

## Related projects

| Repo | Purpose |
|------|---------|
| [hoodmarkets](https://github.com/anondevv69/hoodmarkets) | Contracts, API, hood.markets web UI |
| [clanker-sdk](https://github.com/clanker-devco/clanker-sdk) | Reference SDK design |

---

## License

MIT

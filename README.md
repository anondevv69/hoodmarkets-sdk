# hoodmarkets-sdk

The official TypeScript SDK for deploying **HoodMarkets V3** tokens on **Robinhood Chain (4663)**.

Use it to launch tokens from your own website, script, or agent — same on-chain contracts as [hood.markets](https://hood.markets), without using the hood.markets UI.

**Contracts repo:** [github.com/anondevv69/hoodmarkets](https://github.com/anondevv69/hoodmarkets) · **Dev docs:** [hood.markets/Dev](https://hood.markets/Dev) · **Agent reference:** [hood.markets/sdk.md](https://hood.markets/sdk.md)

---

## Installation

**Not on npm yet** — install from GitHub:

```bash
npm install github:anondevv69/hoodmarkets-sdk viem
# or
pnpm add github:anondevv69/hoodmarkets-sdk viem
```

Or clone and run from source:

```bash
git clone https://github.com/anondevv69/hoodmarkets-sdk
cd hoodmarkets-sdk
npm install
npm run build
```

`npm install hoodmarkets-sdk` will work once the package is published.

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

From a cloned repo (after `npm install`):

```bash
export PRIVATE_KEY=0x...

npx hoodmarkets-sdk deploy \
  --name "My Token" \
  --symbol "MTK" \
  --image "ipfs://…"

npx hoodmarkets-sdk claim --token 0x...
```

One-shot from GitHub (no clone):

```bash
npx github:anondevv69/hoodmarkets-sdk deploy --name "My Token" --symbol "MTK" --image "https://…"
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
| HoodMarketsV3 factory | `0xbd794cd9E10728Bb1CB5056A92830C3e945cE7b4` |
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

---

## License

MIT

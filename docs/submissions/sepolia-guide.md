# Optional public Ethereum Sepolia evidence

Public proof is not yet complete: no faucet-funded test wallet or public RPC credential was supplied. The included command prepares the missing step without asking you to disclose a private key. The local recorded demo and tooling tests are not public-chain proof.

## 1. Export an approved invoice

Run `npm run dev`, repair the sample invoice recipient, approve its current details, and leave it approved (do not simulate payment). Open **Testnet lab → Export workspace**. Note the invoice ID in the exported JSON, e.g. `demo-001`.

## 2. Configure your own test wallet locally

Use a separate Ethereum Sepolia wallet funded only with faucet test ETH. Put these in the ignored `.env.local` on your computer:

```dotenv
SEPOLIA_RPC_URL=https://YOUR_REAL_SEPOLIA_RPC
DEPLOYER_PRIVATE_KEY=0xYOUR_SEPARATE_TEST_WALLET_KEY
```

Keep both settings server-side and out of Git. Do not paste the private key into chat or a submission. The command rejects any RPC whose chain ID is not `11155111`; this check alone does not prove a private RPC is connected to the public network.

## 3. Deploy and record

From the repository directory:

```sh
npm run sepolia:evidence -- --deploy --workspace /path/to/payfence-workspace.json --invoice demo-001
```

Use quotes for paths with spaces. This deploys a fresh MockUSDC and PayFence, registers the invoice vendor and limit, mints valueless test tokens, grants the exact allowance, signs the order, executes it, and checks the recipient balance. It consumes Sepolia test ETH gas. It does not use real USDC or update dashboard payment status. The export is a snapshot; do not change your intended payment details while running it.

The result is `outputs/sepolia-evidence.json`, including contract addresses, transaction hashes, signed order, and explorer URLs. Inspect the URLs in the public Sepolia explorer to confirm that each transaction actually exists on the public chain before citing it.

## 4. Verify without a private key

```sh
npm run sepolia:evidence -- --verify outputs/sepolia-evidence.json
```

Only `SEPOLIA_RPC_URL` is needed for verification. It checks the signed order, successful PayFence receipt, exact payment event, and replay marker against the configured RPC. Its current balance observation is not historical proof of an unchanged balance.

## 5. Add genuine proof to the submission

Copy the independently checked contract and payment URLs to the submission. State **Ethereum Sepolia, mock tokens**. Never describe the generated local-chain evidence or a private Ganache RPC with Sepolia's chain ID as a public deployment.

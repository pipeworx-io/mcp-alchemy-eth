# @pipeworx/alchemy-eth

[Alchemy](https://docs.alchemy.com/) MCP — Ethereum + L2 enhanced RPC (NFT, token, txn enrichment endpoints). Free key 300M compute units/mo.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_ALCHEMY_KEY`. BYO: `?_apiKey=…`.
- Chain selector: pass `chain` to most tools (`eth-mainnet` (default) | `eth-sepolia` | `polygon-mainnet` | `arb-mainnet` | `opt-mainnet` | `base-mainnet`).

## Tools (Core RPC passthrough)

- `eth_call(method, params, chain?)` — generic JSON-RPC call

## Tools (Token API)

- `token_balances(address, contracts?, chain?)` — ERC-20 balances
- `token_metadata(contract, chain?)` — ERC-20 metadata
- `token_allowance(contract, owner, spender, chain?)` — allowance

## Tools (NFT API)

- `nfts_owned(owner, contracts?, page_key?, page_size?, chain?)` — NFTs owned by address
- `nft_metadata(contract, tokenId, refresh_cache?, chain?)` — single NFT metadata
- `nfts_for_collection(contract, withMetadata?, startToken?, limit?, chain?)` — NFTs in a collection
- `nft_owners(contract, tokenId?, chain?)` — owners of a contract / token

## Tools (Transfers + Webhooks)

- `asset_transfers(from?, to?, contract_addresses?, category?, fromBlock?, toBlock?, order?, withMetadata?, excludeZeroValue?, maxCount?, pageKey?, chain?)` — enhanced transfer feed

## Data source

`https://<chain>.g.alchemy.com/v2/<key>` (RPC), `https://<chain>.g.alchemy.com/nft/v3/<key>` (NFT v3)

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "alchemy-eth": {
      "url": "https://gateway.pipeworx.io/alchemy-eth/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Alchemy Eth data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

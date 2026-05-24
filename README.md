# mcp-alchemy-eth

Alchemy (Ethereum + L2) MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `eth_call` | Generic JSON-RPC call. |
| `token_balances` | ERC-20 balances. |
| `token_allowance` | ERC-20 allowance. |
| `nfts_owned` | NFTs owned by address. |
| `nft_metadata` | Single NFT metadata. |
| `nfts_for_collection` | NFTs in a collection. |
| `nft_owners` | Owners of a contract/token. |
| `asset_transfers` | Enhanced transfer feed. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

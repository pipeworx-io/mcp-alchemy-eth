# @pipeworx/alchemy-eth

[Alchemy](https://docs.alchemy.com/) MCP — Ethereum + L2 enhanced RPC (NFT, token, txn enrichment endpoints). Free key 300M compute units/mo.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/alchemy-eth/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/eth_call`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "alchemy-eth": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-alchemy-eth"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-alchemy-eth
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Alchemy Eth data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Alchemy (Ethereum + L2) MCP.
 */


const UA = 'pipeworx-mcp-alchemy-eth/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'eth_call',
    description: 'Generic JSON-RPC call.',
    inputSchema: {
      type: 'object',
      properties: { method: { type: 'string' }, params: {}, chain: { type: 'string' } },
      required: ['method'],
    },
  },
  {
    name: 'token_balances',
    description: 'ERC-20 balances.',
    inputSchema: { type: 'object', properties: { address: { type: 'string' }, contracts: { type: 'array', items: { type: 'string' } }, chain: { type: 'string' } }, required: ['address'] },
  },
  { name: 'token_metadata', description: 'ERC-20 metadata.', inputSchema: { type: 'object', properties: { contract: { type: 'string' }, chain: { type: 'string' } }, required: ['contract'] } },
  {
    name: 'token_allowance',
    description: 'ERC-20 allowance.',
    inputSchema: { type: 'object', properties: { contract: { type: 'string' }, owner: { type: 'string' }, spender: { type: 'string' }, chain: { type: 'string' } }, required: ['contract', 'owner', 'spender'] },
  },
  {
    name: 'nfts_owned',
    description: 'NFTs owned by address.',
    inputSchema: {
      type: 'object',
      properties: { owner: { type: 'string' }, contracts: { type: 'string' }, page_key: { type: 'string' }, page_size: { type: 'number' }, chain: { type: 'string' } },
      required: ['owner'],
    },
  },
  {
    name: 'nft_metadata',
    description: 'Single NFT metadata.',
    inputSchema: {
      type: 'object',
      properties: { contract: { type: 'string' }, tokenId: { type: 'string' }, refresh_cache: { type: 'boolean' }, chain: { type: 'string' } },
      required: ['contract', 'tokenId'],
    },
  },
  {
    name: 'nfts_for_collection',
    description: 'NFTs in a collection.',
    inputSchema: {
      type: 'object',
      properties: { contract: { type: 'string' }, withMetadata: { type: 'boolean' }, startToken: { type: 'string' }, limit: { type: 'number' }, chain: { type: 'string' } },
      required: ['contract'],
    },
  },
  {
    name: 'nft_owners',
    description: 'Owners of a contract/token.',
    inputSchema: { type: 'object', properties: { contract: { type: 'string' }, tokenId: { type: 'string' }, chain: { type: 'string' } }, required: ['contract'] },
  },
  {
    name: 'asset_transfers',
    description: 'Enhanced transfer feed.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: true },
  },
];

function chainHost(chain: string | undefined): string {
  return chain && chain.length > 0 ? chain : 'eth-mainnet';
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Alchemy requires an API key. Set PLATFORM_ALCHEMY_KEY or pass ?_apiKey=… (free at https://dashboard.alchemy.com/).');
  const chain = chainHost(args.chain as string | undefined);
  const rpcUrl = `https://${chain}.g.alchemy.com/v2/${apiKey}`;
  const nftBase = `https://${chain}.g.alchemy.com/nft/v3/${apiKey}`;

  const rpc = async (method: string, params: unknown[]) => {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    if (res.status === 401 || res.status === 403) throw new Error('Alchemy: invalid API key.');
    if (!res.ok) throw new Error(`Alchemy: ${res.status}`);
    const j = (await res.json()) as { result?: unknown; error?: { message?: string } };
    if (j.error) throw new Error(`Alchemy RPC: ${j.error.message ?? 'error'}`);
    return j.result;
  };
  const nftGet = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && k !== 'chain' && v != null) p.set(k, String(v));
    const res = await fetch(`${nftBase}${path}${[...p].length ? `?${p}` : ''}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Alchemy: invalid API key.');
    if (!res.ok) throw new Error(`Alchemy NFT: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'eth_call': {
      const method = reqStr('method', '"eth_blockNumber"');
      const params = Array.isArray(args.params) ? args.params : [];
      return rpc(method, params);
    }
    case 'token_balances':
      return rpc('alchemy_getTokenBalances', [reqStr('address', '"0x..."'), args.contracts ?? 'DEFAULT_TOKENS']);
    case 'token_metadata':
      return rpc('alchemy_getTokenMetadata', [reqStr('contract', '"0x..."')]);
    case 'token_allowance':
      return rpc('alchemy_getTokenAllowance', [{ contract: reqStr('contract', '"0x..."'), owner: reqStr('owner', '"0x..."'), spender: reqStr('spender', '"0x..."') }]);
    case 'nfts_owned':
      return nftGet('/getNFTsForOwner', { owner: reqStr('owner', '"0x..."'), contractAddresses: args.contracts, pageKey: args.page_key, pageSize: args.page_size });
    case 'nft_metadata':
      return nftGet('/getNFTMetadata', { contractAddress: reqStr('contract', '"0x..."'), tokenId: reqStr('tokenId', '"123"'), refreshCache: args.refresh_cache });
    case 'nfts_for_collection':
      return nftGet('/getNFTsForContract', { contractAddress: reqStr('contract', '"0x..."'), withMetadata: args.withMetadata, startToken: args.startToken, limit: args.limit });
    case 'nft_owners':
      return nftGet('/getOwnersForContract', { contractAddress: reqStr('contract', '"0x..."'), tokenId: args.tokenId });
    case 'asset_transfers': {
      const params: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(args)) {
        if (k === '_apiKey' || k === 'chain') continue;
        if (v != null) params[k] = v;
      }
      return rpc('alchemy_getAssetTransfers', [params]);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;

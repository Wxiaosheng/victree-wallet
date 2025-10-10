import type { VNetwork } from "~src/types/Network";

/** 钱包内置的网络列表 */
export const NETWORKS: VNetwork[] = [
  {
    id: 'ethereum-mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://special-cosmological-isle.quiknode.pro/bd87b033cc13864f893f425e9979f7c0e6d7c05d',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorer: 'https://etherscan.io'
  },
  {
    id: 'ethereum-sepolia',
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://special-cosmological-isle.ethereum-sepolia.quiknode.pro/bd87b033cc13864f893f425e9979f7c0e6d7c05d',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    blockExplorer: 'https://sepolia.etherscan.io'
  }
]
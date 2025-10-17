import type { VNetwork } from "~src/types/network";

/** 钱包内置的网络列表 */
export const NETWORKS: VNetwork[] = [
  {
    id: 'ethereum-mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://special-cosmological-isle.quiknode.pro/bd87b033cc13864f893f425e9979f7c0e6d7c05d',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
    isCustom: false,
  },
  {
    id: 'ethereum-sepolia',
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://special-cosmological-isle.ethereum-sepolia.quiknode.pro/bd87b033cc13864f893f425e9979f7c0e6d7c05d',
    symbol: 'SepoliaETH',
    blockExplorer: 'https://sepolia.etherscan.io',
    isCustom: false,
  }
]

/** 代币类型 */
export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

/** ERC20 代币合约 ABI  */
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)",
]
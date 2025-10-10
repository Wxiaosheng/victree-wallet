/** 原生代币信息 */
export interface NativeCurrency {
  /** 代币名称 */
  name: string;
  /** 代币标识 */
  symbol: string;
  /** 代币精度 */
  decimals: number;
}

/** 网络配置 */
export interface VNetwork {
  /******** 核心必须字段 ********/
  /** 唯一标识 */
  id: string;
  /** 网络名称 */
  name: string;
  /** 区块链协议标识符（EIP-155） */
  chainId: number;
  /** rpc url */
  rpcUrl: string;

  /******** 重要字段 ********/
  /** 原生代币信息 */
  symbol: string;
  /** 区块链浏览器 */
  blockExplorer: string;

  /** 是否是自定义网络 */
  isCustom: boolean;
}
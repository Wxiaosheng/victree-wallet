import type { JsonRpcProvider } from 'ethers';
import type { VNetwork } from "./network";
import type { TokenType } from '~src/store/contants';

/** Victree wallet 类型定义 */
export interface VWallet {
  /******** 钱包/账户 ********/
  /** 是否锁定 */
  isLocked: boolean;
  /** 当前选中的账户 */
  currentAccount: WalletAccount | null;
  /** 账户列表 */
  accounts: WalletAccount[];
  /** 助记词(加密) */
  mnemonic: string | null;
  /** 密码(加密) */
  password: string | null;
  /** 私钥（加密） */
  privateKey: string | null;

  /******** 网络 ********/
  /** 当前网络 */
  currentNetwork: VNetwork;
  /** 网络配置 */
  networks: VNetwork[];

  /******** 代币 ********/
  tokens: WalletToken[];
}

/** 全局状态管理 */
export interface VWalletStore extends VWallet {
   /** 创建新钱包 */
  createWallet: (password: string) => Promise<{ mnemonic: string; account: WalletAccount; }>;

  /** 私钥导入钱包 */
  importWalletByPrivateKey: (privateKey: string, password: string) => Promise<{account: WalletAccount;}>

  /** 通过助记词导入钱包 */
  importWalletByMnemonic: (mnemonic: string, password: string) => Promise<{ account: WalletAccount;}>

  /** 切换用户 */
  switchAccount: (address: string) => Promise<void>;

  /** 验证密码 */
  validPassword: (password: string) => boolean;

  /** 添加账户 */
  addAccount: (name: string) => Promise<WalletAccount>;

  /** 切换网络 */
  switchNetwork: (id: string) => Promise<void>;

  /** 测试网路 */
  testNetwork: (network: VNetwork) => Promise<void>;

  /** 添加网络 */
  addNetwork: (network: VNetwork) => Promise<void>;

  /** 验证ERC20 */
  validERC20: (contractAddress: string) => Promise<{
    name: string;
    symbol: string;
    decimals: number;
  }>;
  
  /** 验证ERC721 */
  validERC721: (contractAddress: string) => Promise<{
    name: string;
    symbol: string;
  }>;

  /** 添加代币 */
  addToken: (token: WalletToken) => Promise<void>;

  /** 获取代币余额 */
  tokenBalance: (contractAddress: string, userAddress?: string) => Promise<bigint>;

  /** 删除代币 */
  removeToken: (contractAddress: string) => Promise<void>;
}

/** Victree wallet 的 account */
export interface WalletAccount {
  /** 账户地址 */
  address: string;
  /** 账户名称 */
  name: string;
  /** 账户索引 */
  index: number;
}

/** Victree wallet 的 token */
export interface WalletToken {
  /** 代币合约地址 */
  contractAddress: string;
  /** 代币名称 */
  name: string;
  /** 代币符号 */
  symbol: string;
  /** 小数位 */
  decimals: number;
  /** 代币类型 */
  type: keyof typeof TokenType | 'native';
  /** 所属网络 ID */
  chainId: number;
  /** 余额 */
  balance?: bigint;
  /** 是否为原生代币 */
  isNative?: boolean;
}
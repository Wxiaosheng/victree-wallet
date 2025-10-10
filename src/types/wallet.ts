import type { JsonRpcProvider } from 'ethers';
import type { VNetwork } from "./network";

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
}

/** 全局状态管理 */
export interface VWalletStore extends VWallet {
   /** 创建新钱包 */
  createWallet: (password: string) => Promise<{ mnemonic: string; account: WalletAccount; }>;

  /** 私钥导入钱包 */
  importWalletByPrivateKey: (privateKey: string, password: string) => Promise<{account: WalletAccount;}>

  /** 通过助记词导入钱包 */
  importWalletByMnemonic: (mnemonic: string, password: string) => Promise<{ account: WalletAccount;}>

  /** 切换网络 */
  switchNetwork: (id: string) => Promise<void>;

  /** 测试网路 */
  testNetwork: (network: VNetwork) => Promise<void>;

  /** 添加网络 */
  addNetwork: (network: VNetwork) => Promise<void>;
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
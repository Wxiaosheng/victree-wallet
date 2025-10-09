/** Victree wallet 类型定义 */
export interface VWallet {
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
}

/** 全局状态管理 */
export interface VWalletStore extends VWallet {
   /** 创建新钱包 */
  createWallet: (password: string) => Promise<{ mnemonic: string; account: WalletAccount; }>;
}

/** Victree wallet 的 account */
export interface WalletAccount {
  /** 账户地址 */
  address: string;
  /** 账户私钥 */
  privateKey: string;
  /** 账户名称 */
  name: string;
  /** 账户索引 */
  index: number;
}
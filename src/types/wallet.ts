/** Victree wallet 类型定义 */
export interface VWallet {
  /** 当前选中的账户 */
  currentAccount: string;
  /** 账户列表 */
  accounts: string[];
}
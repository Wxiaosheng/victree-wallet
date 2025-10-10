import { useEffect, useState } from "react";
import { JsonRpcProvider } from "ethers";
import useWalletStore from "~src/store/walletStore";
import type { WalletAccount } from "~src/types/wallet";

interface AccountInfo extends WalletAccount {
  loading: boolean;
  symbol: string;
  balance?: bigint;
  provider?: JsonRpcProvider;
}

/**
 * 获取用户账号相关信息
 */
const useAccountInfo = () => {
  const { currentAccount, currentNetwork } = useWalletStore();
  const provider = new JsonRpcProvider(currentNetwork.rpcUrl);

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({ ...currentAccount, symbol: currentNetwork.symbol, provider, loading: true });  

  /** 获取账户相关信息 */
  const getAccountInfo = async () => {
    // 原生代币余额
    const balance = await provider.getBalance(currentAccount.address);

    
    setAccountInfo(info => ({ ...info, balance, loading: false }))
  }

  useEffect(() => {
    getAccountInfo();
  }, [currentNetwork]);

  return accountInfo;
}

export default useAccountInfo;
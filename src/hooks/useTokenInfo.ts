import { useEffect, useState } from "react";
import useWalletStore from "~src/store/walletStore";
import useAccountInfo from "./useAccountInfo";
import type { WalletToken } from "~src/types/wallet";

/** 获取代币信息 */
const useTokenInfo = () => {
  const { balance } = useAccountInfo();
  const [loading, setLoading] = useState(true);
  const [_tokens, setTokens] = useState<WalletToken[]>([]);
  const [native, setNative] = useState<WalletToken | null>({} as WalletToken);
  const { currentNetwork, tokens, tokenBalance } = useWalletStore();

  const fetchTokenInfo = async () => {
    const currentNetworkTokenPromises = tokens
      .filter(t => t.chainId === currentNetwork.chainId)
      .map(async t => ({
        ...t,
        balance: await tokenBalance(t.contractAddress),
      }));

    // Wait for all balance fetches to complete
    const currentNetworkToken = await Promise.all(currentNetworkTokenPromises);

    setTokens(currentNetworkToken);
    setLoading(false);
  }

  useEffect(() => {
    fetchTokenInfo();
  }, [tokens]);

  useEffect(() => {
    if (!balance || !currentNetwork) return;
    setNative({ 
      type: 'native',
      contractAddress: '', 
      chainId: currentNetwork.chainId,
      name: currentNetwork.name, 
      symbol: currentNetwork.symbol, 
      decimals: 18,
      balance, 
      isNative: true 
    });
  }, [balance, currentNetwork])

  return {
    loading,
    tokens: [native, ..._tokens],
  };
}

export default useTokenInfo;
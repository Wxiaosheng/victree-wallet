import { useEffect, useState } from "react";
import useWalletStore from "~src/store/walletStore";
import type { WalletToken } from "~src/types/wallet";

/** 获取代币信息 */
const useTokenInfo = () => {
  const [_tokens, setTokens] = useState<WalletToken[]>([]);
  
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
  }

  useEffect(() => {
    fetchTokenInfo();
  }, [tokens]);

  return _tokens;
}

export default useTokenInfo;
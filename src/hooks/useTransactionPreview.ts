import { useState } from "react";
import useWalletStore from "~src/store/walletStore";

/**
 * 交易预览
 * 
 * * 验证当前账户余额是否充足
 * * 验证接受账户地址的有效性（如果是合约地址，则进行风险提示）
 * * 验证网络状态
 * * 估算交易费用
 * * 返回相关数据供预览页面展示
 */
const useTransactionPreview = () => {
  const { currentAccount, currentNetwork } = useWalletStore();
  // 基础交易价格
  const [gasPrice, setGasPrice] = useState(20);
  // 基础交易限制
  const [gasLimit, setGasLimit] = useState(21000);
  // Nonce
  const [nonce, setNonce] = useState(1);
  // 交易数据
  const [data, setData] = useState('0x1234567890abcdef...');

  return {
    currentAccount,
    currentNetwork,
    gasPrice,
    gasLimit,
    nonce,
    data,
  };
}

export default useTransactionPreview;
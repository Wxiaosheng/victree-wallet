import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isAddress, JsonRpcProvider, Contract, Wallet, parseUnits } from 'ethers'
import { AES, enc } from "crypto-js"
import useWalletStore from "~src/store/walletStore";
import { ERC20_ABI, TokenType } from "~src/store/contants";
import type { VNetwork } from "~src/types/network";
import type { WalletToken } from "~src/types/wallet";

export interface PreviewData {
  from: string;
  to: string;
  amount: bigint;

  token: WalletToken;

  network: VNetwork;
  gasPrice: string;
  gasLimit: string;
}

const usePreview = () => {
  const navigator = useNavigate();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const { currentNetwork, password, privateKey } = useWalletStore();

  const provider = new JsonRpcProvider(currentNetwork.rpcUrl);

  /**
   * 
   * * 验证当前账户余额是否充足
   * * 验证接受账户地址的有效性（如果是合约地址，则进行风险提示）
   * * 验证网络状态
   * * 估算交易费用
   * * 返回相关数据供预览页面展示
   */
  const preCheckData = async (data: PreviewData) => {

    if (!isAddress(data.to)) {
      throw new Error('接收方地址无效');
    }

    // 原生代币
    if (data.token.type === 'native') {
      const gas = BigInt(data.gasPrice) * BigInt(data.gasLimit);
      const balance = await provider.getBalance(data.to);
      if (balance && balance < data.amount + gas) {
        throw new Error('账户余额不足');
      }
    } else if (data.token.type === TokenType.ERC20) { // ERC20 代币
      const contract = new Contract(data.token.contractAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(data.to);
      console.log('ERC20 余额:', balance);
      if (balance && balance < data.amount) {
        throw new Error('账户余额不足');
      }
    }
    
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== currentNetwork.chainId) {
      throw new Error('网络状态异常，请检查网络连接');
    }

    // TODO: 估算交易费用 

    return data;
  }

  const savePreviewData = async (data: PreviewData) => {
    const _data = await preCheckData(data);

    setPreviewData(_data);
  }

  const clearPreviewData = () => {
    setPreviewData(null);
  }

  /** 发送交易 */
  const sendTransaction = async () => {

    // 1. 解密私钥
    const _privateKey = AES.decrypt(privateKey, password).toString(enc.Utf8);
    // 2. 生成钱包节点
    const wallet = new Wallet(_privateKey, provider);

    // 交易实例
    let tx;

    /**
     * 原生代币
     * 
     * 3. 通过钱包节点转账原生代币
     */
    if (previewData.token.type === 'native') {
      console.log({
        to: previewData.to,
        value: previewData.amount,
        gasPrice: parseUnits(previewData.gasPrice, 'gwei'),
        gasLimit: previewData.gasLimit
      })
      tx = await wallet.sendTransaction({
        to: previewData.to,
        value: previewData.amount,
        gasPrice: parseUnits(previewData.gasPrice, 'gwei'),
        gasLimit: previewData.gasLimit
      });

    } else if (previewData.token.type === TokenType.ERC20) {
      /**
       * ERC20代币
       * 1. 构建合约对象（依赖钱包节点）
       * 2. 调用合约转账方法
      */
      const contract = new Contract(previewData.token.contractAddress, ERC20_ABI, wallet);

      tx = await contract.transfer(previewData.to, previewData.amount, {
        gasPrice: parseUnits(previewData.gasPrice, 'gwei'),
        gasLimit: previewData.gasLimit,
      });
    }

    console.log("交易hash: ", tx.hash);
    
    console.log("等待交易确认。。。。");
    // 等待交易确认
    await tx.wait();
    console.log("交易确认成功 ✅");

    // 回到首页
    navigator('/');
  }

  return {
    previewData,
    savePreviewData,
    clearPreviewData,
    sendTransaction,
  };
}

export default usePreview;
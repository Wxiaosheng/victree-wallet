import { useMemo, useState } from "react";
import { List, Spin } from "antd";
import { formatUnits } from "ethers";
import FullModal from "~src/components/FullModal";
import EllipsisMiddle from "~src/components/EllipsisMiddle";
import useTokenInfo from "~src/hooks/useTokenInfo";
import type { WalletToken } from "~src/types/wallet";

/**
 * useTokenList - 通过弹框，选择代币
 * 
 * 支持原生代币和自定义代币
 */
const useTokenList = () => {
  const [open, setOpen] = useState(false);
  const { loading, tokens } = useTokenInfo();
  const [currentToken, setCurrentToken] = useState<WalletToken | null>(null);

  const openTokenList = () => setOpen(true);
  const closeTokenList = () => setOpen(false);

  const handleSelect = (token: WalletToken) => {
    setCurrentToken(token);
    closeTokenList();
  };
  
  // 代币列表弹框
  const TokenListDOM = useMemo(() => {
    if (!open) return null;

    return <FullModal
      open={open}
      title="选择代币"
      onCancel={closeTokenList}
    >
      <Spin spinning={loading}>
        <List
          dataSource={tokens}
          renderItem={(item, index) => (<List.Item
            key={item.contractAddress + item.chainId}
            className='cursor-pointer'
            onClick={() => handleSelect(item)}
            extra={
              <div className="text-xs ml-2" >{`${formatUnits(item.balance || 0, item.decimals)}${item.symbol}`}</div>
            }
          >
            <List.Item.Meta
              className={item.contractAddress === currentToken?.contractAddress ? "bg-blue-100 border-l-4 border-blue-300" : ""}
              // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index+1}`} />}
              title={item.symbol}
              description={
                <EllipsisMiddle className="w-48 text-gray-500" suffixCount={5}>{item.contractAddress}</EllipsisMiddle>
              }
            />
          </List.Item>)}
        />
      </Spin>
    </FullModal>
  }, [open, loading, tokens, currentToken]);

  return {
    currentToken,
    openTokenList,
    TokenListDOM,
  };
}

export default useTokenList;
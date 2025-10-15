import { useMemo, useState } from "react";
import { List, Spin } from "antd";
import FullModal from "~src/components/FullModal";
import EllipsisMiddle from "~src/components/EllipsisMiddle";
import useWalletStore from "~src/store/walletStore";

/**
 * useTokenList - 通过弹框，选择代币
 * 
 * 支持原生代币和自定义代币
 */
const useTokenList = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentAccount } = useWalletStore();

  const closeTokenList = () => setOpen(false);

  const handleSelect = (token) => {
  };


  const TokenListDOM = useMemo(() => {
    return <FullModal
    title="选择代币"
    open={open}
    onCancel={closeTokenList}
  >
    <Spin spinning={loading}>
      <List
        dataSource={[]}
        renderItem={(item, index) => (<List.Item
          key={item.address}
          className='cursor-pointer'
          // onClick={() => handleSwitchAccount(item.address)}
          // extra={<Spin spinning={accountLoading}>
          //   <div className="text-xs ml-2" >{`${formatEther(balances?.[item.index] || 0)}${symbol}`}</div>
          // </Spin>}
        >
          <List.Item.Meta
            className={item.address === currentAccount.address ? "bg-blue-100 border-l-4 border-blue-300" : ""}
            // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index+1}`} />}
            title={item.name}
            description={
              <EllipsisMiddle className="w-48 text-gray-500" suffixCount={5}>{item.address}</EllipsisMiddle>
            }
          />
        </List.Item>)}
      />
    </Spin>
  </FullModal>
  }, [])

  return {
    open,
    TokenListDOM,
  };
}

export default useTokenList;
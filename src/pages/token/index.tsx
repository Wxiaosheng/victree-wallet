import { Button, List } from "antd";
import { formatEther, formatUnits } from 'ethers';
import useAccountInfo from "~src/hooks/useAccountInfo";
import useWalletStore from "~src/store/walletStore";
import useAddTokenModal from "./hooks/useAddTokenModal";
import useTokenInfo from "~src/hooks/useTokenInfo";

const Token = () => {
  const { currentNetwork, removeToken } = useWalletStore();
  const { balance } = useAccountInfo();
  const tokens = useTokenInfo();

  const { openAddTokenModal, AddTokenModal } = useAddTokenModal();

  const handleDeleteToken = (contractAddress: string) => {

    removeToken(contractAddress);
  }

  // 原生代币 + 用户添加的代币

  const data = [
    { symbol: currentNetwork.symbol, balance, isNative: true }, // 原生代币
    ...tokens
  ]

  return <div>
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item extra={!item.isNative && (<Button danger size="small" onClick={() => handleDeleteToken(item.contractAddress)}>删除</Button>)}>
          <List.Item.Meta
            // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            title={<a href="https://ant.design">{item.symbol}</a>}
            description={item.isNative 
              ? `${formatEther(item?.balance || 0)} ${item.symbol}` 
              : `${formatUnits(item?.balance || 0, item.decimals)} ${item.symbol}`
            } 
          />
        </List.Item>
      )}
    />
    <Button type="primary" onClick={openAddTokenModal}>添加代币</Button>
    {AddTokenModal}
  </div>
}

export default Token;
import { Button, List } from "antd";
import { formatEther, formatUnits } from 'ethers';
import useWalletStore from "~src/store/walletStore";
import useAddTokenModal from "./hooks/useAddTokenModal";
import useTokenInfo from "~src/hooks/useTokenInfo";

const Token = () => {
  const { removeToken } = useWalletStore();
  const { loading, tokens } = useTokenInfo();

  const { openAddTokenModal, AddTokenModal } = useAddTokenModal();

  const handleDeleteToken = (contractAddress: string) => {

    removeToken(contractAddress);
  }

  return <div>
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={tokens}
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
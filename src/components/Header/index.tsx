import { useState } from 'react';
import { Button, List } from 'antd';
import { GlobalOutlined, WalletTwoTone, LogoutOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStore';
import FullModal from '../FullModal';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { currentAccount, currentNetwork, networks } = useWalletStore();

  /** 关闭网络弹框 */
  const closeModal = () => setOpen(false);

  /** 切换网络 */
  const handleSwitchNetwork = async (id: string) => {
    console.log('切换网络');
  }

  if (!currentAccount) return null;

  return <div className="flex justify-between">
    <div className="flex ">
      <WalletTwoTone className='text-2xl mr-2' />
      <div className="flex flex-col">
        <div className='text-2xl'>Victree Wallet</div>
        <div className='text-gray-500'>{currentAccount.name}</div>
      </div>
    </div>
    <div className='flex flex-center'>
      <GlobalOutlined className="text-lg mr-4" onClick={() => setOpen(true)} />
      <LogoutOutlined className="text-lg" />
    </div>
    <FullModal
      title="网络设置"
      open={open}
      onCancel={closeModal}
    >
      <List
        dataSource={networks}
        header={<div className='flex flex-row-reverse'><Button type="primary">添加网络</Button></div>}
        renderItem={(item) => (<List.Item
          key={item.id}
          className='cursor-pointer'
          onClick={() => handleSwitchNetwork(item.id)}
          extra={<CheckCircleTwoTone twoToneColor={currentNetwork.id === item.id ? "#52c41a" : "#aaaaaa"} />}
        >
          <List.Item.Meta
            
            title={item.name}
            description={`Chain Id: ${item.chainId} * ${item.nativeCurrency.symbol}`}
          />
          {/* <div className='text-gray-500'>{item.rpcUrl}</div> */}
        </List.Item>)}
      />
    </FullModal>
  </div>
}

export default Header;
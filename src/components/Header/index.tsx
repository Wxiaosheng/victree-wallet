import { useState } from 'react';
import { GlobalOutlined, WalletTwoTone, LogoutOutlined } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStore';
import NetworkConfig from '../NetworkConfig';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { currentAccount } = useWalletStore();

  /** 关闭网络弹框 */
  const closeModal = () => setOpen(false);

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
    { open && <NetworkConfig open={open} closeModal={closeModal} /> }
  </div>
}

export default Header;
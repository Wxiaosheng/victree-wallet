import { Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { GlobalOutlined, WalletTwoTone, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStore';
import useNetworkConfig from '../NetworkConfig/useNetworkConfig';
import useAccountManage from '../AccountManage/useAccountManage';

const notHeaderPaths = ['/transaction', '/preview'];

const Header = () => {
  const location = useLocation();
  const { currentAccount } = useWalletStore();
  
  const { openNetworkConfig, NetworkDOM } = useNetworkConfig();
  const { openAccountManage, AccountManageDOM } = useAccountManage();

  console.log('location', location.pathname, notHeaderPaths.includes(location.pathname))

  if (!currentAccount || notHeaderPaths.includes(location.pathname)) return null;

  return <div className="flex justify-between">
    <div className="flex">
      <WalletTwoTone className='text-2xl mr-2' />
      <div className="flex flex-col">
        <div className='text-2xl cursor-pointer' onClick={openAccountManage}>{currentAccount.name} <DownOutlined className='text-xl' /></div>
        <Typography.Paragraph copyable ellipsis className='w-40 text-gray-500'>{currentAccount.address}</Typography.Paragraph>
      </div>
    </div>
    <div className='flex flex-center'>
      <GlobalOutlined className="text-lg mr-4" onClick={openNetworkConfig} />
      <LogoutOutlined className="text-lg" />
    </div>
    { NetworkDOM }
    { AccountManageDOM }
  </div>
}

export default Header;
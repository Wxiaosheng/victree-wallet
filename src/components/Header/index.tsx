import { GlobalOutlined, WalletTwoTone } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStare';

const Header = () => {

  const { currentAccount } = useWalletStore();

  if (!currentAccount) return null;

  return <div className="flex justify-between">
    <div className="flex ">
      <WalletTwoTone className='text-2xl mr-2' />
      <div className="flex flex-col">
        <div className='text-2xl'>Victree Wallet</div>
        <div className='text-gray-500'>{currentAccount.name}</div>
      </div>
    </div>

    <GlobalOutlined className="text-lg" />
  </div>
}

export default Header;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWalletStore from '~src/store/walletStore';
import Header from '../components/Header';

/**
 * 系统 Layout 组件
 */
const Layout = ({ children }) => {

  const { currentAccount } = useWalletStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Layout: ', location.hash)
    // 未创建钱包 或未导入钱包，进入创建/导入页面
    if (!currentAccount) {
      navigate('/create-wallet')
    } else if (location.hash.includes('create-wallet')) {
      navigate('/')
    }
  }, []);

  return <div className='px-2 py-4'>
    <Header />
    {children}
  </div>
}

export default Layout;
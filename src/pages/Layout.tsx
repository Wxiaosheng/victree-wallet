import Header from '../components/Header';

/**
 * 系统 Layout 组件
 */
const Layout = ({ children }) => {

  return <div className='px-2 py-4'>
    <Header />
    
    {children}
  </div>
}

export default Layout;
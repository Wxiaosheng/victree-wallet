import Header from '../components/Header';

/**
 * 系统 Layout 组件
 */
const Layout = ({ children }) => {

  return <div>
    <Header />
    
    {children}
  </div>
}

export default Layout;
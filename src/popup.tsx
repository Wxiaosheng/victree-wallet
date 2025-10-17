import './styles.css';
import { Routes, Route, HashRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Token from "./pages/Token"
import CreateWallet from './pages/CreateWallet';
import Transaction from './pages/Transaction';
import NotFound from "./pages/Error/NotFound";

/**
 * @description 当前浏览器插件的入口文件  
 * 通常处理全局的相关配置  
 * 如 路由配置、react-query、tailwind css 等等  
 *
 */
function Popup() {

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/create-wallet" element={<CreateWallet />} />
          <Route path="/token" element={<Token />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default Popup

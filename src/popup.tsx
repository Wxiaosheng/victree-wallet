import { Routes, Route, HashRouter, Link } from "react-router-dom"
import Home from "./pages/home"
import Token from "./pages/token"
import NotFound from "./pages/error/NotFound"
import Layout from "./pages/Layout"


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
          <Route path="/" element={<Home />} />
          <Route path="/token" element={<Token />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default Popup

import { GlobalOutline } from "antd-mobile-icons";

const Header = () => {
  return <div className="flex justify-between">
    <div className="flex ">
      <div>头像</div>
      <div className="flex flex-col">
        <div>名称</div>
        <div>地址</div>
      </div>
    </div>

    <GlobalOutline className="text-lg" />
  </div>
}

export default Header;
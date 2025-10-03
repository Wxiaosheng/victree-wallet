import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWalletStore from "~src/store/walletStare";

const Home = () => {
  const { currentAccount, updateAccount } = useWalletStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 未创建钱包 或未导入钱包，进入创建/导入页面
    if (!currentAccount) {
      console.log("to create-wallet")
      navigate('/create-wallet')
    }
  }, []);

  return <div>
    Home Page. { currentAccount }

    <div onClick={() => updateAccount()}>update</div>
  </div>
}

export default Home;
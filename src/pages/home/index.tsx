import useWalletStore from "~src/store/walletStare";

const Home = () => {
  const { currentAccount, updateAccount } = useWalletStore();

  return <div>
    Home Page. { currentAccount }

    <div onClick={() => updateAccount()}>update</div>
  </div>
}

export default Home;
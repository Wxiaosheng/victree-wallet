import { useState } from "react";
import { Avatar, Button, List, Popover, Spin } from "antd";
import { formatEther } from "ethers";
import useWalletStore from "~src/store/walletStore";
import FullModal from "../FullModal";
import EllipsisMiddle from "../EllipsisMiddle";
import useAccountInfo from "~src/hooks/useAccountInfo";
import AddAccount from "./AddAccount";

interface IAccountManageProps {
  open: boolean;
  closeAccountManage: () => void;
}

/** 账户管理 */
const AccountManage = (props: IAccountManageProps) => {
  const { open, closeAccountManage } = props;

  const [loading, setLoading] = useState(false);
  const [popover, setPopover] = useState(false);

  const { currentAccount, accounts, switchAccount, addAccount } = useWalletStore();
  const { balances, symbol, loading: accountLoading } = useAccountInfo();

    /** 打开网络配置表单 */
  const openPopover = async () => {
    setPopover(true);
  };

  const handleSwitchAccount = async (address: string) => {
    await switchAccount(address);
    closeAccountManage();
  }

  /** 添加账户 */
  const handleAddAccount = async (name: string) => {
    try {
      setLoading(true);
      await addAccount(name);

    } catch (error) {
    } finally {
      setPopover(false);
      setLoading(false);
    }
  }
  
  return <FullModal
    title="账户管理"
    open={open}
    onCancel={closeAccountManage}
  >
    <Spin spinning={loading}>
      <List
        dataSource={accounts}
        header={<div className='flex flex-row-reverse'>
          <Popover content={() => <AddAccount handleAddAccount={handleAddAccount} />} title="添加账户" open={popover} placement='bottomLeft'>
            <Button type="primary" onClick={openPopover}>添加账户</Button>
          </Popover>
        </div>}
        renderItem={(item, index) => (<List.Item
          key={item.address}
          className='cursor-pointer'
          onClick={() => handleSwitchAccount(item.address)}
          extra={<Spin spinning={accountLoading}>
            <div className="text-xs ml-2" >{`${formatEther(balances?.[item.index] || 0)}${symbol}`}</div>
          </Spin>}
        >
          <List.Item.Meta
            className={item.address === currentAccount.address ? "bg-blue-100 border-l-4 border-blue-300" : ""}
            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index+1}`} />}
            title={item.name}
            description={
              <EllipsisMiddle className="w-48 text-gray-500" suffixCount={5}>{item.address}</EllipsisMiddle>
            }
          />
        </List.Item>)}
      />
    </Spin>
  </FullModal>
}

export default AccountManage;
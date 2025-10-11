import { useMemo, useState } from "react";
import AccountManage from ".";

/** 对外方便使用的 hooks */
const useAccountManage = () => {
  const [open, setOpen] = useState(false);

  /** 打开网络配置弹框 */
  const openAccountManage = () => setOpen(true);

  /** 关闭网络弹框 */
  const closeAccountManage = () => setOpen(false);
  
  const AccountManageDOM = useMemo(() => {
    if (!open) return null;

    return <AccountManage open={open} closeAccountManage={closeAccountManage} />
  }, [open, closeAccountManage]);

  return { openAccountManage, closeAccountManage, AccountManageDOM }
}

export default useAccountManage;
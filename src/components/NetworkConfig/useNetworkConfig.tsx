import { useMemo, useState } from "react";
import NetworkConfig from ".";

/** 对外方便使用的 hooks */
const useNetworkConfig = () => {
  const [open, setOpen] = useState(false);

  /** 打开网络配置弹框 */
  const openNetworkConfig = () => setOpen(true);

  /** 关闭网络弹框 */
  const closeNetworkConfig = () => setOpen(false);
  
  const NetworkDOM = useMemo(() => {
    if (!open) return null;

    return <NetworkConfig open={open} closeNetworkConfig={closeNetworkConfig} />
  }, [open, closeNetworkConfig]);

  return { openNetworkConfig, closeNetworkConfig, NetworkDOM }
}

export default useNetworkConfig;
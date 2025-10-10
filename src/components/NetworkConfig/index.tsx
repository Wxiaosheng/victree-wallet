import { useState } from 'react';
import { Button, List, Popover, Spin, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStore';
import FullModal from '../FullModal';
import AddNetwork from './AddNetwork';
import type { VNetwork } from '~src/types/network';

interface NetworkConfigProps {
  open: boolean;
  closeModal: () => void;
}

/** 网络配置 */
const NetworkConfig = (props: NetworkConfigProps) => {
  const { open, closeModal } = props;
  const [loading, setLoading] = useState(false);
  const [popover, setPopover] = useState(false);
  const { currentNetwork, networks, switchNetwork, addNetwork } = useWalletStore();

  /** 切换网络 */
  const handleSwitchNetwork = async (id: string) => {
    try {
      console.log('切换网络');
      setLoading(true);
      await switchNetwork(id);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  /** 打开网络配置表单 */
  const openPopover = async () => {
    setPopover(true);
  };

  /** 添加网络 */
  const handleAddNetwork = async (network: VNetwork) => {
    try {
      setLoading(true);

      await addNetwork(network);
      // 关闭弹框，刷新网络列表
      setPopover(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return <FullModal
    title="网络设置"
    open={open}
    onCancel={closeModal}
  >
    <Spin spinning={loading}>
      <List
        dataSource={networks}
        header={<div className='flex flex-row-reverse'>
          <Popover content={() => <AddNetwork handleAddNetwork={handleAddNetwork} />} title="自定义网络" open={popover} placement='bottomLeft'>
            <Button type="primary" onClick={openPopover}>添加网络</Button>
          </Popover>
        </div>}
        renderItem={(item) => (<List.Item
          key={item.id}
          className='cursor-pointer'
          onClick={() => handleSwitchNetwork(item.id)}
          extra={<CheckCircleTwoTone twoToneColor={currentNetwork.id === item.id ? "#52c41a" : "#aaaaaa"} />}
        >
          <List.Item.Meta
            title={item.name}
            description={<div className='flex flex-col'>
              <Typography.Text type="secondary">{`Chain ID: ${item.chainId} * ${item.symbol}`}</Typography.Text>
              <Typography.Text type="secondary" className='overflow-hidden whitespace-nowrap text-ellipsis'>{item.rpcUrl}</Typography.Text>
            </div>}
          />
        </List.Item>)}
      />
    </Spin>

  </FullModal>
}

export default NetworkConfig;
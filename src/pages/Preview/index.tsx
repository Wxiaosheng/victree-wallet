import { Button, Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import useWalletStore from '~src/store/walletStore';

/**
 * 交易预览页
 * 
 * 页面组成部分
 * * 转账金额
 * * 账户地址
 * * 网络信息
 * * 交易费用
 * * 唯一标识符（Nonce）
 * * 交易数据
 * * 交易确认按钮
 */

const Preview = () => {
  const { currentNetwork } = useWalletStore();

  return <div>
    <Card>
      <div className='text-3xl text-center'> 1 Victree </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>自<div>Account 1</div></div>
        <RightOutlined />
        <div>至<div>Account 2</div></div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div >网络</div>
        <div>{currentNetwork.name}</div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>网络费</div>
        <div>0.00021 Victree</div>
      </div>
      <div className='flex items-center justify-between mt-2'>
        <div>速度</div>
        <div>～ 12 秒</div>
      </div>
      <div className='flex items-center justify-between mt-2'>
        <div>最大费用</div>
        <div>0.00021 Victree</div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>Nonce</div>
        <div>1</div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>数据</div>
        <div>0x1234567890abcdef...</div>
      </div>
    </Card>
    <div className='flex flex-row mt-4'>
      <Button className='flex-1 h-12'>取消</Button>
      <Button className='flex-1 h-12 ml-4' type='primary'>确认交易</Button>
    </div>
  </div>;
};

export default Preview;
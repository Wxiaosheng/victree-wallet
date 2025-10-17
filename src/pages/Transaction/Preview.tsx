import { formatUnits } from 'ethers';
import { Button, Card, InputNumber } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import EllipsisMiddle from '~src/components/EllipsisMiddle';
import usePasswordModal from '~src/hooks/usePasswordModal';
import type { PreviewData } from './usePreview';

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

const Preview = (props: { 
  previewData: PreviewData;
  clearPreviewData: () => void; 
  sendTransaction: () => Promise<void>;
}) => {
  const { clearPreviewData, previewData, sendTransaction } = props;
  const { from, to, amount, token, network, gasPrice, gasLimit } = previewData;

  const { openPasswordModal, PasswordDOM } = usePasswordModal({ callback: sendTransaction });

  return <div>
    <Card>
      <div className='text-3xl text-center'>
        {formatUnits(amount, token.decimals)} {token.symbol}
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>
          自
          <EllipsisMiddle className='flex'>{from}</EllipsisMiddle>
        </div>
        <RightOutlined className='mx-4' />
        <div>至
          <EllipsisMiddle className='flex'>{to}</EllipsisMiddle>
        </div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div >网络</div>
        <div>{network.name}({network.chainId})</div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>Gas Price (Gwei)</div>
        <InputNumber className='w-24' defaultValue={Number(gasPrice)} />
      </div>
      <div className='flex items-center justify-between mt-2'>
        <div>Gas Limit</div>
        <InputNumber className='w-24' defaultValue={Number(gasLimit)} />
      </div>
      <div className='flex items-center justify-between mt-2'>
        <div>速度</div>
        <div>～ 12 秒</div>
      </div>
    </Card>
    <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>Nonce</div>
        <div>1</div>
      </div>
    </Card>
    {/* <Card className='mt-4'>
      <div className='flex items-center justify-between'>
        <div>数据</div>
        <div>0x1234567890abcdef...</div>
      </div>
    </Card> */}
    <div className='flex flex-row mt-4'>
      <Button className='flex-1 h-12' onClick={clearPreviewData}>取消</Button>
      <Button className='flex-1 h-12 ml-4' type='primary' onClick={openPasswordModal}>确认交易</Button>
    </div>

    {PasswordDOM}
  </div>;
};

export default Preview;
import { parseEther, parseUnits } from "ethers";
import { Button, Form, Input, InputNumber } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TokenType } from "~src/store/contants";
import useAccountManage from '~src/components/AccountManage/useAccountManage';
import useWalletStore from '~src/store/walletStore';
import useTokenList from '../Token/hooks/useTokenList';
import usePreview, { type PreviewData } from './usePreview';
import Preview from './Preview';
import FullModal from "~src/components/FullModal";

/** 
 * 交易页面 
 * 
 * form: 发起方地址（支持从当前所有账户选择）
 * 
 * to: 接收方地址（支持手动输入、二维码展示等）
 * 
 * amount: 交易金额
 * 
 * token: 代币类型（支持选择 原生代币 和 当前账户持有的代币）
 * 
 */
const Transaction = () => {
  const [form] = Form.useForm();
  const { currentAccount, currentNetwork } = useWalletStore();
  const { openAccountManage, AccountManageDOM } = useAccountManage();
  const { currentToken, openTokenList, TokenListDOM } = useTokenList();
  const { previewData, savePreviewData, clearPreviewData, sendTransaction } = usePreview();

  const handleTranscation = async () => {
    const values: PreviewData = form.getFieldsValue();

    // 账户
    values.from = currentAccount.address;

    // 代币
    values.token = currentToken;
    if (currentToken.type === 'native') {
      values.amount = parseEther(`${values.amount}`);
      values.gasLimit = '25000'; // 不知道为什么 21000 会一直失败
    } else if (currentToken.type === TokenType.ERC20) {
      values.amount = parseUnits(`${values.amount}`, currentToken.decimals);
      values.gasLimit = '60000';
    }

    // 网络相关信息
    values.network = currentNetwork;
    values.gasPrice = '20';
    
    console.log('交易数据:', values);
    savePreviewData(values);
  };

  return <Form form={form} layout="vertical">
    <Form.Item label="From" name="from">
      <div className='flex flex-row justify-between cursor-pointer p-2 border border-gray-200 rounded-md' onClick={openAccountManage}>
        <div className='flex flex-col'>
          <span>{currentAccount.name}</span>
          <span className='text-sm text-gray-500'>{currentAccount.address}</span>
        </div>
        <DownOutlined />
      </div>
    </Form.Item>
    <div className='flex flex-row justify-between items-center mb-4'>
      <div className='flex-1 flex flex-row justify-between cursor-pointer p-2 border border-gray-200 rounded-md' onClick={openTokenList}>
        <div>{currentToken?.name || '请选择代币'}</div>
        <DownOutlined />
      </div>
      <Form.Item name="amount" className='flex-1 mt-6 ml-4'>
        <InputNumber className='w-full' min={0} placeholder="请输入交易金额" />
      </Form.Item>
    </div>
    <Form.Item label="To" name="to">
      <Input type="text" placeholder="接收方地址" />
    </Form.Item>

    <Button type="primary" className='w-full mt-4' onClick={handleTranscation}>发起交易</Button>

    { // 交易预览
      previewData && <FullModal open={!!previewData} title="交易预览" onCancel={clearPreviewData}>
        <Preview 
          previewData={previewData} 
          clearPreviewData={clearPreviewData} 
          sendTransaction={sendTransaction}
        />
      </FullModal>
    }

    {AccountManageDOM}
    {TokenListDOM}
  </Form>;
};

export default Transaction;
import { DownOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import useAccountManage from '~src/components/AccountManage/useAccountManage';
import useWalletStore from '~src/store/walletStore';

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
  const { currentAccount } = useWalletStore();
  const { openAccountManage, AccountManageDOM } = useAccountManage();

  return <Form>
    <Form.Item label="From" name="from">
      <div className='flex flex-row justify-between cursor-pointer p-2 border border-gray-200 rounded-md' onClick={openAccountManage}>
        <div className='flex flex-col'>
          <span>{currentAccount.name}</span>
          <span className='text-sm text-gray-500'>{currentAccount.address}</span>
        </div>
        <DownOutlined />
      </div>
    </Form.Item>
    <Form.Item name="type">
      <Input 
        type="text" 
        placeholder="请输入交易金额" 
      />
    </Form.Item>
    <Form.Item label="To" name="to">
      <Input type="text" placeholder="接收方地址" />
    </Form.Item>
    <Form.Item label="Amount" name="amount">
      <Input type="number" placeholder="交易金额" />
    </Form.Item>

    {AccountManageDOM}
  </Form>;
};

export default Transaction;
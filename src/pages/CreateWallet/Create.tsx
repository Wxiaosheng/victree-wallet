import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, type FormInstance } from "antd";
import { WalletTwoTone } from "@ant-design/icons";
import useWalletStore from "~src/store/walletStare";

/**
 * 创建钱包
 * 
*/
const Create = (props: { form: FormInstance }) => {
  const { form } = props;

  const [modal, setModal] = useState<{ open: boolean; mnemonic: string; } | null>(null);

  const navigate = useNavigate();
  const { createWallet } = useWalletStore();

  /** 创建钱包 */
  const handleCreate = async () => {
    const { password } = form.getFieldsValue();

    const { mnemonic } = await createWallet(password);

    // 提示用户记住助记词
    setModal({
      open: true,
      mnemonic
    });
  }

  /** 用户确认助记词弹框 */
  const handleModalOk = () => {
    setModal({ open: false, mnemonic: '' });
    // 创建成功，跳转首页
    navigate('/');
  }

  return <div className="mx-2 text-center">
    <div className="text-3xl my-3"><WalletTwoTone />创建新钱包</div>
      <Form.Item
      name="password"
      label="设置密码"
      rules={[{ required: true, message: '请输入有效密码!' }]}
      hasFeedback
    >
      <Input.Password placeholder="请输入密码（至少8位）" />
    </Form.Item>
    <Form.Item
      name="confirm"
      label="确认密码"
      dependencies={['password']}
      hasFeedback
      rules={[
        { required: true, message: '请输入有效密码!' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请输入相同的密码!!'));
          },
        }),
      ]}
    >
      <Input.Password placeholder="再次输入密码" />
    </Form.Item>
    <Button type="primary" onClick={handleCreate}>创建钱包</Button>
    {
      modal?.open && (<Modal 
        open={true} 
        title="请记住你的助记词"
        footer={[<Button danger type="primary" onClick={handleModalOk}>确认</Button>]}
      >
        <div className='text-gray-500'>助记词务必请妥善保存，如果泄漏会导致资产全部丢失！！</div>
        <div className="flex flex-wrap">{
          modal?.mnemonic.split(' ').map(word => (<span key={word} className="w-1/3 p-2">{word}</span>))
        }</div>
      </Modal>)
    }
  </div>
}

export default Create;
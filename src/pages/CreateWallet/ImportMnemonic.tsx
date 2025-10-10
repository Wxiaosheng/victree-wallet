import { validateMnemonic } from "bip39";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { ProfileTwoTone } from '@ant-design/icons';
import useWalletStore from "~src/store/walletStore";

/** 
 * 通过助记词导入钱包 
 * @example mnemonic gym excuse zebra mixture fox isolate require duty blade add discover apart
 * @example private 0x339d97b4779aa3e964ba60f1b626bff7cffbec9b53dfce59a0183642cd6f80b9
 * @example address 0xb61b19c3e194aE743305e853F1FAaA45f60c160D
 */
const ImportMnemonic = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { importWalletByMnemonic } = useWalletStore();
  
  /** 导入私钥 */
  const handleImport = async () => {
    // 数据合法性校验
    const { mnemonic, password } = form.getFieldsValue();

    if (!validateMnemonic(mnemonic)) {
      message.error("您输入的助记词不合法，请输入正确的助记词");
      return;
    }
    if (password.length < 8) {
      message.error('密码不能小于8位');
      return;
    }

    await importWalletByMnemonic(mnemonic, password);

    // 导入成功，跳转首页
    navigate('/');
  }

  return <Form className="mx-3 text-center" form={form}>
    <div className="text-3xl my-3"><ProfileTwoTone className="mr-2" />导入助记词</div>
    <Form.Item 
      name="mnemonic" 
      label="助记词"
      rules={[{ required: true, message: '请输入助记词' }]}
    >
      <Input placeholder="输入助记词 (12个单词组成的字符串，要使用空格隔开)" />
    </Form.Item>
    <Form.Item 
      name="password" 
      label="设置密码"
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input type="password" placeholder="输入密码 (至少8位)" />
    </Form.Item>
    <Button type="primary" onClick={handleImport}>生成钱包</Button>
  </Form>
}

export default ImportMnemonic;
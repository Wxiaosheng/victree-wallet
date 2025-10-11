import { Button, Form, Input } from "antd";
import usePasswordModal from "~src/hooks/usePasswordModal";
import useWalletStore from "~src/store/walletStore";

/** 添加账户（以太坊账户） */
const AddAccount = (props: { handleAddAccount: (account: string) => Promise<void> }) => {
  const { handleAddAccount } = props;

  const [form] = Form.useForm();
  const { accounts } = useWalletStore();

  // 添加账户
  const generatorAccount = async () => {
    await form.validateFields();

    const { name } = form.getFieldsValue();
    handleAddAccount(name);
  }

  // 验证密码
  const { openPasswordModal, PasswordDOM } = usePasswordModal({ callback: generatorAccount });

  return <div className="max-h-96 overflow-scroll">
    <Form form={form}>
      <Form.Item
        name="name"
        label="账户名称"
      >
        <Input placeholder={`Account ${accounts.length + 1}`} />
      </Form.Item>
    </Form>
    <Button type="primary" onClick={openPasswordModal}>添加账户</Button>

    {PasswordDOM}
  </div>
}

export default AddAccount;
import { useMemo, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import useWalletStore from "~src/store/walletStore";

/** 输入密码弹框 */
const usePasswordModal = (props: { callback: () => void }) => {
  const { callback } = props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { validPassword } = useWalletStore();

  const openPasswordModal = () => setOpen(true);

  /** 确认 */
  const handleConfim = async () => {
    const { password } = form.getFieldsValue();
    if (!password) {
      message.error("请输入密码");
      return;
    }
    // 验证密码
    const flag = await validPassword(password);

    if (!flag) {
      message.error("密码错误，请重新输入！！");
      return;
    }

    callback();
    setOpen(false);
  }

  const PasswordDOM = useMemo(() => (<Modal 
    open={open}
    footer={null}
    onCancel={() => setOpen(false)}
  >
    <div className="flex flex-col">
      <Form form={form}>
        <Form.Item name="password">
          <Input className="mt-8" type="password" placeholder="请输入密码验证操作" />
        </Form.Item>
      </Form>
      <Button className="grow-0 mt-8" type="primary" onClick={handleConfim}>确认</Button>
    </div>
  </Modal>), [open]);

  return { PasswordDOM, openPasswordModal }
}

export default usePasswordModal;
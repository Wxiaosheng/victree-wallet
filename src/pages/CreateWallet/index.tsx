import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, type RadioChangeEvent } from "antd";
import { WalletTwoTone } from "@ant-design/icons";
import useWalletStore from "~src/store/walletStare";
import type { CheckboxGroupProps } from 'antd/es/checkbox';

/** 页面 tab */
enum CreateTab {
  /** 创建钱包 */
  create = 'create',
  /** 私钥导入 */
  importKey = 'importKey',
  /** 助记词导入 */
  importMnemonic = 'importMnemonic'
};

const options: CheckboxGroupProps<string>['options'] = [
  { label: '创建钱包', value: CreateTab.create },
  { label: '私钥导入', value: CreateTab.importKey },
  { label: '助记词导入', value: CreateTab.importMnemonic },
];

const CreateWallet = () => {
  const [tab, setTab] = useState(CreateTab.create);

  const navigate = useNavigate();
  const { createWallet } = useWalletStore();

  const [form] = Form.useForm();

  const handleChange = (e: RadioChangeEvent) => {
    setTab(e.target.value)
  }


  /** 创建钱包 */
  const handleCreate = async () => {
    const { password } = form.getFieldsValue();

    const { mnemonic, account } = await createWallet(password);

    console.log({
      mnemonic, account
    })

    // 创建成功，跳转首页
    navigate('/');
  }

  return <div>
    <Radio.Group
      block
      value={tab}
      options={options}
      optionType="button"
      buttonStyle="solid"
      onChange={handleChange}
    />
    <Form form={form}>
      { tab === CreateTab.create && (<div className="mx-2 text-center">
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
      </div>) }
      { tab === CreateTab.importKey && (<div>私钥导入</div>) }
      { tab === CreateTab.importMnemonic && (<div>助记词导入</div>) }
    </Form>
  </div>
}

export default CreateWallet;
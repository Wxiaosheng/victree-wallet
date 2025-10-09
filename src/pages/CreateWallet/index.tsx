import { useState } from "react";
import { Form, Radio, type RadioChangeEvent } from "antd";
import Create from "./Create";
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
  const [form] = Form.useForm();

  const handleChange = (e: RadioChangeEvent) => {
    setTab(e.target.value)
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
      { tab === CreateTab.create && (<Create form={form}/>) }
      { tab === CreateTab.importKey && (<div>私钥导入</div>) }
      { tab === CreateTab.importMnemonic && (<div>助记词导入</div>) }
    </Form>
  </div>
}

export default CreateWallet;
import { useState } from "react";
import { Form, Radio, type RadioChangeEvent } from "antd";
import Create from "./Create";
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import ImportKey from "./ImportKey";
import ImportMnemonic from "./ImportMnemonic";

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
    ></Radio.Group>
    { tab === CreateTab.create && <Create /> }
    { tab === CreateTab.importKey && <ImportKey /> }
    { tab === CreateTab.importMnemonic && <ImportMnemonic /> }
  </div>
}

export default CreateWallet;
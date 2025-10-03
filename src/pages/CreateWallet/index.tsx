import { useState } from "react";
import { Tabs, type TabsProps } from 'antd-mobile'

/** 页面 tab */
enum createTab {
  /** 创建钱包 */
  create = 'create',
  /** 私钥导入 */
  importKey = 'importKey',
  /** 助记词导入 */
  importMnemonic = 'importMnemonic'
};

const CreateWallet = () => {
  const [tab, setTab] = useState(createTab.create);

  const onChange = (key: string) => {
    console.log(key);
  };

  return <Tabs defaultActiveKey={tab} onChange={onChange}>
    <Tabs.Tab key={createTab.create} title='创建钱包' >
      创建钱包
    </Tabs.Tab>
    <Tabs.Tab key={createTab.importKey} title="私钥导入">
      私钥导入
    </Tabs.Tab>
    <Tabs.Tab key={createTab.importMnemonic} title="助记词导入">
      助记词导入
    </Tabs.Tab>
  </Tabs>
}

export default CreateWallet;
import { useState } from "react";
import { Radio, type RadioChangeEvent } from "antd";
import NativeCurrency from "./NativeCurrency";
import Token from "../Token";
import NFT from "./NFT";
import type { CheckboxGroupProps } from 'antd/es/checkbox';

const options: CheckboxGroupProps<string>['options'] = [
  { label: '代币', value: 'token' },
  { label: '去中心化金融', value: 'nft' },
];

/**
 * 首页结构
 * 
 * 原生代币相关信息
 * 
 * tab(Token、NFT)
 */
const Home = () => {
  const [tab, setTab] = useState('token');

  const onChange = (e: RadioChangeEvent) => {
    setTab(e.target.value);
  };

  return <div>
    <NativeCurrency />
    <Radio.Group className="mt-2" block options={options} value={tab} optionType="button" onChange={onChange} />

    {tab === 'token' && <Token />}
    {tab === 'nft' && <NFT />}
  </div>
}

export default Home;
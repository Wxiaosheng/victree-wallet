import { Button, Form, Input, InputNumber } from "antd";
import type { VNetwork } from "~src/types/network";

/** 
 * 添加网络  
 * 
 * 必备字段，name、chainId、rpcUrl
 * 
 * 原生代币信息、区块链浏览器
 * 
 */
const AddNetwork = (props: { handleAddNetwork: (network: VNetwork) => Promise<void> }) => {
  const { handleAddNetwork } = props;

  const [form] = Form.useForm();
  
  const onAdd = async () => {
    // 验证表单
    await form.validateFields();

    // 添加网络
    const network = form.getFieldsValue();

    await handleAddNetwork({ ...network, isCustom: true });
  }

  return <>
    <div className="h-96 overflow-scroll">
      <Form form={form}>
        <Form.Item
          name="name"
          label="网络名称"
          rules={[
            { required: true, message: '请输入网络名称' }
          ]}
        >
          <Input placeholder="请输入网络名称" />
        </Form.Item>
        <Form.Item
          name="chainId"
          label="链ID"
          rules={[
            { required: true, message: '请输入链ID' }
          ]}
        >
          <InputNumber placeholder="请输入链ID" />
        </Form.Item>
        <Form.Item
          name="rpcUrl"
          label="RPC 节点"
          rules={[
            { required: true, message: '请输入RPC 节点' }
          ]}
        >
          <Input placeholder="请输入RPC 节点" />
        </Form.Item>
        <Form.Item
          name="symbol"
          label="货币符号"
          rules={[
            { required: true, message: '请输入货币符号' }
          ]}
        >
          <Input placeholder="请输入货币符号" />
        </Form.Item>
        <Form.Item
          name="blockExplorer"
          label="区块链浏览器地址"
          rules={[
            { required: true, message: '请输入区块链浏览器地址' }
          ]}
        >
          <Input placeholder="请输入区块链浏览器地址" />
        </Form.Item>
      </Form>
    </div>
    <Button type="primary" onClick={onAdd}>添加自定义网络</Button>
  </>
}

export default AddNetwork;
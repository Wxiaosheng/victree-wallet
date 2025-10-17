import { useMemo, useState } from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { isAddress } from "ethers";
import useWalletStore from "~src/store/walletStore";
import { TokenType } from "~src/store/contants";

const tokenTypes = [
  { label: TokenType.ERC20, value: TokenType.ERC20 },
  { label: TokenType.ERC721, value: TokenType.ERC721 },
  { label: TokenType.ERC1155, value: TokenType.ERC1155 },
]

/**
 * 添加代币弹窗的 hooks
 */
const useAddTokenModal = () => {
  const [open, setOpen] = useState(false);
  const [validLoading, setValidLoading] = useState(false);
  const [form] = Form.useForm();
  const { currentNetwork, validERC20, validERC721, addToken } = useWalletStore();
  const tokenType = Form.useWatch('tokenType', form);
  const contractAddress = Form.useWatch('contractAddress', form);

  const openAddTokenModal = () => {
    setOpen(true);
  }

  const closeAddTokenModal = () => {
    setOpen(false);
  }

  /** 添加代币 */
  const handleAddToken = async () => {
    try {
      const values = await form.validateFields();
      
      await addToken({
        type: values.tokenType as keyof typeof TokenType,
        contractAddress: values.contractAddress,
        name: values.name,
        symbol: values.symbol,
        decimals: parseInt(values.decimals, 10) || 18,
        chainId: currentNetwork.chainId,
      });
      message.success('添加成功');
      closeAddTokenModal();
      form.resetFields();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /** 验证合约 */
  const validToken = async () => {
    setValidLoading(true);
    if (!isAddress(contractAddress)) {
      message.error('合约地址不合法');
      return;
    }

    if (tokenType === TokenType.ERC20) {
      try {
        const res = await validERC20(contractAddress);
        form.setFieldsValue({
          name: res.name,
          symbol: res.symbol,
          decimals: res.decimals,
        });
        message.success('验证成功');
      } catch (error: any) {
        message.error(error?.message || '验证失败');
      }
    } else if (tokenType === 'erc721') {
      try {
        const res = await validERC721(contractAddress);
        form.setFieldsValue({
          name: res.name,
          symbol: res.symbol,
          decimals: 0,
        });
        message.success('验证成功');
      } catch (error: any) {
        message.error(error?.message || '验证失败');
      }
    } else {
      message.error('暂不支持该类型的合约');
    }

    setValidLoading(false);
  }

  const AddTokenModal = useMemo(() => {
    if (!open) return null;

    return <Modal title="添加代币" open={open} onCancel={closeAddTokenModal} footer={null}>
      <Form form={form} layout="vertical">
        <Form.Item label="代币类型" name="tokenType" rules={[{ required: true, message: '选择代币类型' }]}>
          <Select options={tokenTypes} placeholder="请选择代币类型" />
        </Form.Item>
        <Form.Item label="合约地址" name="contractAddress" rules={[{ required: true, message: '请输入合约地址' }]}>
          <Input 
            placeholder="请输入合约地址" 
            suffix={<Button loading={validLoading} disabled={!tokenType || !contractAddress} type="link" onClick={validToken}>验证</Button>} 
          />
        </Form.Item>
        <Form.Item label="代币名称" name="name" rules={[{ required: true, message: '请输入代币名称' }]}>
          <Input placeholder="请输入代币名称" />
        </Form.Item>
        <Form.Item label="代币符号" name="symbol" rules={[{ required: true, message: '请输入代币符号' }]}>
          <Input placeholder="请输入代币符号" />
        </Form.Item>
        <Form.Item label="精度" name="decimals" rules={[{ required: true, message: '请输入精度' }]}>
          <Input placeholder="请输入精度" type="number" />
        </Form.Item>
      </Form>
      <Button type="primary" block onClick={handleAddToken}>确认</Button>
    </Modal>
  }, [open, validLoading, form, tokenType, contractAddress]);

  return {
    openAddTokenModal,
    closeAddTokenModal,
    AddTokenModal,
  }
}

export default useAddTokenModal;
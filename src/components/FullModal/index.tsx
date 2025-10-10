import { Modal, type ModalProps } from 'antd';

/** 全局覆盖的弹框 */
const FullModal = (props: ModalProps) => {
  const { title, open, onCancel, onOk, children } = props;

  return <Modal
    title={title}
    open={open}
    mask={false}
    style={{ top: 0, minWidth: '100%', height: 600, margin: 0 }}
    footer={null}
    onOk={onOk}
    onCancel={onCancel}
  >
    <div style={{ height: 600 }}>{children}</div>
  </Modal>
}

export default FullModal;
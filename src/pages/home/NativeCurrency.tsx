import { useNavigate } from "react-router-dom";
import { Button, Card, Statistic } from "antd";
import { formatEther } from "ethers";
import useAccountInfo from "~src/hooks/useAccountInfo";


/** 
 * 原生代币信息
 */
const NativeCurrency = () => {

  const navigate = useNavigate();
  const { loading, balance, symbol } = useAccountInfo();

  const handleSend = () => {
    navigate('/transaction');
  }

  return <Card style={{ width: '100%', maxHeight: 85 }} loading={loading}>
    <div className="flex flex-row justify-between">
      <Statistic value={formatEther(balance || 0)} precision={4} suffix={symbol} />
      <Button type="primary" onClick={handleSend}>转账</Button>
    </div>
  </Card>
}

export default NativeCurrency;
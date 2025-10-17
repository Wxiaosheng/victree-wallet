import { Typography } from 'antd';

const { Text } = Typography;

/**
 * 文本省略中间
 */
const EllipsisMiddle: React.FC<{ className?: string; suffixCount?: number; children: string }> = ({
  className,
  suffixCount = 5,
  children,
}) => {
  const start = children.slice(0, children.length - suffixCount);
  const suffix = children.slice(-suffixCount).trim();
  return (
    // <Typography.Paragraph 
    //   copyable
    //   ellipsis={{ suffix }}
    //   type="secondary"
    //   className="w-56"
    // >
    //   {start}
    // </Typography.Paragraph>
    <Text className={className} ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};

export default EllipsisMiddle;
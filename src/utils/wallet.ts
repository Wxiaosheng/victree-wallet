
/**
 * 验证给定的字符串是否是合法的私钥  
 * 要求：0x开头，且为64位的十六进制 字符串  
 */
export const isValidPrivateKey = (key: string) => {
  // 校验私钥格式：是否以 '0x' 开头，且去掉 '0x' 后为 64 个十六进制字符
  if (!/^0x[a-fA-F0-9]{64}$/.test(key)) {
    return false;
  }

  // 校验私钥是否在有效范围内
  const privateKeyBigInt = BigInt(key);
  const MAX_PRIVATE_KEY = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
  if (privateKeyBigInt <= 0n || privateKeyBigInt >= MAX_PRIVATE_KEY) {
    return false;
  }

  return true;
}
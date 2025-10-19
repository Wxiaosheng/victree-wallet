
export enum BIP1193_METHOD {
  /** 请求账户列表 */
  eth_requestAccounts = 'eth_requestAccounts',
  /** 发送交易请求 */
  eth_sendTransaction = 'eth_sendTransaction',
  /** 请求钱包签名指定的消息 */
  eth_sign = 'eth_sign',

  /** 请求账户 */
  // personalSign = 'personal_sign',
  /** 请求账户 */
  // signTypeData  = 'eth_signTypeData_v4' ,
}

// type MethodType = keyof typeof BIP1193_METHOD;


/**
 * 全局对象注入
*/
export default function injected() {
  console.log('开始注入全局对象')

  if (window.ethereum && window.isVictreeWallet) return;

  // 请求id
  const generateRequestId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

  const victreeWallet = {
    request: (args: { method: string, params: object }) => new Promise((resolve, reject) => {
      const { method, params } = args;
      if (!method) {
        reject('method 不能为空！')
        return;
      };

      // 为什么需要postMessage给内容脚本？因为这里的运行的上下文环境是打开的网页，而不是chrome扩展
      // const walletStore = useWalletStore.getState();
      // console.log('injected walletStore', walletStore)
      if (method === 'eth_requestAccounts') {
        const requestId = generateRequestId();
        window.postMessage({
          type: 'eth_requestAccounts',
          from: 'victree-injected',
          requestId: requestId
        }, "*");

        const handle = (event) => {
          if (
            event.data?.requestId !== requestId ||
            event.data?.from !== 'victree-content'
          ) return;

          console.log('网页请求 content 返回的数据：', event)
          resolve(event.data.data);

          window.removeEventListener('message', handle);
        }

        window.addEventListener('message', handle);


        // 超时处理
        setTimeout(() => {
          reject('请求超时！！');
          window.removeEventListener('message', handle);
        }, 3000)
      }
    }),

    on: () => {

    },
  }

  window.victreeWallet = victreeWallet;

  console.log('全局对象注入成功')
}
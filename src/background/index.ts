// 如果您的代码中没有任何导入或导出，您需要在文件开头添加一行 export {}
// export {} 

import useWalletStore from "~src/store/walletStore";
import injected from "./injected";

// background 脚本是插件一直运行在后台的脚本
console.log('background starting ...')

// 当页面加载完成时注入
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 注入全局对象
  if (changeInfo.status === "complete" && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: injected
    }, (results) => {
      console.log("后台脚本在注入后收到回调: ", results);
    });

  }

});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('background 接收 content 的 message：', message)
  console.log('background 接收 content 的 sender: ', sender)

  const walletStore = useWalletStore.getState();
  if (message.type === 'eth_requestAccounts') {
    sendResponse({
      data: walletStore.accounts.map(a => a.address)
    })
  }
});


/**
 * 网页
 *  有 window.ethereum 对象，可以发起请求
 * 
 * content
 *  有 window 可以接受和发送 message 事件（用于和网页通信）
 *  有 chrome.runtime.seedMessage 可以与钱包插件通信
 * 
 * background
 *  有 chrome.runtime，可以接收 content 的传递消息并作出响应
 *  没有 window，无法直接监听页面的 postMessage
 * 
 */

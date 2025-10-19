# 如何注入 window.ethereum 全局对象？

## 详细流程（步骤化）
1. 扩展安装 → 指定 content script 注入页面  
  
  在 manifest.json 里声明 content script（通常在 document_start），这样扩展可以在网页加载时注入自己的脚本文件到页面，但内容脚本运行在浏览器的「隔离世界」（isolated world）——它能访问 DOM，但不能直接共享页面的 JS 作用域（因此不能直接在 window 上设置变量让页面脚本直接访问）。  

2. 内容脚本把一个 < script> 标签插入页面

  内容脚本创建一个 < script> 元素，把要在页面上下文执行的代码（provider 实现或桥接器）作为内联脚本或通过 src 加载，然后 append 到 document.documentElement 或 head。因为这个 < script> 在页面上下文执行，它可以直接访问并修改页面的全局对象（例如设置 window.ethereum）。

3. 页面上下文的 provider 实现

  注入的脚本在页面上下文注册 window.ethereum（通常是一个对象/代理，遵循 EIP‑1193），实现 request、on/removeListener 等方法。实际敏感逻辑（私钥、签名、用户交互）仍由扩展后台或扩展弹窗/页面处理——注入脚本只负责转发请求。

4. 消息转发（页面 ⇄ 内容脚本 ⇄ 扩展后台）

* 页面脚本调用 window.ethereum.request({ method, params })。  
* 注入的页面脚本将该请求发到内容脚本（常用 window.postMessage 或自定义 DOM 事件）。  
*  内容脚本收到后用 chrome.runtime.sendMessage / chrome.runtime.connect 发给扩展后台（或 service worker）。  
* 扩展后台处理（比如弹窗让用户确认签名），然后把结果一路返回，最终注入脚本在页面上下文把结果回传给调用方（通常以 Promise 形式resolve/reject）。  

5. 权限与用户确认  

  需要帐号访问或签名时，后台会触发扩展 UI（popup 或独立页面）让用户确认；只有用户同意后才会返回私钥操作或帐号信息。
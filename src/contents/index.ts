// 如果您的代码中没有任何导入或导出，您需要在文件开头添加一行 export {}
// export {}

// content 脚本，是在用户打开其他的页面时，会加载的脚本
console.log("contents index.ts start ...")

window.addEventListener('message', (event) => {

  if (
    event.source !== window ||
    !event.data?.type ||
    !event.data?.requestId ||
    event.data?.from !== 'victree-injected'
  ) return;

  // 与 background 通信
  chrome.runtime.sendMessage({
    type: event.data.type,
    requestId: event.data.requestId,
    data: event.data.data
  }, (response => {

    console.log('content 接收到 background 的返回：', response)

    // 将结果返回给页面
    window.postMessage({
      from: 'victree-content',
      requestId: event.data.requestId,
      success: true,
      data: response.data
    }, '*');

  }));
});
// Chrome DevTools Extension中不能使用console.log
const log = (...args) =>
  chrome.devtools.inspectedWindow.eval(`
    console.log(...${JSON.stringify(args)});
`);

// 注册回调，每一个http请求响应后，都触发该回调
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
  try {
    const [
      {
        // 请求的类型，查询参数，以及url
        request: { method, queryString, url },

        // 该方法可用于获取响应体
        getContent,
      },
    ] = args;

    log("[--ajax--]", method, queryString, url);

    // 将callback转为await promise
    // warn: content在getContent回调函数中，而不是getContent的返回值
    const content = await new Promise((res, rej) => getContent(res));
    log("[--ajax--]", content);
  } catch (err) {
    log("[--ajax--]", err.stack || err.toString());
  }
});

log("[--ajax--]", "开始记录--------");

var btn = document.getElementById("btn", "jpg");

// 第一种 通过点击事件
btn.onclick = function () {
  download("http://api.g0ngjie.com/assets/avatar.jpg", 'avatar.jpg');
};

function download(url, type, method = "get") {
  const xhh = new XMLHttpRequest();
  xhh.open(method, url);
  xhh.responseType = "blob";
  // xhh.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
  xhh.onreadystatechange = function () {
    if (xhh.readyState === 4 && xhh.status === 200) {
      // const name = xhh.getResponseHeader("Content-Disposition");
      // const filename = name.substring(20, name.length);
      // const fileName = name && name.split(';')[1].split('filename=')[1];
      // console.log("[debug]fileName:", fileName)
      const blob = new Blob([xhh.response]);
      const csvUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.target = "_blank";
      link.download = "fake." + type;
      link.click();
    }
  };
  xhh.send();
}

/*
{
  url: 下载文件的url,
  filename: 保存的文件名,
  conflictAction: 重名文件的处理方式,uniquify 括号防重，overwrite 覆盖，prompt 弹窗让用户决定
  saveAs: 是否弹出另存为窗口,
  method: 请求方式（POST或GET），
  headers: 自定义header数组,
  body: POST的数据
}
*/
function downloadFunc(url, filename) {
  chrome.downloads.download(
    {
      url: url,
      filename: filename,
      conflictAction: _ex_save_conflict,
      saveAs: false,
    },
    function (res) {}
  );
}

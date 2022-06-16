chrome.runtime.onInstalled.addListener(() => {
  console.log("background script run");
  
});

chrome.contextMenus.create({
  id: "clicker-select",
  contexts: ["all"],
  title: "Add to action",
  visible: false
});

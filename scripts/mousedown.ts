import { v4 as uuid } from 'uuid';

window.addEventListener ("load", main, false);

let lastClicked: any;

function updateLastClick(e: Event) {
  e = e || window.event;
  lastClicked = e.target;
  while(typeof(lastClicked.click) != "function")
    lastClicked = lastClicked.parentElement;
}

function main() {
  document.body.onmousedown = updateLastClick;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request.valueOf() == "lastClicked".valueOf()) {
      lastClicked.id = lastClicked.id ? lastClicked.id : uuid();
      let cl = lastClicked.getAttribute("class")
      sendResponse(JSON.stringify({id: lastClicked.id, classList: cl}));
    }
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
  });
}

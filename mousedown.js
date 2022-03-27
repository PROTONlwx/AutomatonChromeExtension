window.addEventListener ("load", main, false);

let lastClicked = null;

function updateLastClick(e) {
  e = e || window.event;
  lastClicked = e.target;
  while(typeof(lastClicked.click) != "function")
    lastClicked = lastClicked.parentElement;
}

function main() {
  document.body.onmousedown = updateLastClick;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request.valueOf() == "lastClicked".valueOf()) {
      lastClicked.id = lastClicked.id ? lastClicked.id : uuidv4();
      sendResponse(lastClicked.id);
    } else if (message.request.valueOf() == "clickId".valueOf()) {
      if (lastClicked != null) {
        console.log(message.id);
        for (let i = 0; i < 3; i++)
          document.getElementById(message.id).click();
        sendResponse("clicked");
      } else {
        sendResponse("none-selected");
      }
    }
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
  });
}


function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


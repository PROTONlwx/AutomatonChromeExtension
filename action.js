// let a = new IdClick("addbtn", null, null);
// let b = new IdClick("addbtn", null, null);
// let c = new IdClick("addbtn", null, null);
// a.next = b;
// b.prev = a;
// b.next = c;
// c.prev = b;
// a.executeAction();

// console.log(a.getObjRepresentation());
// console.log(b.getObjRepresentation());
// console.log(c.getObjRepresentation());

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.request.valueOf() == "actions".valueOf()) {
    let c = new Chain(message.actions);
    c.executeChain();
    sendResponse("Actions executed");
  }
});
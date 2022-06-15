import { Chain } from "./actionUtils"

// Listen for the popup javascript message
// Respond to request = actions
// Make an action chain and start execute action.
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.request.valueOf() == "actions".valueOf()) {
    let c = new Chain(message.actions);
    c.executeChain();
    sendResponse("Actions executed");
  }
}); 
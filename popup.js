"use strict";
let actions = [];
let buttons = [];
/******* UI ********/

// Listeners
chrome.contextMenus.onClicked.addListener(addbutton);
id("add-click").addEventListener("click", () => addClick());
id("add-input").addEventListener("click", () => addInput());
id("add-wait").addEventListener("click", () => addWait());
id("add-goto").addEventListener("click", () => addGoto());
id("add-break").addEventListener("click", () => addBreak());
id("execute").addEventListener("click", execute);
id("save").addEventListener("click", save);
id("clear").addEventListener("click", clear);
id("chinese").addEventListener("click", () => window.open("https://reetaa.com/#/singlePost/68"));

// Load storage
loadStorage();

// Handlers

/**
 * Add a click action to page.
 */
function addClick(obj=null) {
  let [row, col3] = templateAction("Click");
  let choose = document.createElement("button");
  choose.type = "button";
  choose.classList.add("btn", "btn-outline-primary", "btn-sm", "choose-target");
  choose.textContent = obj ? JSON.stringify({id: obj.id, classList: obj.classList}) : "Choose target";

  col3.appendChild(choose);

  id("actions").appendChild(row);
  choose.addEventListener("click", addMenuItem);
}

/**
 * Add a input action to page.
 */
function addInput(obj=null) {
  let [row, col3] = templateAction("Input");
  let choose = document.createElement("button");
  choose.type = "button";
  choose.classList.add("btn", "btn-outline-primary", "btn-sm", "choose-target");
  choose.textContent = obj ? JSON.stringify({id: obj.id, classList: obj.classList}) : "Choose target";
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");
  
  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Input";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");
  inputArea.value = obj ? obj.text : "Your input";

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col3.appendChild(choose);
  col3.appendChild(inputSection);

  id("actions").appendChild(row);
  choose.addEventListener("click", addMenuItem);
}

/**
 * Add a wait action to page.
 */
function addWait(obj=null) {
  let [row, col3] = templateAction("Wait");
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Wait";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");
  inputArea.value = obj ? obj.time / 1000 : "";
  let inputTail = document.createElement("span");
  inputTail.classList.add("input-group-text");
  inputTail.textContent = "Second";

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  inputSection.appendChild(inputTail);

  col3.appendChild(inputSection);
  id("actions").appendChild(row);
}

/**
 * Add a goto action to page.
 */
function addGoto(obj=null) {
  let [row, col3] = templateAction("Goto");
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Goto Step";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");  
  inputArea.value = obj ? obj.gotoStep : "";

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col3.appendChild(inputSection);
  id("actions").appendChild(row);
}

/**
 * Add a break action to page.
 */
function addBreak(obj=null) {
  let [row, col3] = templateAction("Break");
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "After";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");
  inputArea.value = obj ? obj.pass : "";
  let inputTail = document.createElement("span");
  inputTail.classList.add("input-group-text");
  inputTail.textContent = "Pass";

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  inputSection.appendChild(inputTail);

  col3.appendChild(inputSection);
  id("actions").appendChild(row);
}

/**
 * Send the actions to content script to execute.
 */
async function execute() {
  actions = [];
  document.querySelectorAll(".action").forEach(populate);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {request: "actions", actions: actions}, function(response) {
    console.log(response);
  });
}

/**
 * Save all actions on page to storage.
 */
async function save() {
  actions = [];
  document.querySelectorAll(".action").forEach(populate);
  chrome.storage.sync.set({"click-input-automaton-actions": actions}, function() {});
}

/**
 * Choose element from page.
 */
function addMenuItem(evt) {
  chrome.contextMenus.update("clicker-select", {
    visible: true
  });
  evt.target.textContent = 'Selecting';
  buttons.push(evt.target);
}

/**
 * Delete action from page.
 */
function deleteAction(evt) {
  let action = evt.target;
  while (!action.classList.contains("action")) {
    action = action.parentElement;
  }
  action.remove();
  reorder();
}

/**
 * Delete all action from page.
 */
function clear() {
  let parent = id("actions");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/**
 * Load stored actions.
 */
function loadStorage() {
  chrome.storage.sync.get("click-input-automaton-actions", function(result) {
    let actArr = result["click-input-automaton-actions"];
    actArr.forEach(act => {
      if (act.type == "click") {
        addClick(act);
      } else if (act.type == "wait") {
        addWait(act);
      } else if (act.type == "goto") {
        addGoto(act);
      } else if (act.type == "break") {
        addBreak(act);
      } else if (act.type == "input") {
        addInput(act);
      } else {
        throw "action type not recognized: " + type;
      }
    });
  });
}

/******** UI END *******/


/******** HELPER *******/
function addbutton(info, tab) {
  chrome.tabs.sendMessage(tab.id, {request: "lastClicked"}, function(response) {
    buttons.forEach(btn => btn.textContent = response);
    buttons = [];
    chrome.contextMenus.update("clicker-select", {
      visible: false
    });
  });
}

function populate(action) {
  let type = action.querySelector("p.action-type").textContent.toLowerCase();
  if (type == "click") {
    let tmp = action.querySelector(".choose-target").textContent;
    let id = {};
    if (tmp !== "Choose target") {
      id = JSON.parse(action.querySelector(".choose-target").textContent);
    }
    actions.push({type: type, id: id.id, classList: id.classList});
  } else if (type == "wait") {
    let time = parseInt(action.querySelector("input").value);
    time = isNaN(time) ? 0 : time * 1000;
    actions.push({type: type, time: time});
  } else if (type == "goto") {
    let gotoStep = parseInt(action.querySelector("input").value);
    gotoStep = isNaN(gotoStep) ? 0 : gotoStep;
    actions.push({type: type, gotoStep: gotoStep});
  } else if (type == "break") {
    let pass = parseInt(action.querySelector("input").value);
    pass = isNaN(pass) ? 1 : pass;
    actions.push({type: type, pass: pass});
  } else if (type == "input") {
    let tmp = action.querySelector(".choose-target").textContent;
    let id = {};
    if (tmp !== "Choose target") {
      id = JSON.parse(action.querySelector(".choose-target").textContent);
    }
    let text = action.querySelector("input").value;
    actions.push({type: type, text: text, id: id.id, classList: id.classList});
  } else {
    throw "action type not recognized: " + type;
  }
}

function reorder() {
  let allAction = qsa(".action");
  for (let i = 0; i < allAction.length; i++) {
    allAction[i].querySelector(".step-no").textContent = i;
  }
}

function templateAction(typeName) {
  let row = document.createElement("div");
  row.classList.add("row", "action");

  let col1 = document.createElement("div");
  col1.classList.add("col-1");
  let col2 = document.createElement("div");
  col2.classList.add("col-2");
  let col3 = document.createElement("div");
  col3.classList.add("col");
  let col4 = document.createElement("div");
  col4.classList.add("col-1");

  let stepNo = document.createElement("span");
  stepNo.classList.add("badge", "bg-secondary", "step-no");
  stepNo.textContent = id("actions").childElementCount;
  let type = document.createElement("p");
  type.classList.add("action-type");
  type.textContent = typeName;
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  col1.appendChild(stepNo);
  col2.appendChild(type);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);

  del.addEventListener("click", deleteAction);

  return [row, col3];
}


function id(i){
  return document.getElementById(i);
}

function qsa(i){
  return document.querySelectorAll(i);
}

function qs(i){
  return document.querySelector(i);
}

/******** HELPER END *******/
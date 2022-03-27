"use strict";
let actions = [];
let buttons = [];
/******* UI ********/

// Listeners
chrome.contextMenus.onClicked.addListener(addbutton);
id("add-click").addEventListener("click", addClick);
id("add-input").addEventListener("click", addInput);
id("add-wait").addEventListener("click", addWait);
id("add-goto").addEventListener("click", addGoto);
id("add-break").addEventListener("click", addBreak);
id("execute").addEventListener("click", execute);
id("save").addEventListener("click", save);

// Handlers
function addClick() {
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
  type.textContent = "Click";
  let choose = document.createElement("button");
  choose.type = "button";
  choose.classList.add("btn", "btn-outline-primary", "btn-sm", "choose-target");
  choose.textContent = "Choose target";
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  col1.appendChild(stepNo);
  col2.appendChild(type);
  col3.appendChild(choose);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);
  id("actions").appendChild(row);

  choose.addEventListener("click", addMenuItem);
  del.addEventListener("click", deleteAction);
}

function addInput() {
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
  type.textContent = "Input";
  let choose = document.createElement("button");
  choose.type = "button";
  choose.classList.add("btn", "btn-outline-primary", "btn-sm", "choose-target");
  choose.textContent = "Choose target";
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Input";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col1.appendChild(stepNo);
  col2.appendChild(type);
  col3.appendChild(choose);
  col3.appendChild(inputSection);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);
  id("actions").appendChild(row);

  choose.addEventListener("click", addMenuItem);
  del.addEventListener("click", deleteAction);
}

function addWait() {
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
  type.textContent = "Wait";
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Wait";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col1.appendChild(stepNo);
  col2.appendChild(type);
  col3.appendChild(inputSection);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);
  id("actions").appendChild(row);
  del.addEventListener("click", deleteAction);

}


function addGoto() {
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
  type.textContent = "Goto";
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "Goto Step";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col1.appendChild(stepNo);
  col2.appendChild(type);
  col3.appendChild(inputSection);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);
  id("actions").appendChild(row);
  del.addEventListener("click", deleteAction);

}

function addBreak() {
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
  type.textContent = "Break";
  let inputSection = document.createElement("div");
  inputSection.classList.add("input-group", "input-group-sm", "mb-3");
  let del = document.createElement("button");
  del.type = "button";
  del.classList.add("btn-close");

  let inputTitle = document.createElement("span");
  inputTitle.classList.add("input-group-text");
  inputTitle.textContent = "After Passing";
  let inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("form-control");

  inputSection.appendChild(inputTitle);
  inputSection.appendChild(inputArea);
  col1.appendChild(stepNo);
  col2.appendChild(type);
  col3.appendChild(inputSection);
  col4.appendChild(del);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  row.appendChild(col4);
  id("actions").appendChild(row);
  del.addEventListener("click", deleteAction);

}

async function execute() {
  actions = [];
  document.querySelectorAll(".action").forEach(populate);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {request: "actions", actions: actions}, function(response) {
    console.log(response);
  });
}

async function save() {
  console.log("save not implemented");
}

function addMenuItem(evt) {
  chrome.contextMenus.update("clicker-select", {
    visible: true
  });
  evt.target.textContent = 'Selecting';
  buttons.push(evt.target);
}

function deleteAction(evt) {
  let action = evt.target;
  while (!action.classList.contains("action")) {
    action = action.parentElement;
  }
  action.remove();
  reorder();
}

/******** UI END *******/


/******** HELPER *******/

function id(i){
  return document.getElementById(i);
}

function qsa(i){
  return document.querySelectorAll(i);
}

function qs(i){
  return document.querySelector(i);
}

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
    let id = action.querySelector(".choose-target").textContent;
    actions.push({type: type, clickType: "id", id: id});
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
    let id = action.querySelector(".choose-target").textContent;
    let text = action.querySelector("input").value;
    actions.push({type: type, text: text, id: id});
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
/******** HELPER END *******/
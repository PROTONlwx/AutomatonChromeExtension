class Chain {
  constructor(actions) {
    this.actionChain = new Action("none", null, null);
    let prev = this.actionChain;
    for (let i = 0; i < actions.length; i++) {
      let curr = ActionFactory.objToAction(actions[i]);
      if (curr.type.valueOf() == "goto".valueOf()) {
        if (curr.gotoStep < 0 || curr.gotoStep >= i) {
          throw "goto invalid steps";
        }
        
        prev.next = curr;
        curr.prev = prev;
        curr.next = this.getIthAction(curr.gotoStep);
        break;
      }
      prev.next = curr;
      curr.prev = prev;
      prev = curr;
    }
  }

  executeChain() {
    this.actionChain.executeAction();
  }

  getObjRepresentation() {
    let arr = [];
    let curr = this.actionChain.next;
    while(curr != null) {
      arr.push(curr.getObjRepresentation);
    }
    return arr;
  }

  getIthAction(target) {
    let curr = this.actionChain.next;
    let i = 0;
    while(curr != null) {
      if (i === target) {
        return curr;
      }
      curr = curr.next;
      i++;
    }
    return null;
  }
}

class ActionFactory {
  static objToAction (obj) {
    if (obj.type.valueOf() == "click".valueOf()) {
      if (obj.clickType.valueOf() == "id".valueOf()) {
        return new IdClick(obj.id, null, null);
      } else if (obj.clickType.valueOf() == "match".valueOf()) {
        return new MatchClick(obj.id, obj.classList, null, null)
      }
    } else if (obj.type.valueOf() == "wait".valueOf()) {
      return new Wait(obj.time, null, null);
    } else if (obj.type.valueOf() == "goto".valueOf()) {
      return new Goto(obj.gotoStep, null, null);
    } else if (obj.type.valueOf() == "break".valueOf()) {
      return new Break(obj.pass, null, null);
    } else if (obj.type.valueOf() == "input".valueOf()) {
      return new TextInput(obj.id, obj.text, null, null);
    } else {
      throw "action type not recognized";
    }
  }
}

class Action {
  constructor(type, prev, next) {
    this.type = type;
    this.prev = prev;
    this.next = next;
  }

  executeAction() {
    console.log("executeAction not implemented: " + this.type);
    this.moveOn();
  }

  moveOn() {
    if (this.next) {
      this.next.executeAction();
    }
  }

  getObjRepresentation() {
    return {type: this.type}
  }
}

class Click extends Action {
  constructor(prev, next) {
    super("click", prev, next);
  }
}

class IdClick extends Click {
  constructor(id, prev, next) {
    super(prev, next);
    this.clickType = "id";
    this.id = id;
  }

  executeAction() {
    if (this.id != null) {
      document.getElementById(this.id).click();
    } else {
      throw "click action id = null";
    }
    this.moveOn();
  }

  
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.clickType = this.clickType;
    tmp.id = this.id;
    return tmp;
  }
}

class MatchClick extends Click {
  constructor(id, classList, prev, next) {
    super(prev, next);
    this.clickType = "match";
    this.id = id;
    this.classList = classList;
  }

  executeAction() {
    if (this.id != null) {
      document.getElementById(this.id).click();
    } else if (this.classList != null) {
      document.getElementsByClassName(this.classList).click();
    } else {
      throw "click action id and classlist are null";
    }
    this.moveOn();
  }

  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.clickType = this.clickType;
    tmp.id = this.id;
    tmp.classList = this.classList;
    return tmp;
  }
}

class Wait extends Action {
  constructor(time, prev, next) {
    super("wait", prev, next);
    this.time = time;
  }

  async executeAction() {
    await new Promise(r => setTimeout(r, this.time));
    this.moveOn();
  }

  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.time = this.time;
    return tmp;
  }
}

class Goto extends Action {
  constructor(gotoStep, prev, next) {
    super("goto", prev, next);
    this.gotoStep = gotoStep;
  }

  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.gotoStep = this.gotoStep;
    return tmp;
  }
}

class Break extends Action {
  constructor(pass, prev, next) {
    super("break", prev, next);
    this.pass = pass;
    this.remaining = pass;
  }

  executeAction() {
    if (this.remaining-- > 0)
      this.moveOn();
  }

  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.pass = this.pass;
    return tmp;
  }
}

class TextInput extends Action {
  constructor(id, text, prev, next) {
    super("input", prev, next);
    this.id = id;
    this.text = text;
  }

  executeAction() {
    if (this.id != null) {
      document.getElementById(this.id).value = this.text;
    } else {
      throw "input action id is null";
    }
    this.moveOn();
  }

  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.text = this.text;
    tmp.id = this.id;
    return tmp;
  }
}
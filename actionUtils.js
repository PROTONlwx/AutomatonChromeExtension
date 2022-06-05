/**
 * Chain represents a chain of actions.
 * This implementation uses linked-list-like structure.
 */
class Chain {
  /**
   * Create the chain from actions.
   *
   * @param {actions} The array of actions that defines the chain.
   * @throws "goto invalid steps" if goto action goes to action after it.
   */
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

  /**
   * Execute the chain.
   */
  async executeChain() {
    let currAction = this.actionChain;
    while (currAction != null) {
      await currAction.executeAction();
      currAction = currAction.next;
    }
  }

  /**
   * Reture the Chain converted to an array of objects.
   * @return {arr} Array of Action objects equivalent to this chain.
   */
  getObjRepresentation() {
    let arr = [];
    let curr = this.actionChain.next;
    while(curr != null) {
      arr.push(curr.getObjRepresentation);
    }
    return arr;
  }

  /**
   * Reture the i th action of this chain.
   * @return i th action. If i < 0 or i > chain length, return null.
   */
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

/**
 * Factory of action.
 */
class ActionFactory {
  /**
   * Create the action from object string.
   *
   * @param {obj} The object string representation of an action.
   * @return Action object defined by the string.
   */
  static objToAction (obj) {
    if (obj.type.valueOf() == "click".valueOf()) {
      return new Click(obj.id, obj.classList, null, null)
    } else if (obj.type.valueOf() == "wait".valueOf()) {
      return new Wait(obj.time, null, null);
    } else if (obj.type.valueOf() == "goto".valueOf()) {
      return new Goto(obj.gotoStep, null, null);
    } else if (obj.type.valueOf() == "break".valueOf()) {
      return new Break(obj.pass, null, null);
    } else if (obj.type.valueOf() == "input".valueOf()) {
      return new TextInput(obj.id, obj.classList, obj.text, null, null);
    } else {
      throw "action type not recognized";
    }
  }
}

/**
 * Individual Action object in the Chain.
 */
class Action {
  /**
   * Create the action from object string.
   *
   * @param {type} Type of this action e.g. click
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(type, prev, next) {
    this.type = type;
    this.prev = prev;
    this.next = next;
  }

  /**
   * Execute this action.
   */
  executeAction() {
    console.log("executeAction not implemented for type: " + this.type);
  }

  /**
   * Convert this action to the object(map) representation.
   * @return Object representation.
   */
  getObjRepresentation() {
    return {type: this.type}
  }
}

/**
 * Click, click something on page.
 */
class Click extends Action {
  /**
   * @param {id} id of element clicked
   * @param {classList} classList of element clicked
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(id, classList, prev, next) {
    super("click", prev, next);
    this.id = id;
    this.classList = classList;
  }

  /**
   * Execute this action.
   */
  executeAction() {
    if (document.getElementById(this.id)) {
      // use id if found.
      document.getElementById(this.id).click();
    } else if (this.classList != "") {
      // use class name if no id given.
      document.getElementsByClassName(this.classList)[0].click();
    } else {
      // no way to find element.
      throw "click action id and classlist are null";
    }
  }

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "click", classList: "xxx", id: "xxx"}
   */
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.classList = this.classList;
    tmp.id = this.id;
    return tmp;
  }
}

/**
 * Wait, Wait a while before continues.
 */
class Wait extends Action {
  /**
   * @param {time} Wait time in millisecond.
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(time, prev, next) {
    super("wait", prev, next);
    this.time = time;
  }

  /**
   * Sleep
   */
  async executeAction() {
    await new Promise(r => setTimeout(r, this.time));
  }

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "wait", time: n}
   */
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.time = this.time;
    return tmp;
  }
}

/**
 * Goto, go to another action.
 */
class Goto extends Action {
  /**
   * @param {gotoStep} step number to jump to
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(gotoStep, prev, next) {
    super("goto", prev, next);
    this.gotoStep = gotoStep;
  }

  /**
   * inherit dummy execution action
   */

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "goto", gotoStep: n}
   */
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.gotoStep = this.gotoStep;
    return tmp;
  }
}

/**
 * Break, break the execution chain if limit of pass exceeded.
 */
class Break extends Action {
  /**
   * @param {pass} number of passes allowed.
   * @param {remaining} number of passes so far.
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(pass, prev, next) {
    super("break", prev, next);
    this.pass = pass;
    this.remaining = pass;
  }

  /**
   * Exit if condition met.
   */
  executeAction() {
    if (this.remaining-- == 0) {
      this.next = null;
    }
  }

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "break", pass: n}
   */
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.pass = this.pass;
    return tmp;
  }
}

/**
 * TextInput, input text to the target element
 */
class TextInput extends Action {
  /**
   * @param {id} id of element to input
   * @param {classList} classList of element to input
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(id,classList, text, prev, next) {
    super("input", prev, next);
    this.id = id;
    this.classList = classList;
    this.text = text;
  }

  /**
   * Input into the element.
   */
  executeAction() {
    let area;
    if (document.getElementById(this.id)) {
      // use id if possible
      area = document.getElementById(this.id);
    } else if (this.classList != "") {
      // use class name if no id provided
      area = document.getElementsByClassName(this.classList)[0];
    } else {
      // no way to find element
      throw "click action id and classlist are null";
    }
    if (area.value != undefined) {
      // change value if field exists.
      area.value = this.text;
    } else {
      // change innertext if no value field.
      area.innerText = this.text;
    }
  }

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "input", text: "xxx", id: "xxx", classList: "xxx"}
   */
  getObjRepresentation() {
    let tmp = super.getObjRepresentation();
    tmp.text = this.text;
    tmp.classList = this.classList;
    tmp.id = this.id;
    return tmp;
  }
}
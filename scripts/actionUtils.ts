type ActionObj = {
  type: string
};
type ClickObj = ActionObj & { id: string, classList: string }
type WaitObj = ActionObj & { time: number }
type GotoObj = ActionObj & { gotoStep: number }
type BreakObj = ActionObj & { pass: number }
type TextInputObj = ActionObj & { id: string, classList: string, text: string }
type ActionSet = ClickObj | TextInputObj | WaitObj | GotoObj | BreakObj


/**
 * Chain represents a chain of actions.
 * This implementation uses linked-list-like structure.
 */
class Chain {
  actionChain: Action;
  /**
   * Create the chain from actions.
   *
   * @param {actions} The array of actions that defines the chain.
   * @throws "goto invalid steps" if goto action goes to action after it.
   */
  constructor(actions: Array<ActionSet>) {
    this.actionChain = new Action("none", null, null);
    let prev = this.actionChain;
    for (let i = 0; i < actions.length; i++) {
      let curr: Action = ActionFactory.objToAction(actions[i]);
      if (curr.type.valueOf() == "goto".valueOf()) {
        if ((curr as Goto).gotoStep < 0 || (curr as Goto).gotoStep >= i) {
          throw "goto invalid steps";
        }
        
        prev.next = curr;
        curr.prev = prev;
        curr.next = this.getIthAction((curr as Goto).gotoStep);
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
    let currAction: Action | null = this.actionChain;
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
    let arr: Array<ActionSet> = [];
    let curr = this.actionChain.next;
    while(curr != null) {
      arr.push(curr.getObjRepresentation() as ActionSet);
    }
    return arr;
  }

  /**
   * Reture the i th action of this chain.
   * @return i th action. If i < 0 or i > chain length, return null.
   */
  getIthAction(target: number) {
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
  static objToAction (obj: ActionSet) {
    if ("id" in obj && "classList" in obj && !("text" in obj)) {
      return new Click(obj.id, obj.classList, null, null)
    } else if ("time" in obj) {
      return new Wait(obj.time, null, null);
    } else if ("gotoStep" in obj) {
      return new Goto(obj.gotoStep, null, null);
    } else if ("pass" in obj) {
      return new Break(obj.pass, null, null);
    } else if ("id" in obj && "classList" in obj && "text" in obj) {
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
  type: string;
  prev: Action | null;
  next: Action | null;

  /**
   * Create the action from object string.
   *
   * @param {type} Type of this action e.g. click
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(type: string, prev: Action | null, next: Action | null) {
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
  id: string
  classList: string
  /**
   * @param {id} id of element clicked
   * @param {classList} classList of element clicked
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(id: string, classList: string, prev: Action | null, next: Action | null) {
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
      document.getElementById(this.id)?.click();
    } else if (this.classList != "") {
      // use class name if no id given.
      let tmp = document.getElementsByClassName(this.classList)[0];
      if (tmp instanceof HTMLElement)
        tmp.click();
      else
        console.error("Cannot click on selected element.");
    } else {
      // no way to find element.
      throw "click action id and classlist are null";
    }
  }

  /**
   * Convert this action to the object(map) representation.
   * @return {Object} {type: "click", classList: "xxx", id: "xxx"}
   */
  getObjRepresentation(): ClickObj {
    let tmp: ClickObj = { 
      type: super.getObjRepresentation().type,
      classList: this.classList,
      id: this.id
    }
    return tmp;
  }
}

/**
 * Wait, Wait a while before continues.
 */
class Wait extends Action {
  time: number
  /**
   * @param {time} Wait time in millisecond.
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(time: number, prev: Action | null, next: Action | null) {
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
  getObjRepresentation(): WaitObj {
    let tmp = {
      type: super.getObjRepresentation().type,
      time: this.time
    }
    return tmp;
  }
}

/**
 * Goto, go to another action.
 */
class Goto extends Action {
  gotoStep: number;
  /**
   * @param {gotoStep} step number to jump to
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(gotoStep: number, prev: Action | null, next: Action | null) {
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
  getObjRepresentation(): GotoObj {
    let tmp = {
      type: super.getObjRepresentation().type,
      gotoStep: this.gotoStep
    }
    return tmp;
  }
}

/**
 * Break, break the execution chain if limit of pass exceeded.
 */
class Break extends Action {
  pass: number
  remaining: number
  /**
   * @param {pass} number of passes allowed.
   * @param {remaining} number of passes so far.
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(pass: number, prev: Action | null, next: Action | null) {
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
  getObjRepresentation(): BreakObj {
    let tmp = {
      type: super.getObjRepresentation().type,
      pass: this.pass
    }
    return tmp;
  }
}

/**
 * TextInput, input text to the target element
 */
class TextInput extends Action {
  id: string;
  classList: string
  text: string
  /**
   * @param {id} id of element to input
   * @param {classList} classList of element to input
   * @param {prev} Reference to previous action in the chain.
   * @param {next} Reference to next action in the chain.
   */
  constructor(id: string, classList: string, text: string, prev: Action | null, next: Action | null) {
    super("input", prev, next);
    this.id = id;
    this.classList = classList;
    this.text = text;
  }

  /**
   * Input into the element.
   */
  executeAction() {
    let area: any;
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
    if (area.value !== undefined) {
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
  getObjRepresentation(): TextInputObj {
    let tmp = {
      type: super.getObjRepresentation().type,
      text: this.text,
      classList: this.classList,
      id: this.id,
    }
    return tmp;
  }
}

export {Chain, ActionSet, ClickObj, TextInputObj, WaitObj, GotoObj, BreakObj}
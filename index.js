const lookup = require("cli-dispatch").lookup;
const EventEmitter = require("events").EventEmitter;
const util = require("util");

function SubcommandDispatcher() {
  EventEmitter.call(this);
}

util.inherits(SubcommandDispatcher, EventEmitter);

/**
 * @param {string} dir The directory to look up the actions
 * @param {object} actionDefinition The action definition
 * @param {object} [options] The options
 * @param {Function} callback The callback of launch
 * @return {Minirocket}
 */
module.exports = (dir, actionDefinition, options, callback) => {
  if (typeof dir !== "string") {
    throw new Error(`dir needs to be a string: ${typeof dir} is given`);
  }
  if (typeof options === "function" && callback == null) {
    callback = options;
    options = {};
  }

  options = options || {};

  const dispatcher = new SubcommandDispatcher();

  if (typeof actionDefinition !== "object") {
    throw new Error("actionDefinition have to be an object");
  }

  const action =
    Object.keys(actionDefinition).filter((key) => actionDefinition[key])[0];

  if (!action) {
    throw new Error("No action is available: " + Object.keys(actionDefinition));
  }

  const actionFunc = lookup(action, {
    actions: options.actions,
    base: dir,
  });

  console.log("callback", callback);

  setTimeout(() =>
    actionFunc ? callback(actionFunc) : dispatcher.emit("no-action", action)
  );

  return dispatcher;
};

Hooks.once("ready", () => {
  if (!(game.modules.has("betterrolls5e") && game.modules.get("betterrolls5e").active)) {
    Hooks.on("preCreateChatMessage", (msg) => {
      if (msg.roll && game.settings.get("talespire-dice", "rollFoundry") !== 1) {
        const flavor = msg.flavor ? parseFlavorText(msg.flavor) : "dice";
        const formula = parseRollFormula(JSON.parse(msg.roll).formula);
        if (formula == "crit") {
          ui.notifications.error("Talespire currently doesn't support multiplication to calculate critical hits. Please roll damage normally then double it.");
          return false;
        }
        if (formula == "nodice") {
          console.log("No dice roll found.");
        }
        else {
          window.open("talespire://dice/" + flavor + ":" + formula);
          if (game.settings.get("talespire-dice", "rollFoundry") == 0) {
            return false;
          }
        }
      }
      else {
        console.log("No dice roll found.");
      }
    });
  }
  else {
    ui.notifications.error("Talespire Dice Relay is not compatible with BetterRolls5e.");
  }
});

Hooks.once("init", () => {
  game.settings.register("talespire-dice", "rollFoundry", {
    name: "Where to roll dice:",
    scope: "client",
    config: true,
    default: 2,
    type: Number,
    choices: {
      0: "Talespire",
      1: "Foundry",
      2: "Both"
    }
  });
});

function parseFlavorText(flavor) {
  if (flavor.indexOf("<") > -1) {
    flavor = flavor.match(/>(.+?)</)[1];
    flavor = flavor.replace(/:/g, "");
  }
  return encodeURI(flavor);
}

function parseRollFormula(formula) {
  if (formula.indexOf("*") > -1) {
    return "crit";
  }
  if (!formula.match(/\d*d\d+/)) {
    return "nodice";
  }
  if (formula.indexOf("2d20k") > -1) {
    formula = formula.replace(/^2/, "1");
    formula = addMods(formula);
    return formula + "/" + formula;
  }
  return addMods(formula);
}

function addMods(formula) {
  formula = formula.replace(/[,]/g, "+");
  formula = formula.replace(/[{} ]/g, "");
  const dice = Array.from(formula.matchAll(/(\d*d\d+)/g), i => i[0]);
  const mods = Array.from(formula.matchAll(/([+-]\d+)(?!d)/g), i => i[0]).reduce((a, b) => a + parseInt(b), 0);
  return dice.join("+") + (mods >= 0 ? "+" : "") + mods;
}

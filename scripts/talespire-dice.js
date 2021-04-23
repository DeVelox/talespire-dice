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

Hooks.on("preCreateChatMessage", (msg) => {
  if (msg.roll && game.settings.get("talespire-dice", "rollFoundry") !== 1) {
    let flavor = msg.flavor ? parseFlavorText(msg.flavor) : "dice";
    let formula = parseRollFormula(JSON.parse(msg.roll).formula);
    if (formula.indexOf("*") > -1) {
      ChatMessage.create({ content: "<strong>Talespire currently doesn't support multiplication to calculate critical hits. <br> Please roll damage normally and double it.</strong>" });
      return false;
    }
    window.open("talespire://dice/" + flavor + ":" + formula)
    if (game.settings.get("talespire-dice", "rollFoundry") == 0) {
      return false;
    }
  }
  else {
    console.log("No dice roll found.");
  }
});

function parseFlavorText(flavor) {
  if (flavor.indexOf("<") > -1) {
    flavor = flavor.match(">(.+?)<")[1];
    flavor = flavor.replace(/:/g, "");
  }
  return encodeURI(flavor);
}

function parseRollFormula(formula) {
  if (formula.indexOf("2d20k") > -1) {
    formula = formula.replace(/^2/, "1");
    formula = formula + "/" + formula;
  }
  formula = formula.replace(/[{} ]/g, "");
  formula = formula.replace(/[dk][hl]/g, "");
  return formula;
}
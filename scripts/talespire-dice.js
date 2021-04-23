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
    let flavor = parseFlavorText(msg.flavor);
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
    flavor = $(flavor).text().match("^[^:]*");
  }
  return encodeURI(flavor);
}

function parseRollFormula(formula) {
  formula = formula.replace(/[{} ]/g, "");
  if (formula.indexOf("k") > -1) {
    formula = formula.replace(/k[hl]/g, "");
    formula = formula.replace(/^2/, "1");
    formula = formula + "/" + formula;
  }
  return formula;
}
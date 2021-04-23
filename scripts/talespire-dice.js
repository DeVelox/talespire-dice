Hooks.on("createChatMessage", (data) => {
  data._roll ? window.open("talespire://dice/" + encodeURI(data.data.flavor) + ":" +
    data._roll._formula.replace(/ /g, "")) :
    console.log("No dice roll found.");
});
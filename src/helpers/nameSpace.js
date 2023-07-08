// Initialize the window.GAME namespace
const init = () => {
  window.GAME = {};
  window.GAME.shipLocations = {};
  window.GAME.placement = "normal";
  window.GAME.difficulty = "medium";
  window.GAME.currentMode = "H";
};

export default init;

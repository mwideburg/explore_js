import "./styles/index.scss";

import canvasExample from "./scripts/canvas";

const currentStateObj = {
  currentExample: null,
  currentEventListeners: [],
};

document.querySelector("#canvas-demo").addEventListener("click", startCanvas);


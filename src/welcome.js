import "./styles/welcome.css";
import "./styles/animations.css";
import Image from "./assets/Illustration.png";

document.querySelector(".preview").children[0].src = Image;

document.querySelector(".play").children[0].addEventListener("click", () => {
  window.location.href = "./game.html";
});

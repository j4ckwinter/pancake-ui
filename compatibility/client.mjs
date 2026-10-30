import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App.mjs";
import "pancake-ui/styles.css";
import "pancake-ui/fonts.css";

window.serverIds = [...document.querySelectorAll("[id]")].map(
  (element) => element.id,
);
window.serverRadioNames = [
  ...document.querySelectorAll('input[type="radio"]'),
].map((element) => element.name);
hydrateRoot(document.getElementById("root"), createElement(App), {
  identifierPrefix: "compatibility-",
  onRecoverableError(error) {
    console.error("Hydration recovered from an error:", error);
  },
});

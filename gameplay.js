"use strict";

const gridContainer = document.querySelector(".grid-container");

for (let i = 1; i <= 90; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell", "md:text-xl", "lg:text-3xl", "text-sm");
  cell.innerHTML = i;

  gridContainer.appendChild(cell);
}

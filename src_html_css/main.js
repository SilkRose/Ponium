function onloadFunction() {
  const newP = document.createElement("p");
  newP.innerHTML = "This is a new paragraph";
  document.getElementById("game_content").appendChild(newP);
}

window.onload = onloadFunction;

function addRandomText() {
  const newP1 = document.createElement("p");

  const randomNum = Math.floor(Math.random() * 100) + 1;

  newP1.innerHTML = "Random Number: " + randomNum;

  const gameContent = document.getElementById("game_content");
  gameContent.appendChild(newP1);
  window.scrollBy(100, 100);
}

setInterval(addRandomText, 200);

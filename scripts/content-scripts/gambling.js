function spinRoulette(choice) {
    console.log('im ded')
  const result = Math.random() < 0.5 ? "red" : "black";
  const rouletteDiv = document.getElementById("roulette");
  rouletteDiv.innerText = "Spinning...";
  setTimeout(() => {
    rouletteDiv.innerText = `Result: ${result}`;
    if (result === choice) {
      showConfetti();
    } else {
      showDirt();
    }
  }, 3000); // Spin for 3 seconds
}

function showConfetti() {
  const confettiDiv = document.createElement("div");
  confettiDiv.style.position = "fixed";
  confettiDiv.style.top = "0";
  confettiDiv.style.left = "0";
  confettiDiv.style.width = "100%";
  confettiDiv.style.height = "100%";
  confettiDiv.style.pointerEvents = "none";
confettiDiv.style.backgroundImage = "url('https://www.gifcen.com/wp-content/uploads/2022/06/confetti-gif-2.gif')";
confettiDiv.style.opacity = "0.5";
  confettiDiv.style.backgroundSize = "cover";
  confettiDiv.style.zIndex = "10001";
  document.body.appendChild(confettiDiv);

  setTimeout(() => {
    document.body.removeChild(confettiDiv);
  }, 5000); // Show confetti for 5 seconds
}

function showDirt() {
  const dirtDiv = document.createElement("div");
  dirtDiv.style.position = "fixed";
  dirtDiv.style.top = "0";
  dirtDiv.style.left = "0";
  dirtDiv.style.width = "100%";
  dirtDiv.style.height = "100%";
  dirtDiv.style.pointerEvents = "none";
  dirtDiv.style.backgroundImage = "url('https://i.pinimg.com/originals/65/f0/34/65f03496d445c588bf54bca86711c4d2.gif')";
  confettiDiv.style.opacity = "0.5";
  dirtDiv.style.backgroundSize = "cover";
  dirtDiv.style.zIndex = "10001";
  document.body.appendChild(dirtDiv);

  setTimeout(() => {
    document.body.removeChild(dirtDiv);
  }, 5000); // Show dirt for 5 seconds
}

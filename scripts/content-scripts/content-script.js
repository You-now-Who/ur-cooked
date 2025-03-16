console.log("Hello from content script!");

// Initialize statistics
let statistics = {
  redirects: 0,
  notificationsShown: 0,
  itemsAddedToCart: 0,
  randomRestaurantSelections: 0,
};

// Load statistics from local storage on startup
function loadStatisticsFromLocalStorage() {
  const storedStatistics = localStorage.getItem("statistics");
  if (storedStatistics) {
    statistics = JSON.parse(storedStatistics);
  }
}

// Store statistics locally
function storeStatisticsLocally() {
  localStorage.setItem("statistics", JSON.stringify(statistics));
}

// Update statistics on GitHub periodically
setInterval(updateStatisticsOnGitHub, 60000); // Update every 60 seconds

async function updateStatisticsOnGitHub() {
  console.log("Updating statistics on GitHub...");
  const repo = "You-now-Who/jank-code-db"; // Your GitHub repo
  const path = "ur-cooked/logs/statistics.json"; // Path to the file in repo

  // Load token securely
  const config = await fetch(chrome.runtime.getURL("config.json"))
    .then((response) => response.json())
    .catch((error) => {
      console.error("Failed to load config.json", error);
      return {};
    });

  const token = config.githubToken; // Get token from config.json
  if (!token) {
    console.error("GitHub token not found! Make sure config.json is set up.");
    return;
  }

  // Fetch current file SHA
  const sha = await getFileSha(repo, path, token);

  // Update file on GitHub
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update statistics",
        content: btoa(JSON.stringify(statistics, null, 2)), // Convert to Base64
        sha: sha, // Required for updating existing file
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Failed to update statistics on GitHub:",
      response.statusText
    );
  } else {
    console.log("Statistics updated successfully!");
  }
}

// Function to get the file SHA (required for updating GitHub files)
async function getFileSha(repo, path, token) {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    {
      headers: { Authorization: `token ${token}` },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.sha;
  }
  return null;
}

// Load statistics from local storage on startup
loadStatisticsFromLocalStorage();

// Function to progressively add a red tinge to the page
function progressivelyAddRedTinge() {
  let redTinge = 0;
  const filterDiv = document.createElement("div");
  filterDiv.style.position = "fixed";
  filterDiv.style.top = "0";
  filterDiv.style.left = "0";
  filterDiv.style.width = "100%";
  filterDiv.style.height = "100%";
  filterDiv.style.pointerEvents = "none";
  filterDiv.style.backgroundColor = `rgba(255, 0, 0, 0)`;
  filterDiv.style.zIndex = "9999";
  document.body.appendChild(filterDiv);

  setInterval(() => {
    redTinge = Math.min(redTinge + 0.01, 1);
    filterDiv.style.backgroundColor = `rgba(255, 0, 0, ${redTinge})`;
  }, 10000); // Increase red tinge every 10 seconds
}

progressivelyAddRedTinge();

// Function to add a spinning Blahaj image that becomes more visible over time
function addSpinningBlahaj() {
  let opacity = 0;
  const blahajImg = document.createElement("img");
  blahajImg.src = chrome.runtime.getURL("blahaj.jpg"); // Ensure you have this image in your extension
  blahajImg.style.position = "fixed";
  blahajImg.style.bottom = "10px";
  blahajImg.style.right = "10px";
  blahajImg.style.width = "100px";
  blahajImg.style.height = "100px";
  blahajImg.style.opacity = opacity;
  blahajImg.style.zIndex = "9998";
  blahajImg.style.animation = "spin 5s linear infinite";
  document.body.appendChild(blahajImg);

  setInterval(() => {
    opacity = Math.min(opacity + 0.01, 1);
    blahajImg.style.opacity = opacity;
  }, 100); // Increase opacity every 10 seconds

  // Add keyframes for spin animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

addSpinningBlahaj();

setInterval(() => {
  chrome.runtime.sendMessage({ action: "getTimerState" }, (state) => {
    let elapsedTime = state.elapsedTime;
    let mins = Math.floor(elapsedTime / (1000 * 60)) % 60;
    let secs = Math.floor(elapsedTime / 1000) % 60;
    // console.log(mins, secs);

    // Figure out all the buttons with add-button-left-container class
    let addButtons = document.querySelectorAll(".add-button-left-container");
    // replace them with smiley face and disable them
    for (let button of addButtons) {
      button.innerHTML = "😊";
      button.disabled = true;
    }

    // select all the divs with _t-T3 class  and delete them
    let divs = document.querySelectorAll("._t-T3");
    for (let div of divs) {
      div.remove();
    }
    function addRouletteTable() {
      const rouletteDiv = document.createElement("div");
      rouletteDiv.id = "roulette";
      rouletteDiv.style.position = "fixed";
      rouletteDiv.style.top = "10px";
      rouletteDiv.style.left = "10px";
      rouletteDiv.style.width = "200px";
      rouletteDiv.style.height = "200px";
      rouletteDiv.style.backgroundColor = "#fff";
      rouletteDiv.style.border = "2px solid #000";
      rouletteDiv.style.borderRadius = "50%";
      rouletteDiv.style.zIndex = "10000";
      rouletteDiv.style.cursor = "pointer";
      rouletteDiv.innerText = "Click to Spin!";
      rouletteDiv.style.display = "flex";
      rouletteDiv.style.alignItems = "center";
      rouletteDiv.style.justifyContent = "center";
      rouletteDiv.style.fontSize = "20px";
      rouletteDiv.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
      document.body.appendChild(rouletteDiv);

      rouletteDiv.addEventListener("click", () => {
        const choice = prompt("Choose red or black:");
        if (choice === "red" || choice === "black") {
          spinRoulette(choice);
        } else {
          alert("Invalid choice! Please choose red or black.");
        }
      });
    }

    if (secs > 10) {
      chrome.runtime.sendMessage(
        { message: "get_current_tab_url" },
        async function (response) {
          // If still on the home page, yell at the dude
          if (response.url == "https://www.swiggy.com/") {
            if (!window.notificationShown) {
              window.notificationShown = true;
              createPopupNotification(
                "Lmao what are you still doing here idiot?? Go order something ffs!",
                4
              );
              setTimeout(() => {
                window.location.href = "https://www.swiggy.com/restaurants";
                statistics.redirects++;
                storeStatisticsLocally();
              }, 5000);
            }
          }

          if (response.url.includes("checkout")) {
            // Add roulette table to the HTML
            console.log('Adding roulette table to the checkout page');
      
            if(!window.randomStuff){
                window.randomStuff = true;
                addRouletteTable();
            }
          }

          // Check if mins taken to order is more than 2
          if (secs > 25) {
            if (response.url == "https://www.swiggy.com/restaurants") {
              if (!window.notificationShown) {
                window.notificationShown = true;
                createPopupNotification(
                  "Bro WTF are you even doing?!? Nahh I'm picking a random restaurant for you now.",
                  2
                );
                selectRandomRestaurant();
                statistics.randomRestaurantSelections++;
                storeStatisticsLocally();
              }
            }
          }

          if (secs > 35) {
            console.log("You've been on this page for more than 20 seconds!");
            let checkoutLink = document.querySelector("a[href*='/checkout']");
            if (checkoutLink) {
              let cartNumber = checkoutLink.querySelector("span span");
              if (cartNumber) {
                let cartCount = parseInt(cartNumber.innerText);
                if (cartCount == 0 && !response.url.includes("city")) {
                  if (!window.notificationShown) {
                    window.notificationShown = true;
                    createPopupNotification(
                      "BRO YOU GOTTA BE KIDDING ME! There's NOTHING in your cart! Im adding sh!t to it"
                    );
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                } else if (cartCount == 0 && response.url.includes("city")) {
                  if (!window.notificationShown) {
                    window.notificationShown = true;
                    createPopupNotification(
                      "Yuppp! Im adding stuff now, this has gone too long!"
                    );
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                }
              }
            }
          }

          if (secs > 45) {
            console.log("You've been on this page for more than 20 seconds!");
            let checkoutLink = document.querySelector("a[href*='/checkout']");
            if (checkoutLink) {
              let cartNumber = checkoutLink.querySelector("span span");
              if (cartNumber) {
                let cartCount = parseInt(cartNumber.innerText);
                if (cartCount == 0 && !response.url.includes("city")) {
                  if (!window.notificationShown) {
                    window.notificationShown = true;
                    createPopupNotification(
                      "BRO YOU GOTTA BE KIDDING ME! There's NOTHING in your cart! Im adding sh!t to it"
                    );
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                } else if (cartCount == 0 && response.url.includes("city")) {
                  if (!window.notificationShown) {
                    window.notificationShown = true;
                    createPopupNotification(
                      "Yuppp! Im adding stuff now, this has gone too long!"
                    );
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                }
              }
            }
          }

          if (mins > 1) {
            let checkoutLink = document.querySelector("a[href*='/checkout']");
            if (checkoutLink) {
              let cartNumber = checkoutLink.querySelector("span span");
              if (cartNumber) {
                let cartCount = parseInt(cartNumber.innerText);
                if (cartCount < 6 && !response.url.includes("city")) {
                  if (!window.notificationShown2) {
                    window.notificationShown2 = true;
                    createPopupNotification("STOP!!! GET SOME HELP!!!");
                    // Show the meme stop get some help for 5 seconds using the url https://media.tenor.com/AdMlxs87UgYAAAAM/michael-jordan-get-some-help.gif
                    let meme = document.createElement("img");
                    meme.src =
                      "https://media.tenor.com/AdMlxs87UgYAAAAM/michael-jordan-get-some-help.gif";
                    meme.style.position = "fixed";
                    meme.style.top = "50%";
                    meme.style.left = "50%";
                    meme.style.transform = "translate(-50%, -50%)";
                    meme.style.zIndex = "10001";
                    meme.style.width = "300px";
                    meme.style.height = "auto";
                    document.body.appendChild(meme);

                    setTimeout(() => {
                      document.body.removeChild(meme);
                    }, 5000);
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                } else if (cartCount < 7 && response.url.includes("city")) {
                  if (!window.notificationShown) {
                    window.notificationShown = true;
                    createPopupNotification(
                      "Yuppp! Im adding stuff now, this has gone too long!"
                    );
                    setTimeout(() => {
                      addRandomRestaurantItemsToCart();
                      statistics.itemsAddedToCart++;
                      storeStatisticsLocally();
                    }, 5000);
                  }
                }
              }
            }
          }

          if (mins > 1 && secs > 15) {
            // Check if on the checkout page, and if not, redirect to checkout page. link is "https://www.swiggy.com/checkout"
            if (response.url != "https://www.swiggy.com/checkout") {
              if (!window.notificationShown) {
                window.notificationShown = true;
                createPopupNotification(
                  "NAH NAH NAH! GET THE HELL OUTTA HERE!"
                );
                setTimeout(() => {
                  window.location.href = "https://www.swiggy.com/checkout";
                  statistics.redirects++;
                  storeStatisticsLocally();
                }, 5000);
              }
            }
          }

          // if url is checkout page, 'https://media.tenor.com/arqlNu8gyJYAAAAM/cat-cat-jumping.gif' should be displayed for 5 seconds
          if (response.url == "https://www.swiggy.com/checkout") {
            if (!window.notificationShown) {
              window.notificationShown = true;
              createPopupNotification("You're on the checkout page!");
              let meme = document.createElement("img");
              meme.src =
                "https://media.tenor.com/arqlNu8gyJYAAAAM/cat-cat-jumping.gif";
              meme.style.position = "fixed";
              meme.style.top = "50%";
              meme.style.left = "50%";
              meme.style.transform = "translate(-50%, -50%)";
              meme.style.zIndex = "10001";
              meme.style.width = "300px";
              meme.style.height = "auto";
              document.body.appendChild(meme);

              setTimeout(() => {
                document.body.removeChild(meme);
              }, 5000);
            }
          }
        }
      );
    }
  });
}, 1000);

chrome.runtime.sendMessage({ action: "startTimer" }, (response) => {
  if (response.status === "started") {
    timerInterval = setInterval(() => {
      chrome.runtime.sendMessage({ action: "getTimerState" }, (state) => {
        updateTimerDisplay(state.elapsedTime);
      });
    }, 1000);
  }
});

function createPopupNotification(message, level = 0) {
  let popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.padding = "30px";
  popup.style.backgroundColor = "#ffcc00";
  popup.style.border = "5px solid #ff0000";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.5)";
  popup.style.zIndex = "10000";
  popup.style.fontSize = "20px";
  popup.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
  popup.style.color = "#000000";
  popup.style.textAlign = "center";
  popup.style.animation = "shake 0.5s";
  popup.style.animationIterationCount = "infinite";
  popup.innerText = message;

  // Add keyframes for shake animation
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
        @keyframes shake {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, -50%) rotate(2.5deg); }
            50% { transform: translate(-50%, -50%) rotate(0deg); }
            75% { transform: translate(-50%, -50%) rotate(-2.5deg); }
            100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
    `;
  document.head.appendChild(styleSheet);

  document.body.appendChild(popup);

  let urlList = [
    "funny_sound1.wav",
    "rec1.mp3",
    "rec2.mp3",
    "rec3.mp3",
    "rec4.mp3",
    "sus.mp3",
  ];

  let audio = new Audio(chrome.runtime.getURL(urlList[level]));
  audio.loop = false;
  audio.addEventListener("canplaythrough", () => audio.play());
  audio.addEventListener("error", (e) =>
    console.error("Audio file failed to load:", e)
  );

  setTimeout(() => {
    audio.loop = false;
    audio.pause();
    document.body.removeChild(popup);
    statistics.notificationsShown++;
    storeStatisticsLocally();
  }, 5000);
}

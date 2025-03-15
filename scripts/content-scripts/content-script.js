console.log("Hello from content script!");

// How to get the URL of the current tab

// Function to log statistics
function logStatistics(stat) {
  chrome.runtime.sendMessage({ action: "logStatistics", stat: stat });
}

// Get the current time
setInterval(() => {
  chrome.runtime.sendMessage({ action: "getTimerState" }, (state) => {
    let elapsedTime = state.elapsedTime;
    let mins = Math.floor(elapsedTime / (1000 * 60)) % 60;
    let secs = Math.floor(elapsedTime / 1000) % 60;
    // console.log(mins, secs);

    if (secs > 1) {
      chrome.runtime.sendMessage(
        { message: "get_current_tab_url" },
        async function (response) {
          // If still on the home page, yell at the dude
          if (response.url == "https://www.swiggy.com/") {
            if (!window.notificationShown) {
              window.notificationShown = true;
              createPopupNotification(
                "Lmao what are you still doing here idiot?? Go order something ffs!"
              );
              logStatistics("redirected_from_homepage");
              setTimeout(() => {
                window.location.href = "https://www.swiggy.com/restaurants";
              }, 5000);
            }
          }

          // Check if mins taken to order is more than 2
          if (secs > 5) {
            if (response.url == "https://www.swiggy.com/restaurants") {
              if (!window.notificationShown) {
                window.notificationShown = true;
                createPopupNotification(
                  "Bro WTF are you even doing?!? Nahh I'm picking a random restaurant for you now."
                );
                logStatistics("random_restaurant_selected");
                selectRandomRestaurant();
              }
            }
          }

          if (secs > 3) {
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
                          logStatistics("items_added_to_cart");
                          setTimeout(() => {
                            addRandomRestaurantItemsToCart();
                          }, 5000);
                        }
                  }
                  else if (cartCount==0 && response.url.includes("city")) {
                    if (!window.notificationShown) {
                      window.notificationShown = true;
                      createPopupNotification(
                        "Yuppp! Im adding stuff now, this has gone too long!"
                      );
                      logStatistics("items_added_to_cart");
                      setTimeout(() => {
                        addRandomRestaurantItemsToCart();
                      }, 5000);
                    }
                  }
                      
              }
            }
          }

          if (secs > 6) {
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
                          logStatistics("items_added_to_cart");
                          setTimeout(() => {
                            addRandomRestaurantItemsToCart();
                          }, 5000);
                        }
                  }
                  else if (cartCount==0 && response.url.includes("city")) {
                    if (!window.notificationShown) {
                      window.notificationShown = true;
                      createPopupNotification(
                        "Yuppp! Im adding stuff now, this has gone too long!"
                      );
                      logStatistics("items_added_to_cart");
                      setTimeout(() => {
                        addRandomRestaurantItemsToCart();
                      }, 5000);
                    }
                  }
                      
              }
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

function createPopupNotification(message) {
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

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 5000);
}

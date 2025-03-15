
console.log("Hello from content script!");

// How to get the URL of the current tab
chrome.runtime.sendMessage({ message: "get_current_tab_url" }, function (response) {
  console.log(response.url);

  // Check if the URL is just the base URL
    if (response.url === "https://www.swiggy.com/") {
        console.log("This is the base URL");
        window.location.href = "https://www.swiggy.com/restaurants";
        alert("Bro what's taking you so LOOOOOONG?");
        // Redirect to the /restaurants page
        

    }
});

let timerElement = document.createElement('div');
timerElement.style.position = 'fixed';
timerElement.style.top = '10px';
timerElement.style.right = '10px';
timerElement.style.backgroundColor = 'white';
timerElement.style.border = '1px solid black';
timerElement.style.padding = '10px';
timerElement.style.zIndex = '10000';
document.body.appendChild(timerElement);

let startButton = document.createElement('button');
startButton.innerText = 'Start';
timerElement.appendChild(startButton);

let stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
timerElement.appendChild(stopButton);

let resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
timerElement.appendChild(resetButton);

let timerDisplay = document.createElement('div');
timerElement.appendChild(timerDisplay);

let timerInterval;

function updateTimerDisplay(elapsedTime) {
    let seconds = Math.floor(elapsedTime / 1000) % 60;
    let minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    timerDisplay.innerText = `${hours}:${minutes}:${seconds}`;
}

startButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startTimer' }, (response) => {
        if (response.status === 'started') {
            timerInterval = setInterval(() => {
                chrome.runtime.sendMessage({ action: 'getTimerState' }, (state) => {
                    updateTimerDisplay(state.elapsedTime);
                });
            }, 1000);
        }
    });
});

stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopTimer' }, (response) => {
        if (response.status === 'stopped') {
            clearInterval(timerInterval);
        }
    });
});

resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetTimer' }, (response) => {
        if (response.status === 'reset') {
            clearInterval(timerInterval);
            updateTimerDisplay(0);
        }
    });
});

// Initialize timer display
chrome.runtime.sendMessage({ action: 'getTimerState' }, (state) => {
    updateTimerDisplay(state.elapsedTime);
    if (state.running) {
        timerInterval = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'getTimerState' }, (state) => {
                updateTimerDisplay(state.elapsedTime);
            });
        }, 1000);
    }
});
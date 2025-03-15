
let timerElement = document.createElement('div');
timerElement.style.position = 'fixed';
timerElement.style.top = '200px';
timerElement.style.right = '10px';
timerElement.style.backgroundColor = '#f9f9f9';
timerElement.style.border = '1px solid #ccc';
timerElement.style.borderRadius = '8px';
timerElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
timerElement.style.padding = '15px';
timerElement.style.zIndex = '10000';
timerElement.style.fontFamily = 'Arial, sans-serif';
timerElement.style.color = '#333';
document.body.appendChild(timerElement);

let startButton = document.createElement('button');
startButton.innerText = 'Start';
startButton.style.margin = '5px';
startButton.style.padding = '10px 20px';
startButton.style.backgroundColor = '#4CAF50';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.cursor = 'pointer';
timerElement.appendChild(startButton);

let stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
stopButton.style.margin = '5px';
stopButton.style.padding = '10px 20px';
stopButton.style.backgroundColor = '#f44336';
stopButton.style.color = 'white';
stopButton.style.border = 'none';
stopButton.style.borderRadius = '5px';
stopButton.style.cursor = 'pointer';
timerElement.appendChild(stopButton);

let resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.style.margin = '5px';
resetButton.style.padding = '10px 20px';
resetButton.style.backgroundColor = '#008CBA';
resetButton.style.color = 'white';
resetButton.style.border = 'none';
resetButton.style.borderRadius = '5px';
resetButton.style.cursor = 'pointer';
// timerElement.appendChild(resetButton);

let timerDisplay = document.createElement('div');
timerDisplay.style.marginTop = '10px';
timerDisplay.style.fontSize = '20px';
timerDisplay.style.fontWeight = 'bold';
timerElement.appendChild(timerDisplay);

let timerInterval;

function updateTimerDisplay(elapsedTime) {
    let seconds = Math.floor(elapsedTime / 1000) % 60;
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    let minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    timerDisplay.innerText = `${minutes}:${seconds}`;
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
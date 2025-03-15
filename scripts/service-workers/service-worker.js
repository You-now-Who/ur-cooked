let timerState = {
    startTime: null,
    elapsedTime: 0,
    running: false
};

let restaurantAddState = false

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get_current_tab_url") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(tabs[0]);
        sendResponse({ url: tabs[0].url });
        });
        return true;
    } else if (request.action === 'startTimer') {
        timerState.startTime = Date.now() - timerState.elapsedTime;
        timerState.running = true;
        sendResponse({ status: 'started' });
    } else if (request.action === 'stopTimer') {
        timerState.elapsedTime = Date.now() - timerState.startTime;
        timerState.running = false;
        sendResponse({ status: 'stopped' });
    } else if (request.action === 'resetTimer') {
        timerState.startTime = null;
        timerState.elapsedTime = 0;
        timerState.running = false;
        sendResponse({ status: 'reset' });
    } else if (request.action === 'getTimerState') {
        if (timerState.running) {
            timerState.elapsedTime = Date.now() - timerState.startTime;
        }
        sendResponse(timerState);
    } else if (request.action === 'toggleRestaurantAddState') {
        restaurantAddState = !restaurantAddState;
        sendResponse(restaurantAddState);
    }
});

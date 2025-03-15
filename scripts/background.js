chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "logStatistics") {
    const logFilePath = 'logs/statistics.log';
    const logMessage = `${request.stat}\n`;
    fs.appendFileSync(logFilePath, logMessage);
  }
  // ...existing code...
});
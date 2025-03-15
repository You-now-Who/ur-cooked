const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'statistics.log');
const statsFilePath = path.join(__dirname, '..', 'statistics.json');

let stats = {
  redirected_from_homepage: 0,
  random_restaurant_selected: 0,
  items_added_to_cart: 0,
};

if (fs.existsSync(statsFilePath)) {
  stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
}

if (fs.existsSync(logFilePath)) {
  const logs = fs.readFileSync(logFilePath, 'utf8').split('\n');
  logs.forEach(log => {
    if (log) {
      stats[log] = (stats[log] || 0) + 1;
    }
  });
  fs.unlinkSync(logFilePath);
}

fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));

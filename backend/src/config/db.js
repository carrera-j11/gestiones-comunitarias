const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(dbPath)) {
    // estructura inicial
    const initial = {
      users: [],
      spaces: [],
      reservations: [],
      incidents: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
  }
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/todos.json');

function readTodos() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2), 'utf-8');
}

module.exports = { readTodos, writeTodos };

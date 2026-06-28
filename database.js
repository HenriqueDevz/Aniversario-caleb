const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data', 'caleb.db'))
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    checked INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    confirmed INTEGER DEFAULT 0
    )
`);

module.exports = db;
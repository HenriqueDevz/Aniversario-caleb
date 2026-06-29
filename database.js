const { createClient } = require('@libsql/client')
const db = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
})

async function initDB() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        )
    `)
    await db.execute (`
        CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        checked INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (category_id)REFERENCES categories(id)
        )
    `)
    await db.execute (`
        CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        confirmed INTEGER DEFAULT 0
        )
    `)
}

module.exports = { db, initDB }
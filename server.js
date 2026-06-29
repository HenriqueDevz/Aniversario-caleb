require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database');
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
const itemsRoutes = require('./routes/items/index');
const guestRoutes = require('./routes/guests/index');
app.use('/api', itemsRoutes);
app.use('/api', guestRoutes);

initDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    })
});
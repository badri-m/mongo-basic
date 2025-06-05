const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo= require('./db');

// Middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.engine('hbs', exhbs.engine({
    layoutsDir: 'views/',
    defaultLayout: 'main',  // Assuming you have views/main.hbs
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Route
app.get('/', async (req, res) => {
    let database = await dbo.getdatabase();
const collection = database.collection('players');
const players = await collection.find({}).toArray();

    let message = 'Hello, World!';
    res.render('main', { message, players });
});

// Server Start
app.listen(8000, () => {
    console.log('🚀 Listening on port 8000');
});

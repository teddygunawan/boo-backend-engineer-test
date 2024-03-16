const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('module-alias/register');

const { dbConnect, dbCleanup } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', require('./routes/profile')());

// Connect to database
dbConnect().then(() => console.log('Finished setting up database'));

// start server
const server = app.listen(port);

server.on('close', async () => {
  await dbCleanup();
});

console.log('Express started. Listening on localhost:%s', port);

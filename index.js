const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const routes = require('./api/Routes/routes');

mongoose.connect(process.env.DB_URL);

app.use(cors({ origin: true }))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// handle requests to main page (index.html)
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

// handle API routes
app.use('/api/users', routes)

// handle ALL other requests
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/views/404.html");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.status || 500;

  res.status(statusCode).json({
      error: {
          message: err.message,
          status: statusCode,
      },
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});


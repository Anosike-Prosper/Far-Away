// const express = require('express');

// const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// process.on('uncaughtException', (err) => {
//   console.log(err.name, err.message);
//   console.log('UNCAUGHT EXCEPTION!! Shutting down.....');

//   process.exit(1);
// });

dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT;

const DB = process.env.DATABASE_LOCAL;

//CONNECTING MONGODB LOCALLY
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful ');
  });

const server = app.listen(PORT, () => {
  console.log(`App is listening at localhost ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!! Shutting down.....');
  server.close(() => {
    process.exit(1);
  });
});

// const testTour = new Tour({
//   //creating an instance of our model
//   name: 'The park camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR', err);
//   });

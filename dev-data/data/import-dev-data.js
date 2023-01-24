const fs = require('fs');
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

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

//READ JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data sucessfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);

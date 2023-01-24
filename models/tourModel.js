const mongoose = require('mongoose');
const slugify = require('slugify');

// CREATING A SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour must have less than or equal to 40 characters'],
      minlength: [10, 'A tour must have more than or equal to 10 characters'],
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // THIS ONLY WORKS WHEN YOU ARE CREATING DOCUMENTS
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should bd below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary '],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: RUNS BEFORE SAVING TO THE DB .save() and .create()
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//DOCUMENT MIDDLEWARE: RUNS AFTER SAVING TO THE DB .save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre('/^find/', function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema); // creating a model from our schema

module.exports = Tour;

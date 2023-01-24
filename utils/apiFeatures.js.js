class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;

    return this;
  }

  filter() {
    //   // 1) FILTERING
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    //   console.log(queryObj);
    //   // // 1b) ADVANCED FILTERING

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(this.queryString);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // console.log(req.query);
      // req.query.sort = price
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    // console.log(this)

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // const fields= req.query.
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // console.log(limit);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

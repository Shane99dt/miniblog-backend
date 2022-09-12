const slugify = require("slugify");
const fs = require("fs");

const categoryNotExist = (req, res, next) => {
  fs.readFile("./categories.json", (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
      return;
    }
    if (!req.body.name) {
      res.status(400).json([{ msg: "Add a name", param: "name" }]);
      return;
    }

    const slugified = slugify(req.body.name, { lower: true });
    const dataJsoned = JSON.parse(data.toString());
    const category = dataJsoned.find((cat) => cat.slug === slugified);

    if (!category) {
      next();
    } else {
      res.status(409).json([{ msg: "Category already exists", param: "name" }]);
    }
  });
};

module.exports = { categoryNotExist };

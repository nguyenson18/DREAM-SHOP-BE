const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Brand = require("../model/brand");
const Catego = require("../model/category");
const Orther = require("../model/ordther");
const Product = require("../model/product");
const Review = require("../model/review");
const User = require("../model/user");

const productController = {};

productController.createProduct = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;
  const { name } = req.body;
  if (currentUserId !== userId)
    throw new AppError(400, "User not Exists", "Create Product Error");
  const user = await User.findById(currentUserId);
  if (user.role === "normal")
    throw new AppError(400, "User not Exists", "Create Product Error");

  sendResponse(res, 200, true, {}, null, "create Product success");
});
// get all product
productController.getAllProduct = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let user = await User.findById(currentUserId);

  let { page, limit, ...filterQuery } = req.query;
  const allowfilter = ["search", "type", "gte", "lte"];

  let arrBrand = [];
  let arrCategory = [];
  let type = {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  let filterkey = Object.keys(filterQuery);

  let isQuery;

  filterkey.map((key) => {
    if (!allowfilter.includes(key)) {
      throw new AppError(401, `Query ${key} is not allowed`, "Search Error");
    }
    if (!filterQuery[key]) delete filterQuery[key];
    if (filterQuery[key]) isQuery = true;
  });

  if (filterQuery.search) {
    const brand = await Brand.find({
      brand: { $regex: filterQuery.search, $options: "si" },
    });
    if (brand.length < 1) {
      const category = await Catego.find({
        name: { $regex: filterQuery.search, $options: "si" },
      });
      category.find((e) => arrCategory.push(e._id));
    }
    brand.find((e) => {
      arrBrand.push(e._id);
    });
  }

  let filterConditions = [];

  // 1) SEARCH
  if (filterQuery.search?.trim()) {
    const keyword = filterQuery.search.trim();

    const brandDocs = await Brand.find({
      brand: { $regex: keyword, $options: "i" },
    });

    brandDocs.forEach((e) => arrBrand.push(e._id));

    if (arrBrand.length < 1) {
      const categoryDocs = await Catego.find({
        name: { $regex: keyword, $options: "i" },
      });
      categoryDocs.forEach((e) => arrCategory.push(e._id));
    }

    const or = [];

    if (arrBrand.length) or.push({ authorBrand: { $in: arrBrand } });
    if (arrCategory.length) or.push({ authorCatego: { $in: arrCategory } });

    // luôn cho phép search theo model
    or.push({ "description.model": { $regex: keyword, $options: "i" } });

    filterConditions.push({ $or: or });
  }

  // 2) TYPE (sort hoặc filter)
  if (filterQuery.type) {
    if (filterQuery.type.includes("high-low")) {
      type = { "description.latest_price": -1 };
    } else if (filterQuery.type.includes("low-high")) {
      type = { "description.latest_price": 1 };
    } else {
      // nếu newProduct là boolean thì đừng ép string
      // ví dụ: type=new => newProduct=true
      filterConditions.push({ newProduct: filterQuery.type === "new" });
    }
  }

  // 3) PRICE RANGE (gộp chung)
  const priceCond = {};
  if (filterQuery.gte) priceCond.$gte = Number(filterQuery.gte);
  if (filterQuery.lte) priceCond.$lte = Number(filterQuery.lte);
  if (Object.keys(priceCond).length) {
    filterConditions.push({ "description.latest_price": priceCond });
  }

  // 4) FINAL QUERY
  const filterCrirerial =
    filterConditions.length > 0 ? { $and: filterConditions } : {};
  console.log(filterCrirerial)
  let data = await Product.find(filterCrirerial) // {name: "" , emal: ""}
    .sort(type)
    .collation({ locale: "en_US", numericOrdering: true })
    .populate([
      { path: "authorCatego", model: Catego },
      {
        path: "authorBrand",
        model: Brand,
      },
      { path: "reviews", model: Review },
    ]);
    console.log(data)
  const offset = limit * (page - 1);
  const count = await data.length;
  const totalPage = Math.ceil(count / limit);

  data = await data
    .sort(() => {
      if (!filterQuery.type) {
        return Math.random() - 0.5;
      } else {
        return;
      }
    })
    .slice(offset, offset + limit);

  sendResponse(
    res,
    200,
    true,
    { data, totalPage },
    null,
    "Get List All Product"
  );
});
// get single product
productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId).populate([
    { path: "authorCatego", model: Catego },
    { path: "authorBrand", model: Brand },
    { path: "reviews", model: Review },
  ]);

  if (!product)
    throw new AppError(400, "Product Not Exists", "Get Single Product Error");

  sendResponse(res, 200, true, product, null, "Get Single Product Success");
});
//get list brand procuct
productController.getListBrandProduct = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let user = await User.findById(currentUserId);
  let { page, limit, ...filterQuery } = req.query;
  const allowfilter = ["category", "brand", "search", "type", "gte", "lte"];

  let category;
  let type = {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  let filterkey = Object.keys(filterQuery);

  filterkey.forEach((key) => {
    if (!allowfilter.includes(key)) {
      throw new AppError(401, `Query ${key} is not allowed`, "Search Error");
    }
    if (!filterQuery[key]) delete filterQuery[key];
  });

  const newBrand = await Brand.findOne({ brand: filterQuery.brand });

  const filterConditions = filterQuery.brand
    ? [
      { authorBrand: { $eq: newBrand._id } },
      {
        "description.model": { $regex: new RegExp(filterQuery.search, "i") },
      },
    ]
    : null;

  if (filterQuery.category) {
    category = await Catego.findOne({ name: filterQuery.category });
    await filterConditions.push({ authorCatego: category._id });
  }

  if (filterQuery.type) {
    if (filterQuery.type?.includes("high-low")) {
      type = { "description.latest_price": -1 };
    } else if (filterQuery.type?.includes("low-high")) {
      type = { "description.latest_price": 1 };
    } else {
      filterConditions.push({ ["newProduct"]: `${filterQuery.type}` });
    }
  }

  if (filterQuery.gte) {
    filterConditions.push({
      "description.latest_price": { $gte: Number(filterQuery.gte) },
    });
  }
  if (filterQuery.lte) {
    filterConditions.push({
      "description.latest_price": { $lte: Number(filterQuery.lte) },
    });
  }

  const filterCrirerial = filterQuery.brand ? { $and: filterConditions } : {};

  let data = await Product.find(filterCrirerial)
    .sort(type)
    .collation({ locale: "en_US", numericOrdering: true })
    .populate([
      { path: "authorCatego", model: Catego },
      {
        path: "authorBrand",
        model: Brand,
      },
      { path: "reviews", model: Review },
    ]);

  const offset = limit * (page - 1);
  const count = await data.length;
  const totalPage = Math.ceil(count / limit);

  data = await data
    .sort(() => {
      if (!filterQuery.type) {
        return Math.random() - 0.5;
      } else {
        return;
      }
    })
    .slice(offset, offset + limit);

  sendResponse(
    res,
    200,
    true,
    { data, totalPage },
    null,
    "Get List Brand Product Success"
  );
});

module.exports = productController;

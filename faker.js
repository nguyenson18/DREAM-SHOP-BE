const csv = require("csvtojson");
// const mongoose = require("mongoose");
// const Brand = require("./model/brand");
// const Catego = require("./model/category");
// const Product = require("./model/product");
// const Total = require("./model/total");
// mongoose
//   .connect(
//     "mongodb+srv://nguyentruongson:XT0BvvagavOW7Lkx@data1.nrw3b7y.mongodb.net/?appName=data1"
//   )
//   .then(() => console.log("db connect success"))
//   .catch((err) => console.log(err));

// const fakerShopCamera = async () => {
//   let data = await csv().fromFile("DataCamera.csv");
//   const model = "Fujifilm" // Sony, Canon, Nikon, Fujifilm
//   const imageType = "imagecamera"
//   data = data.filter((e) => e.Model.includes(model));
//   data = new Set(data.map((e) => e));
//   data = Array.from(data);
//   const categoryType = 'camera' // camera, phone, laptop
//   const brandType = "fujifilm" // sony, canon, nikon, fujifilm
//   const numberMaxImage = 15
//   let category = await Catego.findOne({ name: categoryType });
//   if (!category) {
//     category = await Catego.create({ name: categoryType })
//   }
//   let brand = await Brand.findOne({ brand: brandType });
//   if (!brand) {
//     brand = await Brand.create({ brand: brandType })
//   }
//   const newPro = ["new", "old"];

//   for (let i = 0; i < data.length; i++) {
//     const random = Math.floor(Math.random() * newPro.length);
//     let discount = Number(Math.floor(Math.random() * (20 - 10) + 10));
//     const total = Math.floor(Number(data[i].Price) * (discount / 100));
//     const latest_price = Number(data[i].Price) - total;

//     const product = await Product.create({
//       authorCatego: category._id,
//       authorBrand: brand._id,
//       imageUrl: [
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (numberMaxImage - 1) + 1
//         )}.jpg`,
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (numberMaxImage - 1) + 1
//         )}.jpg`,
//       ],
//       ratings: Math.floor(Math.random() * (5 - 3) + 3),
//       newProduct: newPro[random],
//       description: {
//         model: data[i].Model.replace(`${model} `, ""),
//         latest_price: Number(data[i].Price) === 0 ? 1000 : latest_price,
//         old_price: Number(data[i].Price) || 0,
//         discount: Number(data[i].Price) === 0 ? 0 : discount,
//         dimensions: data[i].Dimensions,
//         zoomWide: data[i].zoomWide,
//         zoomTele: data[i].zoomTele,
//         maxResolution: data[i].maxResolution,
//         lowResolution: data[i].lowResolution,
//       },
//     });

//   }

//   const products = await Product.find({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//   });
//   const total = await Total.create({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//     totalProduct: Number(data.length),
//     quantityRemaining: Number(data.length),
//   });

// };
// fakerShopCamera();

// const fakerShopLaptop = async () => {
//   let data = await csv().fromFile("DataLaptop.csv");
//   const model = "acer" // Lenovo, DELL, ASUS, acer
//   const imageType = "imagelaptop"
//   data = data.filter((e) => e.brand.includes(model));
//   data = new Set(data.map((e) => e));
//   data = Array.from(data);
//   const categoryType = 'laptop' // laptop
//   const brandType = "acer" // lenovo, dell, asus,acer
//   let category = await Catego.findOne({ name: categoryType });
//   if (!category) {
//     category = await Catego.create({ name: categoryType })
//   }
//   let brand = await Brand.findOne({ brand: brandType });
//   if (!brand) {
//     brand = await Brand.create({ brand: brandType })
//   }
//   const newPro = ["new", "old"];

//   for (let i = 0; i < data.length; i++) {
//     const random = Math.floor(Math.random() * newPro.length);
//     let discount = Number(Math.floor(Math.random() * (20 - 10) + 10));

//     const product = await Product.create({
//       authorCatego: category._id,
//       authorBrand: brand._id,
//       imageUrl: [
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (5 - 1) + 1
//         )}.jpg`,
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (5 - 1) + 1
//         )}.jpg`,
//       ],
//       ratings: Math.floor(Math.random() * (5 - 3) + 3),
//       newProduct: newPro[random],
//       description: {
//         model: data[i]?.brand.replace(`${model} `, ""),
//         latest_price: Number(data[i]?.latest_price) || 0,
//         old_price: Number(data[i]?.old_price) || 0,
//         discount: Number(data[i]?.discount) === 0 ? 0 : data[i]?.discount,
//         dimensions: data[i]?.Dimensions || "",
//         zoomWide: data[i]?.zoomWide || "",
//         zoomTele: data[i]?.zoomTele || "",
//         maxResolution: data[i]?.maxResolution || "",
//         lowResolution: data[i]?.lowResolution || "",
//         os_bit: data[i]?.os_bit || "",
//         ssd: data[i]?.ssd || "",
//         hdd: data[i]?.hdd || "",
//         ram_gb: data[i]?.ram_gb?.replace(" GB", "") || "",
//         ram_type: data[i]?.ram_type || "",
//         processor_brand: data[i]?.processor_brand || "",
//         processor_name: data[i]?.processor_name || "",
//         processor_gnrtn: data[i]?.processor_gnrtn || "",
//         memory_size: data[i]?.memory_size?.replace(".0", "") || "32",
//         battery_size: data[i]?.battery_size?.replace(".0", "") || "2691",
//         screen_size: data[i]?.screen_size || "6",
//       },
//     });

//   }

//   const products = await Product.find({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//   });
//   const total = await Total.create({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//     totalProduct: Number(data.length),
//     quantityRemaining: Number(data.length),
//   });

// };

// fakerShopLaptop();

// const fakerShopPhone = async () => {
//   let data = await csv().fromFile("DataPhone.csv");
//   const model = "Xiaomi" // Samsung, Apple, Xiaomi, HUAWEI
//   const imageType = "imagephone"
//   data = data.filter((e) => e.brand_name.includes(model));
//   data = new Set(data.map((e) => e));
//   data = Array.from(data);
//   const categoryType = 'phone' //  phone
//   const brandType = "xiaomi" // samsung, apple, xiaomi, huawei
//   const numberMaxImage = 8
//   let category = await Catego.findOne({ name: categoryType });
//   if (!category) {
//     category = await Catego.create({ name: categoryType })
//   }
//   let brand = await Brand.findOne({ brand: brandType });
//   if (!brand) {
//     brand = await Brand.create({ brand: brandType })
//   }
//   const newPro = ["new", "old"];

//   for (let i = 0; i < data.length; i++) {
//     const random = Math.floor(Math.random() * newPro.length);
//     let discount = Math.round(((data[i]?.highest_price - data[i]?.lowest_price) / data[i]?.highest_price) * 100)


//     const product = await Product.create({
//       authorCatego: category._id,
//       authorBrand: brand._id,
//       imageUrl: [
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (numberMaxImage - 1) + 1
//         )}.jpg`,
//         `https://dream-shop-be.onrender.com/${imageType}/${brandType}${Math.floor(
//           Math.random() * (numberMaxImage - 1) + 1
//         )}.jpg`,
//       ],
//       ratings: Math.floor(Math.random() * (5 - 3) + 3),
//       newProduct: newPro[random],
//       description: {
//         model: data[i]?.brand_name.replace(`${model} `, "") || "",
//         latest_price: Number(data[i]?.lowest_price) || 0,
//         old_price: Number(data[i]?.highest_price) || 0,
//         discount: discount || 0,
//         dimensions: data[i]?.Dimensions || "",
//         zoomWide: data[i]?.zoomWide || "",
//         zoomTele: data[i]?.zoomTele || "",
//         maxResolution: data[i]?.maxResolution || "",
//         lowResolution: data[i]?.lowResolution || "",
//         os_bit: data[i]?.os_bit || "",
//         ssd: data[i]?.ssd || "",
//         hdd: data[i]?.hdd || "",
//         ram_gb: data[i]?.ram_gb?.replace(" GB", "") || "",
//         ram_type: data[i]?.ram_type || "",
//         processor_brand: data[i]?.processor_brand || "",
//         processor_name: data[i]?.processor_name || "",
//         processor_gnrtn: data[i]?.processor_gnrtn || "",
//         memory_size: data[i]?.memory_size?.replace(".0", "") || "32",
//         battery_size: data[i]?.battery_size?.replace(".0", "") || "2691",
//         screen_size: data[i]?.screen_size || "6",
//       },
//     });

//   }

//   const products = await Product.find({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//   });
//   const total = await Total.create({
//     authorCatego: category._id,
//     authorBrand: brand._id,
//     totalProduct: Number(data.length),
//     quantityRemaining: Number(data.length),
//   });

// };

// fakerShopPhone();





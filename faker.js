const csv = require("csvtojson");
const mongoose = require("mongoose");
const Brand = require("./model/brand");
const Catego = require("./model/category");
const Product = require("./model/product");
const Total = require("./model/total");
const Count = require("./model/count");
mongoose
  .connect(
    "mongodb+srv://nguyentruongsonpp:81bKDMMRau5KDVjb@cluster0.g1foun7.mongodb.net/dream-shop?appName=Cluster0"
  )
  .then(() => console.log("db connect success"))
  .catch((err) => console.log(err));
const fakerShop = async () => {
  let data = await csv().fromFile("DataLaptop.csv");
  const brandType = "apple"
  const categoryType = "laptop"
  data = data?.filter((e) => e?.Model?.includes(brandType));
  //samsung, xiaomi, huawei, Sony // lenovo, apple, asus, dell, acer, fujifilm, canon, nikon, hp
  data = new Set(data?.map((e) => e));
  data = Array.from(data);
  let category = await Catego.findOne({ name: categoryType });
  let brand = await Brand.findOne({ brand: brandType });
  if (!brand) {
    brand = await Brand.create({ brand: brandType });
  }
  if (!category) {
    category = await Catego.create({ name: categoryType });
  }
  const newPro = ["new", "old"];

  for (let i = 0; i < data.length; i++) {
    const random = Math.floor(Math.random() * newPro.length);
    let discount = Number(Math.floor(Math.random() * (20 - 10) + 10));
    const total = Math.floor(Number(data[i]?.Price) * (discount / 100));
    const latest_price = Number(data[i]?.Price) - total;
    const product = await Product.create({
      authorCatego: category?._id,
      authorBrand: brand?._id,
      imageUrl: [
        `https://shop-app-backend-production-5c4e.up.railway.app/imagecamera/${brandType}${Math.floor(
          Math.random() * (14 - 1) + 1
        )}.png`,
        `https://dream-shop-be.onrender.com/imagecamera/${brandType}${Math.floor(
          Math.random() * (14 - 1) + 1
        )}.png`,
      ],
      ratings: Math.floor(Math.random() * (5 - 3) + 3),
      newProduct: newPro[random],
      description: {
        model: data[i]?.Model?.replace(`${brandType} `, ""),
        latest_price: Number(data[i]?.Price) === 0 ? 1000 : latest_price,
        old_price: Number(data[i]?.Price),
        discount: Number(data[i]?.Price) === 0 ? 0 : discount,
        dimensions: data[i]?.Dimensions,
        zoomWide: data[i]?.zoomWide,
        zoomTele: data[i]?.zoomTele,
        maxResolution: data[i]?.maxResolution,
        lowResolution: data[i]?.lowResolution,
      },
    });
  }

  const products = await Product.find({
    authorCatego: category._id,
    authorBrand: brand._id,
  });
  const total = await Total.create({
    authorCatego: category._id,
    authorBrand: brand._id,
    totalProduct: Number(data?.length),
    quantityRemaining: Number(data?.length),
  });

  await Count.create({
    authorBrand: brand._id,
    authorCatego: category._id,
  });

  // const idproduct = newData.map((e) => {
  //   return e._id;
  // });

  // for (let i = 0; i < newData.length; i++) {
  //   let discount = await Math.floor(Math.random() * 50);
  //   const a = await Product.findByIdAndUpdate(idproduct[i], {
  //     discount: `${discount}`,
  //     old_price: `${15000}`,
  //     latest_price: `${15000 - Math.floor(15000 * (discount / 100))}`,
  //   });
  // }

  // data = data.map((e) => {
  //   const discount = Math.floor(Math.random() * 50);
  //   return {
  //     ...e,
  //     ["discount"]: `${discount}`,
  //     ["old_price"]: e.Price,
  //     ["latest_price"]: `${
  //       parseInt(e.Price) - Math.floor(e.Price * (discount / 100))
  //     }`,
  //   };
  // });



  // data.forEach(async (e) => {
  //   const random = Math.floor(Math.random() * newPro.length);
  //   await Product.create({
  //     authorCatego: category._id,
  //     authorBrand: brand._id,
  //     model: e.model.toLowerCase(),
  //     model: e.Model.replace("Nikon ", "").toLowerCase(),
  //     latest_price: e.Price.replace(".0", "") || "2900",
  //     old_price: e.highest_price.replace(".0", "") || "3000",
  //     latest_price: e.latest_price.replace(".0", "") || "2900",
  //     old_price: e.old_price.replace(".0", "") || "3000",
  //     discount: e.discount,
  //     discount: e.sellers_amount,
  //     ratings: Math.floor(Math.random() * (6 - 3) + 3),
  //     os: e.os.toLowerCase(),
  //     weight: e.weight.toLowerCase(),
  //     os_bit: e.os_bit,
  //     ssd: e.ssd,
  //     hdd: e.hdd,
  //     ram_gb: e.ram_gb.replace(" GB", ""),
  //     ram_type: e.ram_type,
  //     processor_brand: e.processor_brand,
  //     processor_name: e.processor_name,
  //     processor_gnrtn: e.processor_gnrtn,
  //     memory_size: e.memory_size.replace(".0", "") || "32",
  //     battery_size: e.battery_size.replace(".0", "") || "2691",
  //     screen_size: e.screen_size || "6",
  //     newProduct: newPro[random],
  //     dimensions: e.Dimensions,
  //     zoomWide: e.zoomWide,
  //     zoomTele: e.zoomTele,
  //     maxResolution: e.maxResolution,
  //     lowResolution: e.lowResolution,
  //     imageUrl: `https://shop-app-backend-production.up.railway.app/imagecamera/sony${Math.floor(
  //       Math.random() * (15 - 1) + 1
  //     )}.png`,
  //   });
  // });



  const counts = await Count.find({
    authorBrand: brand._id,
    authorCatego: category._id,
  });

  const countBrand = await Count.findByIdAndUpdate(counts[0]._id, {
    count: data.length,
    quantityRemaining: data.length,
  });

  // let brandData = await Brand.findById(brand._id);
  // brandData = brandData.count.forEach((e) => { });

};

fakerShop();

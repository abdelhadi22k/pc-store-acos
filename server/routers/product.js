import express from "express";
import Product from "../model/product.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from './../stn/utils.js';

const router = express.Router();

const PAGE_SIZE = 6;

router.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const brand = query.brand || "";
    const offer = query.offer || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all" 
        ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const brandFilter = brand && brand !== "all" ? { brand } : {};
    const offerFilter =
  offer && offer !== "all"
    ? { "offer.offerDescription": offer }
    : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
          rating: {
            $gte: Number(rating),
          },
        }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
          // 1-50
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
          ? { price: 1 }
          : order === "highest"
            ? { price: -1 }
            : order === "toprated"
              ? { rating: -1 }
              : order === "newest"
                ? { createdAt: -1 }
                : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...offerFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...offerFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message }); 
  }
});

router.get("/products_offer", async (req, res) => {
  try {
    const products = await Product.find({ "offer.offerAvailable": true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.get("/products_offer/:offerDescription", async (req, res) => {
  try {
    const products = await Product.find({
      "offer.offerDescription": req.params.offerDescription,
    });
    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.status(404).json({ message: "Products Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});



router.get("/product_discount", async (req, res) => {
  try {
    const products = await Product.find({ "discount.discountAvailable": true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});



router.get(`/categories/:category`, async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Products Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    try {
      const categories = await Product.find().distinct("category");
      if (categories) {
        res.status(200).send(categories);
      } else {
        res.status(404).send({ message: "categories Not Found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error Adding Review", error: error.message });
    }
  })
);

router.get(
  "/offer_description",
  expressAsyncHandler(async (req, res) => {
    try { 
      const offer = await Product.find().distinct("offer.offerDescription");
      if (offer) {
        res.status(200).send(offer);
      } else {
        res.status(404).send({ message: "not offer description" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error Adding Review", error: error.message });
    }
  })
);




router.get(
  "/brand",
  expressAsyncHandler(async (req, res) => {
    try {
      const brands = await Product.find().distinct("brand");
      if (brands) {
        res.status(200).send(brands);
      } else {
        res.status(404).send({ message: "brands Not Found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error Adding Review", error: error.message });
    }
  })
);

router.get(`/brands/:brand`, async (req, res) => {
  try {
    const products = await Product.find({ brand: req.params.brand });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Brand Products Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findOne({ slug: req.params.slug });

      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send({ message: "Product Not Found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error Adding Review", error: error.message });
    }
  })
);

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.post(
  "/addReview/:id", 
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { name, rating, comment } = req.body;

    // تحقق من صحة البيانات
    if (!name || !rating || !comment) {
      return res.status(400).send({
        message: "All fields are required: name, rating, and comment",
      });
    }


    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send({ message: "Product Not Found" });
      } 

      const review = {
        name,
        rating,
        comment,
      };

      product.product_reviews.push(review);
      product.numberReviews = product.product_reviews.length;
      product.rating =
        product.product_reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.product_reviews.length;

      await product.save();
      res.status(201).send(product);
    } catch (error) {
      console.error("Error adding review:", error);
      res
        .status(500)
        .send({ message: "Error Adding Review", error: error.message });
    }
  })
);

router.post("/addProduct",async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      slug: req.body.slug,
      product_image: req.body.product_image,
      brand: req.body.brand,
      category: req.body.category,
      offer: req.body.offer,
      discount: req.body.discount,
      category: req.body.category,
      description: req.body.description,
      warranty: req.body.warranty,
      price: req.body.price,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numberReviews: req.body.numberReviews,
      specifications: req.body.specifications,
      product_reviews: req.body.product_reviews,
    });
    await product.save();
    res.send(product);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        
        offer: req.body.offer,
        discount: req.body.discount
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).send(`we don't have her this Product`);
    }
    res.send(product);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.status(404).send(`we dont have her this Product `);
    }
    res.send(product);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Adding Review", error: error.message });
  }
});

export default router;

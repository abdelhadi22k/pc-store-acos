import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    product_image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    offer:{ 
      offerAvailable: { type: Boolean, required: true },
      offerDescription: { type: String, required: true },
    },
    discount: { 
      discountAvailable: { type: Boolean, required: true },
      discountValue: { type: Number, required: true },
    },
    description: { type: String, required: true },
    warranty: { type: String, required: true },
    price: { type: Number, required: true },  
    countInStock: { type: Number, required: true }, 
    rating: { type: Number, default: 0 }, 
    numberReviews: { type: Number, default: 0 }, 
    specifications: [ 
      {
        name: { type: String, required: true }, 
        value: { type: String, required: true }, 
      },
    ],
    product_reviews: [ 
      {
        name: { type: String, required: true},
        rating: { type: Number, required: true},
        comment: { type: String, required: true},
      }, 
    ],
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product; 

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offer_name: { type: String, required: true },
    offer_image: { type: String, required: true },
    offer_title: { type: String, required: true },
    offer_description: { type: String, required: true },
  },
  {
    timestamps: true, 
  }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer; 

import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Size", "Color"
    value: { type: String, required: true }, // e.g., "Large", "Red"
    additionalPrice: { type: Number, default: 0 }, // extra price for variant (optional)
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  items: [
    {
      title: { type: String },
      content: { type: String },
    },
  ],
});
const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true }, // SEO-friendly URL
    sku: { type: String, unique: true, sparse: true }, // product code
    brand: { type: String },
    category: { type: String, required: true },

    // Pricing
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null }, // discounted price
    currency: { type: String, default: "INR" },

    // Stock / Inventory
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    lowStockAlert: { type: Number, default: 5 },

    // Variants (size, color, etc.)
    variants: [variantSchema],

    // Images
    images: [imageSchema],

    // Description
    shortDescription: { type: String },
    description: { type: String, required: true },
    sections: [sectionSchema],
    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [String],

    // Product Dimensions
    weight: { type: Number }, // grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // Shipping
    shippingCharge: { type: Number, default: 0 },
    isFreeShipping: { type: Boolean, default: true },

    // Flags / Labels
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },

    // Reviews & Ratings
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema],

    // Tracking & Analytics
    views: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

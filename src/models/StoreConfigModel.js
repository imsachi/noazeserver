import mongoose from "mongoose";

const storeConfigSchema = new mongoose.Schema(
  {
    taxes: {
      gstPercent: { type: Number, default: 18 }, // % GST
      cgstPercent: { type: Number, default: 9 },
      sgstPercent: { type: Number, default: 9 },
    },

    deliveryCharges: {
      baseCharge: { type: Number, default: 40 },
      freeDeliveryAbove: { type: Number, default: 999 },
      zoneBasedCharges: [
        {
          zone: String, // "metro", "non-metro", "remote"
          charge: Number,
        },
      ],
    },

    discounts: {
      activeCoupons: [
        {
          code: String,
          type: { type: String, enum: ["flat", "percentage"] },
          value: Number,
          minOrderAmount: Number,
          maxDiscount: Number,
          expiresAt: Date,
        },
      ],
    },

    storeStatus: {
      isStoreOpen: { type: Boolean, default: true },
      codEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("StoreConfig", storeConfigSchema);

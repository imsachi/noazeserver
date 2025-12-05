import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: String, // store snapshot
    image: String, // snapshot
    price: Number, // price at time of order
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: String,
    mobile: String,
    email: String,
    pincode: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    landmark: String,
    type: String,
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    subtotal: Number,
    shippingCharge: Number,
    discount: Number,
    tax: Number,
    totalPayable: Number,
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    status: String,
    location: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    deliveryAddress: addressSnapshotSchema,

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Stripe", "PayPal"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Confirmed",
    },

    expectedDelivery: Date,

    billSummary: billSchema,

    trackingUpdates: [trackingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

import StoreConfig from "../models/StoreConfigModel.js";
import Product from "../models/ProductModel.js";
import axios from "axios";

export const calculateBill = async (req, res) => {
  try {
    const { cartItems, pincode, couponCode } = req.body;

    const config = await StoreConfig.findOne();

    if (!config) return res.status(500).json({ error: "Store config missing" });

    let subtotal = 0;

    // Calculate subtotal
    for (let item of cartItems) {
      const product = await Product.findById(item.product);
      subtotal += product.price * item.qty;
    }

    // Taxes
    const gst = (subtotal * config.taxes.gstPercent) / 100;

    // Delivery charges
    let deliveryCharge = config.deliveryCharges.baseCharge;
    if (subtotal >= config.deliveryCharges.freeDeliveryAbove) {
      deliveryCharge = 0;
    }

    // Discount
    let discount = 0;
    if (couponCode) {
      const coupon = config.discounts.activeCoupons.find(
        (c) => c.code === couponCode
      );
      if (coupon) {
        if (coupon.type === "percentage") {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else {
          discount = coupon.value;
        }
      }
    }

    const total = subtotal + gst + deliveryCharge - discount;

    res.json({
      success: true,
      bill: {
        subtotal,
        gst,
        deliveryCharge,
        discount,
        total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Billing error", details: err.message });
  }
};
export const checkingPincode = async (req, res) => {
  const { pin } = req.query;
  if (!pin) {
    return res.status(400).json({
      success: false,
      msg: "Destination pincode required",
    });
  }

  try {
    const response = await axios.get(
      "https://track.delhivery.com/c/api/pin-codes/json/",
      {
        params: {
          filter_codes: pin,
        },
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Delivery check failed",
    });
  }
};
export const checkingDelivery = async (req, res) => {
  const { destination_pin } = req.query;
  if (!destination_pin) {
    return res.status(400).json({
      success: false,
      msg: "Destination pincode required",
    });
  }

  try {
    const response = await axios.get(
      "https://track.delhivery.com/api/dc/expected_tat",
      {
        params: {
          origin_pin: "522002", // warehouse pin
          destination_pin,
          mot: "S",
        },
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Delivery check failed",
    });
  }
};

import StoreConfig from "../models/StoreConfigModel.js";
import Product from "../models/ProductModel.js";

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

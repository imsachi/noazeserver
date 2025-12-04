import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { items, user, billing } = req.body;

    // create order
    const order = await Order.create({
      user: user._id,
      items: items.map((i) => ({
        product: i.product,
        title: i.title, // snapshot (add)
        image: i.image, // snapshot (add)
        price: i.price,
        quantity: i.qty, // rename qty → quantity
      })),
      deliveryAddress: user.addresses[user.addresses.length - 1],
      billSummary: {
        subtotal: billing.subtotal,
        tax: billing.gst, // rename
        shippingCharge: billing.deliveryCharge, // rename
        discount: billing.discount,
        totalPayable: billing.total, // rename
      },
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      expectedDelivery: new Date(Date.now() + 5 * 86400000), // 5 days auto
      trackingUpdates: [
        { status: "Order Placed", location: "System", date: new Date() },
      ],
    });

    // link order inside User document
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

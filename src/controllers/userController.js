import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const phoneExists = await User.findOne({ phone });
    if (phoneExists)
      return res
        .status(400)
        .json({ success: false, message: "Phone already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const newAddress = {
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      email: req.body.email,
      pincode: req.body.pincode,
      state: req.body.state,
      city: req.body.city,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      landmark: req.body.landmark,
      isDefault: user.addresses.length === 0, // First address default
    };

    user.addresses.push(newAddress);
    user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: "Could not save address" });
  }
};

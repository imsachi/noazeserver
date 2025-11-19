import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// --- FIXED CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://zustit.com",
  "https://www.zustit.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --- REST MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;

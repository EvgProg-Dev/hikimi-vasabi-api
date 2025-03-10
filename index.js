import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from "path";

import {
    loginValidation,
    orderCreateValidation,
    productCreateValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import { getMe, login } from "./controllers/UserController.js";
import {
    createProduct,
    getAllProducts,
    getOneProduct,
    removeProduct,
    updateProduct,
} from "./controllers/ProductController.js";

import handleValidationErrors from "./utils/handleValidationErrors.js";
import rateLimit from "express-rate-limit";
import {
    createOrder,
    getAllOrders,
    getOneOrder,
    removeOrder,
    updateOrder,
} from "./controllers/OrderController.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB OK!");
    })
    .catch((error) => {
        console.log(error);
    });

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000, // max 1000
    message: "Слишком много запросов с этого IP, пожалуйста, попробуйте позже.",
    statusCode: 429,
});

const app = express();

app.set("trust proxy", true);

app.use(cors());

app.use(limiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// const storage = multer.diskStorage({
//     destination: (_, __, cb) => {
//         cb(null, "uploads");
//     },
//     filename: (_, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, "uploads"),
    filename: (_, file, cb) => cb(null, file.originalname),
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Недопустимый формат файла"), false);
        }
        cb(null, true);
    },
});

app.use("/uploads", express.static("uploads"));

// Эндпоинты
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({ url: `/uploads/${req.file.originalname}` });
});

app.use(express.json({ limit: "1mb" }));

app.post("/auth/login", loginValidation, handleValidationErrors, login);

// app.post(
//     "/auth/register",
//     registerValidation,
//     handleValidationErrors,
//     register
// );

app.get("/auth/me", checkAuth, getMe);

app.get("/products", getAllProducts);
app.get("/products/:id", getOneProduct);
app.post(
    "/products",
    checkAuth,
    productCreateValidation,
    handleValidationErrors,
    createProduct
);
app.delete("/products/:id", checkAuth, removeProduct);
app.patch(
    "/products/:id",
    checkAuth,
    productCreateValidation,
    handleValidationErrors,
    updateProduct
);

app.get("/orders", checkAuth, getAllOrders);
app.get("/orders/:id", checkAuth, getOneOrder);
app.post("/orders", orderCreateValidation, createOrder);
app.delete("/orders/:id", checkAuth, removeOrder);
app.patch("/orders/:id", checkAuth, updateOrder);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
        return console.log(error);
    }
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

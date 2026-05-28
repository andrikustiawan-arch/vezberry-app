import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

console.log("REDEPLOY FORCE FINAL");

// =========================
// DEBUG LOGGER
// =========================

app.use((req, res, next) => {

    console.log(
        `[${new Date().toISOString()}]`,
        req.method,
        req.url
    );

    next();

});

// =========================
// PATHS
// =========================

const dataDir = path.join(__dirname, "data");
const uploadsDir = path.join(__dirname, "uploads");
const distPath = path.join(__dirname, "dist");

const productsFile = path.join(dataDir, "products.json");
const ordersFile = path.join(dataDir, "orders.json");
const settingsFile = path.join(dataDir, "settings.json");

// =========================
// CREATE DIRS
// =========================

[dataDir, uploadsDir].forEach((dir) => {

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir, {
            recursive: true,
        });

    }

});

// =========================
// CREATE FILES
// =========================

if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, "[]");
}

if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]");
}

if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, "{}");
}

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json({
    limit: "20mb",
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb",
}));

// =========================
// MULTER
// =========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadsDir);

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-")
        );

    },

});

const upload = multer({ storage });

// =========================
// API ROUTES
// =========================

// HEALTH

app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "VEZBERRY API OK",
    });

});

// TEST POST

app.post("/api/test", (req, res) => {

    console.log("TEST POST HIT");

    res.json({
        success: true,
        body: req.body,
    });

});

// =========================
// PRODUCTS
// =========================

// GET PRODUCTS

app.get("/api/products", (req, res) => {

    try {

        const data =
            fs.readFileSync(productsFile, "utf8");

        const products =
            JSON.parse(data);

        return res.json(products);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: "Failed get products",
        });

    }

});

// CREATE PRODUCT

app.post("/api/products", (req, res) => {

    try {

        console.log("POST PRODUCT BODY:", req.body);

        const data =
            fs.readFileSync(productsFile, "utf8");

        const products =
            JSON.parse(data);

        const newProduct = {

            id: Date.now().toString(),

            name: req.body.name || "",
            category: req.body.category || "",
            price: Number(req.body.price) || 0,
            stock: Number(req.body.stock) || 0,
            description: req.body.description || "",
            image: req.body.image || "",
            imageUrl: req.body.imageUrl || "",

            createdAt:
                new Date().toISOString(),

            sales_daily: 0,
            sales_weekly: 0,
            sales_monthly: 0,
            sales_yearly: 0,

        };

        products.unshift(newProduct);

        fs.writeFileSync(
            productsFile,
            JSON.stringify(products, null, 2)
        );

        console.log("PRODUCT SAVED");

        return res.status(201).json({
            success: true,
            product: newProduct,
        });

    } catch (err) {

        console.error("CREATE PRODUCT ERROR:", err);

        return res.status(500).json({
            success: false,
            error: "Failed create product",
        });

    }

});

// =========================
// ORDERS
// =========================

app.get("/api/orders", (req, res) => {

    try {

        const data =
            fs.readFileSync(ordersFile, "utf8");

        return res.json(JSON.parse(data));

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: "Failed get orders",
        });

    }

});

// =========================
// SETTINGS
// =========================

app.get("/api/settings", (req, res) => {

    try {

        const data =
            fs.readFileSync(settingsFile, "utf8");

        return res.json(JSON.parse(data));

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: "Failed get settings",
        });

    }

});

// =========================
// IMAGE UPLOAD
// =========================

app.post(
    "/api/upload",
    upload.single("image"),
    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    error: "No file uploaded",
                });

            }

            const imageUrl =
                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            return res.json({
                success: true,
                imageUrl,
            });

        } catch (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                error: "Upload failed",
            });

        }

    }
);

// =========================
// STATIC FILES
// =========================

app.use(
    "/uploads",
    express.static(uploadsDir)
);

app.use(
    "/",
    express.static(distPath, {
        index: false,
    })
);

// =========================
// SPA FALLBACK
// =========================

app.get("*", (req, res) => {

    const indexFile =
        path.join(distPath, "index.html");

    if (fs.existsSync(indexFile)) {

        return res.sendFile(indexFile);

    }

    return res
        .status(404)
        .send("index.html not found");

});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    return res.status(500).json({
        success: false,
        error: "Internal Server Error",
    });

});

// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on ${PORT}`);
    console.log("DIST PATH:", distPath);

});
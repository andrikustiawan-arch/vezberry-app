
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

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

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

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

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
// STATIC
// =========================

app.use("/uploads", express.static(uploadsDir));

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

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
            Date.now() + "-" + file.originalname.replace(/\s+/g, "-")
        );
    },
});

const upload = multer({
    storage,
});

// =========================
// API
// =========================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
    });
});

// =========================
// PRODUCTS
// =========================

app.get("/api/products", (req, res) => {
    try {
        const data = fs.readFileSync(productsFile, "utf8");

        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({
            error: "Failed get products",
        });
    }
});

app.post("/api/products", (req, res) => {
    try {
        const data = fs.readFileSync(productsFile, "utf8");

        const products = JSON.parse(data);

        const newProduct = {
            id: Date.now().toString(),
            ...req.body,
        };

        products.push(newProduct);

        fs.writeFileSync(
            productsFile,
            JSON.stringify(products, null, 2)
        );

        res.json({
            success: true,
            product: newProduct,
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed create product",
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
                    error: "No file uploaded",
                });
            }

            const imageUrl =
                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            res.json({
                success: true,
                imageUrl,
            });
        } catch (err) {
            res.status(500).json({
                error: "Upload failed",
            });
        }
    }
);

// =========================
// SPA FALLBACK
// =========================

app.get("*", (req, res) => {
    res.sendFile(
        path.join(distPath, "index.html")
    );
});

// =========================
// START
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});
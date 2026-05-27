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
        fs.mkdirSync(dir, { recursive: true });
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

app.use(express.json({ limit: "20mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "20mb",
    })
);

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
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-")
        );
    },
});

const upload = multer({ storage });

// =========================
// HEALTH
// =========================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "VEZBERRY API OK",
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
        console.error(err);

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
        console.error(err);

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
            console.error(err);

            res.status(500).json({
                error: "Upload failed",
            });
        }
    }
);

// =========================
// SPA FALLBACK
// =========================

app.use((req, res) => {
    const indexFile = path.join(distPath, "index.html");

    if (fs.existsSync(indexFile)) {
        return res.sendFile(indexFile);
    }

    return res.status(404).send("index.html not found");
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
        error: "Internal Server Error",
    });
});

// =========================
// START
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
    console.log("DIST PATH:", distPath);
});
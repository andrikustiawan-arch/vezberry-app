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
// STATIC FILES
// =========================

app.use(
    "/uploads",
    express.static(uploadsDir)
);

// =========================
// SERVE FRONTEND DIST
// =========================

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

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);

    },

});

const upload = multer({

    storage,

    limits: {

        fileSize: 10 * 1024 * 1024,

    },

});

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,
        message: "VEZBERRY API RUNNING",

    });

});

// =========================
// PRODUCTS
// =========================

// GET PRODUCTS

app.get("/api/products", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                productsFile,
                "utf8"
            );

        const products =
            JSON.parse(data);

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed get products",

        });

    }

});

// CREATE PRODUCT

app.post("/api/products", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                productsFile,
                "utf8"
            );

        const products =
            JSON.parse(data);

        const newProduct = {

            id: Date.now().toString(),

            createdAt:
                new Date().toISOString(),

            ...req.body,

        };

        products.push(newProduct);

        fs.writeFileSync(

            productsFile,

            JSON.stringify(
                products,
                null,
                2
            )

        );

        res.json({

            success: true,
            product: newProduct,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed create product",

        });

    }

});

// UPDATE PRODUCT

app.put("/api/products/:id", (req, res) => {

    try {

        const { id } = req.params;

        const data =
            fs.readFileSync(
                productsFile,
                "utf8"
            );

        const products =
            JSON.parse(data);

        const index =
            products.findIndex(
                (p) => p.id == id
            );

        if (index === -1) {

            return res
                .status(404)
                .json({

                    error:
                        "Product not found",

                });

        }

        products[index] = {

            ...products[index],

            ...req.body,

            updatedAt:
                new Date().toISOString(),

        };

        fs.writeFileSync(

            productsFile,

            JSON.stringify(
                products,
                null,
                2
            )

        );

        res.json({

            success: true,
            product: products[index],

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed update product",

        });

    }

});

// DELETE PRODUCT

app.delete("/api/products/:id", (req, res) => {

    try {

        const { id } = req.params;

        const data =
            fs.readFileSync(
                productsFile,
                "utf8"
            );

        const products =
            JSON.parse(data);

        const filtered =
            products.filter(
                (p) => p.id != id
            );

        fs.writeFileSync(

            productsFile,

            JSON.stringify(
                filtered,
                null,
                2
            )

        );

        res.json({

            success: true,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed delete product",

        });

    }

});

// =========================
// ORDERS
// =========================

app.get("/api/orders", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                ordersFile,
                "utf8"
            );

        res.json(
            JSON.parse(data)
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed get orders",

        });

    }

});

// =========================
// SETTINGS
// =========================

app.get("/api/settings", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                settingsFile,
                "utf8"
            );

        res.json(
            JSON.parse(data)
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed get settings",

        });

    }

});

app.put("/api/settings", (req, res) => {

    try {

        fs.writeFileSync(

            settingsFile,

            JSON.stringify(
                req.body,
                null,
                2
            )

        );

        res.json({

            success: true,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed save settings",

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

                return res
                    .status(400)
                    .json({

                        error:
                            "No file uploaded",

                    });

            }

            const imageUrl =

                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            res.json({

                success: true,
                imageUrl,

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                error:
                    "Upload failed",

            });

        }

    }

);

// =========================
// SPA FALLBACK
// =========================

app.get("*", (req, res) => {

    if (req.path.startsWith("/api")) {

        return res
            .status(404)
            .json({

                error:
                    "API route not found",

            });

    }

    const indexPath =
        path.join(
            distPath,
            "index.html"
        );

    if (!fs.existsSync(indexPath)) {

        return res
            .status(500)
            .send("dist/index.html not found");

    }

    res.sendFile(indexPath);

});

// =========================
// DEBUG
// =========================

console.log(
    "DIST EXISTS:",
    fs.existsSync(distPath)
);

console.log(
    "INDEX EXISTS:",
    fs.existsSync(
        path.join(
            distPath,
            "index.html"
        )
    )
);

// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on ${PORT}`
    );

});
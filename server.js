
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// =========================
// __DIRNAME
// =========================

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

// =========================
// APP
// =========================

const app =
    express();

const PORT =
    process.env.PORT || 3001;

// =========================
// MIDDLEWARE
// =========================

app.use(cors({

    origin: [

        'https://www.vezberry.com',
        'https://vezberry.com',
        'http://localhost:5173',
        'http://localhost:3001',

    ],

    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
    ],

    credentials: true,

}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

// =========================
// PATHS
// =========================

const dataDir =
    path.join(__dirname, 'data');

const uploadsDir =
    path.join(__dirname, 'uploads');

const distPath =
    path.join(__dirname, 'dist');

const productsFile =
    path.join(dataDir, 'products.json');

const ordersFile =
    path.join(dataDir, 'orders.json');

const settingsFile =
    path.join(dataDir, 'settings.json');

// =========================
// CREATE FOLDERS
// =========================

if (!fs.existsSync(dataDir)) {

    fs.mkdirSync(
        dataDir,
        { recursive: true }
    );

}

if (!fs.existsSync(uploadsDir)) {

    fs.mkdirSync(
        uploadsDir,
        { recursive: true }
    );

}

// =========================
// CREATE FILES
// =========================

if (!fs.existsSync(productsFile)) {

    fs.writeFileSync(
        productsFile,
        JSON.stringify([], null, 2)
    );

}

if (!fs.existsSync(ordersFile)) {

    fs.writeFileSync(
        ordersFile,
        JSON.stringify([], null, 2)
    );

}

if (!fs.existsSync(settingsFile)) {

    fs.writeFileSync(
        settingsFile,
        JSON.stringify({}, null, 2)
    );

}

// =========================
// STATIC FILES
// =========================

app.use(
    '/uploads',
    express.static(uploadsDir)
);

// =========================
// MULTER
// =========================

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                uploadsDir
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            const uniqueName =
                Date.now() +
                '-' +
                file.originalname
                    .replace(/\s+/g, '-');

            cb(
                null,
                uniqueName
            );

        },

    });

const upload =
    multer({

        storage,

        limits: {

            fileSize:
                10 * 1024 * 1024,

        },

    });

// =========================
// TEST
// =========================

app.get('/', (req, res) => {

    res.json({

        success: true,

        message:
            'VEZBERRY BACKEND RUNNING',

    });

});

// =========================
// PRODUCTS
// =========================

// GET PRODUCTS

app.get('/api/products', (req, res) => {

    try {

        const data =
            fs.readFileSync(
                productsFile,
                'utf8'
            );

        res.json(
            JSON.parse(data)
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                'Gagal membaca products',

        });

    }

});

// CREATE PRODUCT

app.post('/api/products', (req, res) => {

    try {

        const data =
            fs.readFileSync(
                productsFile,
                'utf8'
            );

        const products =
            JSON.parse(data);

        const newProduct = {

            id:
                Date.now()
                    .toString(),

            createdAt:
                new Date()
                    .toISOString(),

            ...req.body,

        };

        products.push(
            newProduct
        );

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

            product:
                newProduct,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                'Gagal menambah product',

        });

    }

});

// UPDATE PRODUCT

app.put('/api/products/:id', (req, res) => {

    try {

        const { id } =
            req.params;

        const data =
            fs.readFileSync(
                productsFile,
                'utf8'
            );

        const products =
            JSON.parse(data);

        const index =
            products.findIndex(

                (p) =>
                    p.id == id

            );

        if (index === -1) {

            return res
                .status(404)
                .json({

                    error:
                        'Product tidak ditemukan',

                });

        }

        products[index] = {

            ...products[index],

            ...req.body,

            updatedAt:
                new Date()
                    .toISOString(),

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

            product:
                products[index],

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                'Gagal update product',

        });

    }

});

// DELETE PRODUCT

app.delete('/api/products/:id', (req, res) => {

    try {

        const { id } =
            req.params;

        const data =
            fs.readFileSync(
                productsFile,
                'utf8'
            );

        const products =
            JSON.parse(data);

        const filtered =
            products.filter(

                (p) =>
                    p.id != id

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
                'Gagal delete product',

        });

    }

});

// =========================
// ORDERS
// =========================

app.get('/api/orders', (req, res) => {

    try {

        const data =
            fs.readFileSync(
                ordersFile,
                'utf8'
            );

        res.json(
            JSON.parse(data)
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                'Gagal membaca orders',

        });

    }

});

// =========================
// SETTINGS
// =========================

app.get('/api/settings', (req, res) => {

    try {

        const data =
            fs.readFileSync(
                settingsFile,
                'utf8'
            );

        res.json(
            JSON.parse(data)
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                'Gagal membaca settings',

        });

    }

});

app.put('/api/settings', (req, res) => {

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
                'Gagal menyimpan settings',

        });

    }

});

// =========================
// IMAGE UPLOAD
// =========================

app.post(
    '/api/upload',
    upload.single('image'),
    (req, res) => {

        try {

            if (!req.file) {

                return res
                    .status(400)
                    .json({

                        error:
                            'No file uploaded',

                    });

            }

            const imageUrl =

                `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            res.json({

                success: true,

                imageUrl,

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                error:
                    'Upload gagal',

            });

        }

    }
);

// =========================
// FRONTEND DIST
// =========================

if (fs.existsSync(distPath)) {

    app.use(
        express.static(distPath)
    );

    app.get('*', (req, res) => {

        res.sendFile(

            path.join(
                distPath,
                'index.html'
            )

        );

    });

}

// =========================
// START SERVER
// =========================

app.listen(
    PORT,
    '0.0.0.0',
    () => {

        console.log(
            `✅ API berjalan di port ${PORT}`
        );

    }
);
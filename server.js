import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ========================================
// PATH
// ========================================

const __filename = fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

// ========================================
// APP
// ========================================

const app = express();

const PORT = process.env.PORT || 3001;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
    origin: '*'
}));

app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({
    extended: true
}));

// ========================================
// DIRECTORIES
// ========================================

const DATA_DIR =
    path.join(__dirname, 'data');

const UPLOADS_DIR =
    path.join(
        __dirname,
        'public',
        'uploads'
    );

[DATA_DIR, UPLOADS_DIR]
    .forEach(dir => {

        if (!fs.existsSync(dir)) {

            fs.mkdirSync(dir, {
                recursive: true
            });

        }

    });

// ========================================
// STATIC
// ========================================

app.use(
    '/uploads',
    express.static(UPLOADS_DIR)
);

// ========================================
// HELPERS
// ========================================

function readData(
    name,
    defaultVal
) {

    const file =
        path.join(
            DATA_DIR,
            `${name}.json`
        );

    try {

        if (!fs.existsSync(file)) {

            return defaultVal;

        }

        return JSON.parse(
            fs.readFileSync(
                file,
                'utf-8'
            )
        );

    } catch {

        return defaultVal;

    }

}

function writeData(
    name,
    data
) {

    const file =
        path.join(
            DATA_DIR,
            `${name}.json`
        );

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2),
        'utf-8'
    );

}

// ========================================
// MULTER
// ========================================

const storage =
    multer.diskStorage({

        destination:
            UPLOADS_DIR,

        filename: (
            req,
            file,
            cb
        ) => {

            const ext =
                path.extname(
                    file.originalname
                ) || '.jpg';

            cb(
                null,
                `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
            );

        }

    });

const upload =
    multer({

        storage,

        limits: {
            fileSize:
                15 * 1024 * 1024
        }

    });

// ========================================
// UPLOAD
// ========================================

app.post(
    '/api/upload',
    upload.single('image'),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                error:
                    'No file uploaded'
            });

        }

        res.json({

            url:
                `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

        });

    }
);

// ========================================
// PRODUCTS
// ========================================

app.get('/api/products', (req, res) => {

    res.json(
        readData(
            'products',
            []
        )
    );

});

app.post('/api/products', (req, res) => {

    const products =
        readData(
            'products',
            []
        );

    const product = {

        id: Date.now(),

        created_date:
            new Date().toISOString(),

        ...req.body,

    };

    products.unshift(product);

    writeData(
        'products',
        products
    );

    res.status(201).json(product);

});

app.put('/api/products/bulk', (req, res) => {

    const products =
        Array.isArray(req.body)
            ? req.body
            : [];

    writeData(
        'products',
        products
    );

    res.json(products);

});

app.put('/api/products/:id', (req, res) => {

    const products =
        readData(
            'products',
            []
        );

    const idx =
        products.findIndex(

            p =>
                String(p.id) ===
                String(req.params.id)

        );

    if (idx === -1) {

        return res.status(404).json({
            error: 'Not found'
        });

    }

    products[idx] = {

        ...products[idx],

        ...req.body,

    };

    writeData(
        'products',
        products
    );

    res.json(products[idx]);

});

app.delete('/api/products/:id', (req, res) => {

    const products =
        readData(
            'products',
            []
        );

    writeData(

        'products',

        products.filter(

            p =>
                String(p.id) !==
                String(req.params.id)

        )

    );

    res.json({
        ok: true
    });

});

// ========================================
// SETTINGS
// ========================================

app.get('/api/settings', (req, res) => {

    res.json(
        readData(
            'settings',
            {}
        )
    );

});

app.put('/api/settings', (req, res) => {

    writeData(
        'settings',
        req.body
    );

    res.json(req.body);

});

// ========================================
// ORDERS
// ========================================

app.get('/api/orders', (req, res) => {

    res.json(
        readData(
            'orders',
            []
        )
    );

});

app.post('/api/orders', (req, res) => {

    const orders =
        readData(
            'orders',
            []
        );

    const order = {

        id:
            req.body.id ||
            `ORD-${Date.now()}`,

        created_at:
            new Date().toISOString(),

        ...req.body,

    };

    orders.push(order);

    writeData(
        'orders',
        orders
    );

    res.status(201).json(order);

});

app.put('/api/orders/:id', (req, res) => {

    const orders =
        readData(
            'orders',
            []
        );

    const idx =
        orders.findIndex(

            o =>
                o.id ===
                req.params.id

        );

    if (idx === -1) {

        return res.status(404).json({
            error: 'Not found'
        });

    }

    orders[idx] = {

        ...orders[idx],

        ...req.body,

    };

    writeData(
        'orders',
        orders
    );

    res.json(orders[idx]);

});

app.delete('/api/orders/:id', (req, res) => {

    const orders =
        readData(
            'orders',
            []
        );

    writeData(

        'orders',

        orders.filter(

            o =>
                o.id !==
                req.params.id

        )

    );

    res.json({
        ok: true
    });

});

// ========================================
// START
// ========================================

app.listen(
    PORT,
    '0.0.0.0',
    () => {

        console.log(
            `\n✅ Vezberry API Server berjalan di https://vezberry-app-production.up.railway.app`
        );

        console.log(
            `📱 Akses HP gunakan: http://192.168.18.167:${PORT}\n`
        );

    }
);
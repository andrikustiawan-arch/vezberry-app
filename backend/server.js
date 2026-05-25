import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================
// FILE PATHS
// =========================

const productsFile = path.join(__dirname, 'data', 'products.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// =========================
// MULTER
// =========================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// =========================
// ROUTES
// =========================

// TEST
app.get('/', (req, res) => {
    res.send('VEZBERRY BACKEND RUNNING');
});

// GET PRODUCTS
app.get('/api/products', (req, res) => {
    try {
        const data = fs.readFileSync(productsFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Gagal membaca products',
        });
    }
});

// GET ORDERS
app.get('/api/orders', (req, res) => {
    try {
        const data = fs.readFileSync(ordersFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Gagal membaca orders',
        });
    }
});

// UPLOAD IMAGE
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            imageUrl,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Upload gagal',
        });
    }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API berjalan di port ${PORT}`);
});

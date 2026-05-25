{
    "name": "Product",
        "type": "object",

            "properties": {

        "name": {
            "type": "string",
                "description": "Nama produk"
        },

        "category": {
            "type": "string",

                "enum": [
                    "pizzanezia",
                    "tasty_bready",
                    "legendary_snack",
                    "fingery_snack",
                    "fresh_drink"
                ],

                    "description": "Kategori produk"
        },

        "price": {
            "type": "number",
                "description": "Harga produk"
        },

        "description": {
            "type": "string",
                "description": "Deskripsi produk"
        },

        "image_url": {
            "type": "string",
                "description": "URL gambar produk"
        },

        "discount_percentage": {
            "type": "number",
                "description": "Persentase diskon (0-100)",
                    "default": 0
        },

        "stock": {
            "type": "number",
                "description": "Jumlah stok",
                    "default": 0
        },

        "is_preorder": {
            "type": "boolean",
                "description": "Apakah produk pre-order",
                    "default": false
        },

        "preorder_deadline": {
            "type": "string",
                "format": "date",
                    "description": "Batas waktu pre-order"
        },

        "ready_after_days": {
            "type": "number",
                "description": "Jumlah hari produk siap setelah order",
                    "default": 0
        },

        "daily_capacity": {
            "type": "number",
                "description": "Kapasitas produksi per hari",
                    "default": 0
        },

        "auto_close_preorder": {
            "type": "boolean",
                "description": "Tutup otomatis jika kapasitas penuh",
                    "default": true
        },

        "show_preorder_badge": {
            "type": "boolean",
                "description": "Tampilkan badge preorder",
                    "default": true
        },

        "is_hidden": {
            "type": "boolean",
                "description": "Sembunyikan produk dari etalase",
                    "default": false
        },

        "total_sold": {
            "type": "number",
                "description": "Jumlah total produk terjual",
                    "default": 0
        },

        "preorder_closed": {
            "type": "boolean",
                "description": "Status PO ditutup otomatis",
                    "default": false
        },

        "estimated_ready_time": {
            "type": "string",
                "description": "Estimasi jam produk siap"
        },

        "enable_kitchen_print": {
            "type": "boolean",
                "description": "Cetak ke printer kitchen",
                    "default": true
        }

    },

    "required": [
        "name",
        "category",
        "price"
    ]
}
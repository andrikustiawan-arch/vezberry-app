{
    "name": "CartItem",
        "type": "object",
            "properties": {
        "product_id": {
            "type": "string",
                "description": "ID produk"
        },
        "product_name": {
            "type": "string",
                "description": "Nama produk"
        },
        "price": {
            "type": "number",
                "description": "Harga per item"
        },
        "quantity": {
            "type": "number",
                "description": "Jumlah item"
        },
        "category": {
            "type": "string",
                "description": "Kategori produk"
        }
    },
    "required": [
        "product_id",
        "product_name",
        "price",
        "quantity"
    ]
}
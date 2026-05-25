{
    "name": "Order",
    "type": "object",
    "properties": {
        "customer_name": {
            "type": "string",
            "description": "Nama pelanggan"
        },
        "customer_phone": {
            "type": "string",
            "description": "Nomor telepon"
        },
        "customer_email": {
            "type": "string",
            "description": "Email pelanggan"
        },
        "items": {
            "type": "array",
            "description": "Daftar item pesanan",
            "items": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string"
                    },
                    "quantity": {
                        "type": "number"
                    },
                    "price": {
                        "type": "number"
                    }
                }
            }
        },
        "total_amount": {
            "type": "number",
            "description": "Total pembayaran"
        },
        "status": {
            "type": "string",
            "enum": [
                "pending",
                "in_order",
                "paid",
                "completed",
                "cancelled"
            ],
            "default": "pending"
        },
        "payment_method": {
            "type": "string",
            "enum": [
                "qris",
                "cash"
            ],
            "default": "qris"
        },
        "notes": {
            "type": "string",
            "description": "Catatan pesanan"
        }
    },
    "required": [
        "customer_name",
        "items",
        "total_amount"
    ]
}
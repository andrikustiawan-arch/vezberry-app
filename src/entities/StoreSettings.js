{
    "name": "StoreSettings",
        "type": "object",
            "properties": {
        "store_name": {
            "type": "string",
                "description": "Nama toko"
        },
        "tagline": {
            "type": "string",
                "description": "Tagline toko"
        },
        "logo_url": {
            "type": "string",
                "description": "URL logo toko"
        },
        "store_photo_url": {
            "type": "string",
                "description": "URL foto toko"
        },
        "address": {
            "type": "string",
                "description": "Alamat toko"
        },
        "whatsapp": {
            "type": "string",
                "description": "Nomor WhatsApp"
        },
        "whatsapp_link": {
            "type": "string",
                "description": "Link WhatsApp (wa.me/...)"
        },
        "instagram": {
            "type": "string",
                "description": "Username Instagram"
        },
        "instagram_link": {
            "type": "string",
                "description": "Link Instagram"
        },
        "email": {
            "type": "string",
                "description": "Email toko"
        },
        "banner_images": {
            "type": "array",
                "items": {
                "type": "string"
            },
            "description": "URL gambar banner/slideshow"
        },
        "open_time": {
            "type": "string",
                "description": "Jam buka (format HH:mm)",
                    "default": "08:00"
        },
        "close_time": {
            "type": "string",
                "description": "Jam tutup (format HH:mm)",
                    "default": "21:00"
        },
        "is_open": {
            "type": "boolean",
                "description": "Status toko buka/tutup manual",
                    "default": true
        },
        "qris_image_url": {
            "type": "string",
                "description": "URL gambar QRIS toko"
        }
    },
    "required": [
        "store_name"
    ]
}
const BASE = 'http://192.168.18.167:3001/api';

// ========================================
// REQUEST HELPER
// ========================================

async function req(
    method,
    urlPath,
    data,
    isFormData = false
) {

    const opts = {
        method,
    };

    if (data) {

        if (isFormData) {

            opts.body = data;

        } else {

            opts.headers = {
                'Content-Type': 'application/json',
            };

            opts.body =
                JSON.stringify(data);

        }

    }

    const res = await fetch(
        `${BASE}${urlPath}`,
        opts
    );

    // ERROR HANDLER

    if (!res.ok) {

        const text =
            await res.text()
                .catch(() => '');

        throw new Error(
            `API ${method} ${urlPath} gagal (${res.status}): ${text}`
        );

    }

    // RETURN JSON

    return res.json();

}

// ========================================
// API
// ========================================

export const api = {

    // ========================================
    // PRODUCTS
    // ========================================

    products: {

        list: () =>
            req('GET', '/products'),

        create: (data) =>
            req('POST', '/products', data),

        update: (id, data) =>
            req('PUT', `/products/${id}`, data),

        bulkUpdate: (data) =>
            req('PUT', '/products/bulk', data),

        delete: (id) =>
            req('DELETE', `/products/${id}`),

    },

    // ========================================
    // SETTINGS
    // ========================================

    settings: {

        get: () =>
            req('GET', '/settings'),

        save: (data) =>
            req('PUT', '/settings', data),

    },

    // ========================================
    // ORDERS
    // ========================================

    orders: {

        list: () =>
            req('GET', '/orders'),

        create: (data) =>
            req('POST', '/orders', data),

        update: (id, data) =>
            req('PUT', `/orders/${id}`, data),

        delete: (id) =>
            req('DELETE', `/orders/${id}`),

    },

    // ========================================
    // IMAGE UPLOAD
    // ========================================

    upload: async (file) => {

        const form =
            new FormData();

        form.append(
            'image',
            file
        );

        return req(
            'POST',
            '/upload',
            form,
            true
        );

    },

};
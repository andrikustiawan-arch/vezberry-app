const BASE =
    'https://vezberry-api-production.up.railway.app/api';

// ========================================
// REQUEST HELPER
// ========================================

async function req(
    method,
    urlPath,
    data,
    isFormData = false
) {

    const url =
        `${BASE}${urlPath}`;

    const opts = {
        method,
    };

    // ========================================
    // BODY
    // ========================================

    if (data) {

        if (isFormData) {

            opts.body = data;

        } else {

            opts.headers = {
                'Content-Type':
                    'application/json',
            };

            opts.body =
                JSON.stringify(data);

        }

    }

    // ========================================
    // DEBUG
    // ========================================

    console.log(
        'API REQUEST:',
        method,
        url
    );

    console.log(
        'API OPTIONS:',
        opts
    );

    try {

        const res =
            await fetch(
                url,
                opts
            );

        console.log(
            'API STATUS:',
            res.status
        );

        // ========================================
        // ERROR HANDLER
        // ========================================

        if (!res.ok) {

            const text =
                await res.text()
                    .catch(() => '');

            console.error(
                'API ERROR:',
                text
            );

            throw new Error(
                `API ${method} ${urlPath} gagal (${res.status}): ${text}`
            );

        }

        // ========================================
        // RESPONSE JSON
        // ========================================

        const json =
            await res.json();

        console.log(
            'API RESPONSE:',
            json
        );

        return json;

    } catch (err) {

        console.error(
            'FETCH ERROR:',
            err
        );

        throw err;

    }

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
            req(
                'GET',
                '/products'
            ),

        create: (data) =>
            req(
                'POST',
                '/products',
                data
            ),

        update: (id, data) =>
            req(
                'PUT',
                `/products/${id}`,
                data
            ),

        bulkUpdate: (data) =>
            req(
                'PUT',
                '/products/bulk',
                data
            ),

        delete: (id) =>
            req(
                'DELETE',
                `/products/${id}`
            ),

    },

    // ========================================
    // SETTINGS
    // ========================================

    settings: {

        get: () =>
            req(
                'GET',
                '/settings'
            ),

        save: (data) =>
            req(
                'PUT',
                '/settings',
                data
            ),

    },

    // ========================================
    // ORDERS
    // ========================================

    orders: {

        list: () =>
            req(
                'GET',
                '/orders'
            ),

        create: (data) =>
            req(
                'POST',
                '/orders',
                data
            ),

        update: (id, data) =>
            req(
                'PUT',
                `/orders/${id}`,
                data
            ),

        delete: (id) =>
            req(
                'DELETE',
                `/orders/${id}`
            ),

    },

    // ========================================
    // IMAGE UPLOAD
    // ========================================

    upload: async (file) => {

        console.log(
            'UPLOAD FILE:',
            file
        );

        // VALIDASI
        if (
            !file ||
            !(
                file instanceof File ||
                file instanceof Blob
            )
        ) {

            throw new Error(
                'File upload tidak valid'
            );

        }

        const form =
            new FormData();

        form.append(
            'image',
            file
        );

        console.log(
            'FORM DATA READY'
        );

        return req(
            'POST',
            '/upload',
            form,
            true
        );

    },

};
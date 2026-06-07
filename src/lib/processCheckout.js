import { api } from "@/lib/api";

import {
    applyPreorderCapacityLogic,
} from "@/utils/preorder";

import {
    saveDeviceOrderId,
    createOrderIdFromPhone,
} from "@/utils";

import {
    formatPreorderDate,
} from "@/utils/preorderUtils";

export const processCheckout = async ({

    orderData,

    cart,

    orders,

    dbProducts,

    totalPrice,

    paymentMethod,

    setOrders,

    setDbProducts,

    setCart,

    setCartOpen,

    toast,

}) => {

    const paymentLabel =

        paymentMethod === "cash"

            ? "Cash di Toko/Booth"

            : "Transfer / QRIS";

    // ========================================
    // ORDER ID
    // ========================================

    const orderId = createOrderIdFromPhone(orderData.phone);

    // ========================================
    // ORDER OBJECT
    // ========================================

    const computedTotal = cart.reduce(
        (sum, item) =>
            sum +
            ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
        0
    );

    const actualTotal =
        typeof totalPrice === "number" && totalPrice > 0
            ? totalPrice
            : computedTotal;

    const newOrder = {

        id: orderId,

        ...orderData,

        items: cart,

        total_amount: actualTotal,

        payment_method: paymentMethod,

        status: "pending",

        created_at:
            new Date().toISOString(),

    };

    // ========================================
    // SAVE ORDER
    // ========================================

    try {
        await api.orders.create(newOrder);
    } catch (err) {
        console.error("Gagal simpan order:", err);
        throw new Error("Gagal menyimpan order. Silakan coba lagi.");
    }

    const updatedOrders = [
        ...orders,
        newOrder,
    ];

    const updatedProducts = applyPreorderCapacityLogic(
        dbProducts,
        updatedOrders
    );

    try {
        await api.products.bulkUpdate(updatedProducts);
    } catch (err) {
        console.error("Gagal update produk:", err);
        throw new Error("Gagal memperbarui produk. Silakan coba lagi.");
    }

    // ========================================
    // SAVE DEVICE-LOCAL ORDER ID
    // ========================================

    saveDeviceOrderId(orderId);

    // ========================================
    // UPDATE LOCAL STATE AFTER SUCCESS
    // ========================================

    if (setOrders) {
        setOrders(updatedOrders);
    }

    if (setDbProducts) {
        setDbProducts(updatedProducts);
    }

    // ========================================
    // CLEAR CART
    // ========================================

    if (setCart) {
        setCart([]);
    }

    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(
                "vezberry_cart",
                JSON.stringify([])
            );
        } catch (err) {
            console.warn("Gagal membersihkan keranjang lokal:", err);
        }
    }

    // ========================================
    // CLOSE DRAWER
    // ========================================

    if (setCartOpen) {
        setCartOpen(false);
    }

    // ========================================
    // SUCCESS TOAST
    // ========================================

    toast.success("Pesanan berhasil dibuat! Membuka WhatsApp...");

    // ========================================
    // WHATSAPP MESSAGE
    // ========================================

    const itemLines =
        cart.map(
            (
                item,
                index
            ) => {

                const preorderInfo =
                    item.is_preorder
                        ? `

⚠️ PREORDER
📅 Produk siap:
${formatPreorderDate(item)}`
                        : "";

                return `${index + 1}. ${item.name || item.product_name}
• Qty: ${item.quantity}
• Subtotal: Rp${(
                        item.price *
                        item.quantity
                    ).toLocaleString("id-ID")}${preorderInfo}`;

            }
        );

    const messageLines = [
        "Assalamu'alaikum VEZBERRY 🍓",
        // single blank line separator intentionally kept minimal
        "Saya ingin memesan:",
        ...itemLines,
        "━━━━━━━━━━━━━━━",
        `TOTAL:\nRp${actualTotal.toLocaleString("id-ID")}`,
        "━━━━━━━━━━━━━━━",
        "Metode Pembayaran:",
        `✅ ${paymentLabel}`,
        "",
        "Data Pemesan:",
        `👤 Nama: ${orderData.customer_name || "-"}`,
        `📱 Nomor WhatsApp: ${orderData.phone || "-"}`,
        `📍 Alamat: ${orderData.customer_address || "-"}`,
        `📝 Catatan: ${orderData.notes || "-"}`,
        "",
        "Terima kasih 🙏",
    ];

    const message = messageLines.join("\n");

    const phone =
        "6282120012025";

    const waUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Return waUrl so caller can open it synchronously (to avoid popup blockers)
    return waUrl;

};
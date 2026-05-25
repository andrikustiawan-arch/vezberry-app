import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top;

export function createPageUrl(pageName) {
    return `/${pageName.toLowerCase()}`
}

const DEVICE_ID_STORAGE_KEY = "vezberry.deviceId";
const DEVICE_ORDER_IDS_STORAGE_KEY = "vezberry.deviceOrderIds";

export function getDeviceId() {
    if (typeof window === "undefined") {
        return null;
    }

    let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

    if (!deviceId) {
        deviceId = window.crypto?.randomUUID?.() || `vezberry-device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
    }

    return deviceId;
}

export function saveDeviceOrderId(orderId) {
    if (typeof window === "undefined" || !orderId) {
        return;
    }

    const deviceId = getDeviceId();
    if (!deviceId) {
        return;
    }

    const stored = JSON.parse(localStorage.getItem(DEVICE_ORDER_IDS_STORAGE_KEY) || "{}") || {};
    const deviceOrders = Array.isArray(stored[deviceId]) ? stored[deviceId] : [];

    if (!deviceOrders.includes(orderId)) {
        stored[deviceId] = [...deviceOrders, orderId];
        localStorage.setItem(DEVICE_ORDER_IDS_STORAGE_KEY, JSON.stringify(stored));
    }
}

export function getDeviceOrderIds() {
    if (typeof window === "undefined") {
        return [];
    }

    const deviceId = getDeviceId();
    if (!deviceId) {
        return [];
    }

    const stored = JSON.parse(localStorage.getItem(DEVICE_ORDER_IDS_STORAGE_KEY) || "{}") || {};
    return Array.isArray(stored[deviceId]) ? stored[deviceId] : [];
}

export function getOrderTotal(order) {
    const amount = Number(order?.total_amount || order?.total || 0);
    if (amount > 0) {
        return amount;
    }

    if (!Array.isArray(order?.items)) {
        return 0;
    }

    return order.items.reduce(
        (sum, item) =>
            sum +
            ((Number(item?.price) || 0) * (Number(item?.quantity) || 0)),
        0
    );
}

export function createOrderIdFromPhone(phone) {
    const normalized = String(phone || "").replace(/\D/g, "");
    const last4 = normalized.slice(-4).padStart(4, "0");

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${last4}${year}${month}${day}${hour}${minute}`;
}

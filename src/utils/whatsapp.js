// ========================================
// WHATSAPP HELPER
// ========================================

export const normalizeWhatsApp = (
    phone = ""
) => {

    const digits =
        String(phone)
            .replace(/\D/g, "");

    if (!digits) return "";

    if (digits.startsWith("62"))
        return digits;

    if (digits.startsWith("0"))
        return `62${digits.slice(1)}`;

    if (digits.startsWith("8"))
        return `62${digits}`;

    return digits;

};

export const getWhatsAppLink = (
    settings,
    message = ""
) => {

    const phone =
        normalizeWhatsApp(
            settings?.whatsapp || ""
        );

    if (!phone) {
        return "#";
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

};
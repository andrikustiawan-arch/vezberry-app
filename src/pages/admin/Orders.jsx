import {
    useEffect,
    useMemo,
    useState,
    useCallback,
} from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import { api } from "@/lib/api";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Button,
} from "@/components/ui/button";

import {
    Checkbox,
} from "@/components/ui/checkbox";

import {
    Input,
} from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Search,
    Trash2,
    Eye,
    ShoppingCart,
    Clock3,
    CheckCircle2,
    XCircle,
    PackageCheck,
    User,
    Phone,
    Wallet,
    Printer,
    ChefHat,
    Download,
    CalendarDays,
    Package,
    ChevronDown,
    ChevronUp,
    FileText,
    MapPin,
    StickyNote,
} from "lucide-react";

import {
    motion,
} from "framer-motion";

import {
    toast,
} from "sonner";

import { jsPDF } from "jspdf";

import { saveAs } from "file-saver";

import {
    getOrderTotal,
} from "@/utils";

import {
    formatPreorderDate,
} from "@/utils/preorderUtils";

// ========================================
// STATUS
// ========================================

const statuses = [

    {
        value: "pending",
        label: "Pending",
        color:
            "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock3,
    },

    {
        value: "diproses",
        label: "Diproses",
        color:
            "bg-blue-100 text-blue-700 border-blue-200",
        icon: PackageCheck,
    },

    {
        value: "selesai",
        label:
            "Selesai",
        color:
            "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
    },

    {
        value:
            "dibatalkan",
        label:
            "Dibatalkan",
        color:
            "bg-red-100 text-red-700 border-red-200",
        icon:
            XCircle,
    },

];

const getStatusLabel = (status) => {

    const found = statuses.find(
        s => s.value === status
    );

    return found?.label || status || "-";

};

const workflowStages = [
    {
        key: "responded",
        label: "Sudah Direspon",
        negativeLabel: "Belum Direspon",
    },
    {
        key: "paid",
        label: "Sudah Bayar",
        negativeLabel: "Belum Bayar",
    },
    {
        key: "ready",
        label: "Sudah Siap",
        negativeLabel: "Belum Siap",
    },
    {
        key: "pickedUp",
        label: "Sudah Diambil",
        negativeLabel: "Belum Diambil",
    },
];

const workflowStatusLabels = {
    responded: "Pesanan diterima (Respon)",
    paid: "Pembayaran Lunas (Bayar)",
    ready: "Pesanan siap (Siap)",
    pickedUp: "Pesanan sudah diambil/diantar (Ambil)",
};

const getLatestWorkflowStatusLabel = (order) => {
    if (order?.workflow?.pickedUp) return workflowStatusLabels.pickedUp;
    if (order?.workflow?.ready) return workflowStatusLabels.ready;
    if (order?.workflow?.paid) return workflowStatusLabels.paid;
    if (order?.workflow?.responded) return workflowStatusLabels.responded;
    return "Pesanan belum diproses";
};

const formatWhatsAppNumber = (phone = "") => {
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("8")) return `62${digits}`;
    return digits;
};

const sendOrderReceiptToCustomer = (order) => {
    const phone = formatWhatsAppNumber(order?.phone || "");
    if (!phone) {
        toast.error("Nomor WhatsApp customer tidak tersedia");
        return;
    }

    const itemsText = (order.items || [])
        .map((item, index) =>
            `${index + 1}. ${item.product_name || item.name || "-"}
   Qty: ${item.quantity}
   Harga: Rp ${Number(item.price || 0).toLocaleString("id-ID")}
   Subtotal: Rp ${(
                (Number(item.price) || 0) *
                (Number(item.quantity) || 0)
            ).toLocaleString("id-ID")}
${item.is_preorder
                ? `

⚠️ PREORDER
📅 Produk siap:
${formatPreorderDate(item)}`
                : ""
            }`
        )
        .join("\n\n");

    const message = [
        `Halo ${order.customer_name || "Customer"},`,
        "",
        "Ini struk pesanan Anda dari VEZBERRY.",
        "",
        `Order ID: ${order.id}`,
        `Status terbaru: ${getLatestWorkflowStatusLabel(order)}`,
        `Total: Rp ${getOrderTotal(order).toLocaleString("id-ID")}`,
        "",
        "Detail pesanan:",
        itemsText,
        "",
        "Terima kasih. Silakan balas pesan ini jika ada pertanyaan.",
    ].join("\n");

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
};

// ========================================
// PRINT THERMAL RECEIPT
// ========================================



// ========================================
// KITCHEN PRINT
// ========================================

const buildKitchenHTML = (order) => {

    const itemsHtml =
        (order.items || [])
            .map((item) => {

                return `
<div style="
padding:10px 0;
border-bottom:1px dashed #000;
">

<div style="
font-weight:bold;
font-size:18px;
">

${item.product_name || item.name}

${item.is_preorder ? "(PO)" : ""}

</div>

<div style="
margin-top:5px;
font-size:16px;
">

Qty:
${item.quantity}

</div>

</div>
`;

            })
            .join("");

    return `
<html>

<head>

<title>Kitchen Print</title>

<style>

body{

font-family:Arial,sans-serif;
width:80mm;
padding:12px;
font-size:14px;

}

</style>

</head>

<body>

<h2>
ORDER DAPUR
</h2>

<p>
${order.customer_name || "-"}
</p>

<p>
${new Date(
        order.created_at || Date.now()
    ).toLocaleString("id-ID")}
</p>

<hr/>

${itemsHtml}

<script>

window.onload = () => {

window.print();

setTimeout(() => {

window.close();

}, 500);

};

</script>

</body>

</html>
`;

};



const printKitchen = (order) => {

    try {

        const doc = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: [58, 200],

        });

        let y = 10;

        doc.setFontSize(16);

        doc.text(
            "ORDER DAPUR",
            29,
            y,
            {
                align: "center",
            }
        );

        y += 10;

        doc.setFontSize(9);

        doc.text(
            `Order: ${order.id}`,
            4,
            y
        );

        y += 6;

        doc.text(
            `Customer: ${order.customer_name || "-"}`,
            4,
            y
        );

        y += 8;

        doc.line(4, y, 54, y);

        y += 8;

        (order.items || []).forEach(item => {

            doc.setFontSize(13);

            doc.text(
                `${item.quantity}x`,
                4,
                y
            );

            doc.text(
                `${item.product_name || item.name}`,
                14,
                y
            );

            y += 8;

            if (item.notes) {

                doc.setFontSize(8);

                doc.text(
                    `Catatan: ${item.notes}`,
                    14,
                    y
                );

                y += 6;

            }

        });

        y += 4;

        doc.line(4, y, 54, y);

        y += 8;

        doc.setFontSize(10);

        doc.text(
            "Dapur VEZBERRY",
            29,
            y,
            {
                align: "center",
            }
        );

        doc.save(
            `kitchen-${order.id}.pdf`
        );

    } catch (err) {

        console.log(err);

        toast.error(
            "Gagal membuat PDF dapur"
        );

    }

};

// ========================================
// COMPONENT
// ========================================

export default function OrdersPage() {

    // ========================================
    // STATES
    // ========================================

    const [
        orders,
        setOrders,
    ] = useState([]);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState("all");

    const [
        detailOpen,
        setDetailOpen,
    ] = useState(false);

    const [
        selectedOrder,
        setSelectedOrder,
    ] = useState(null);

    const [
        expandedOrders,
        setExpandedOrders,
    ] = useState({});

    const [
        databaseOpen,
        setDatabaseOpen,
    ] = useState(false);

    const normalizeOrder = useCallback((order) => ({
        ...order,
        workflow: {

            responded:
                order.workflow?.responded ??
                false,

            paid:
                order.workflow?.paid ??
                false,

            ready:
                order.workflow?.ready ??
                false,

            pickedUp:
                order.workflow?.pickedUp ??
                false,
        },
    }), []);

    // ========================================
    // LOAD
    // ========================================

    useEffect(() => {

        api.orders.list()
            .then(data =>
                setOrders(
                    data.map(normalizeOrder)
                )
            )
            .catch(err => console.error("Gagal load orders:", err));

    }, [normalizeOrder]);

    // ========================================
    // SAVE (local state only — API calls are per-operation)
    // ========================================

    const saveOrders =
        useCallback((data) => {

            setOrders(data);

        }, []);

    // ========================================
    // UPDATE STATUS
    // ========================================

    const updateStatus = (
        id,
        status
    ) => {

        const updated =

            orders.map(order =>

                order.id === id

                    ? {
                        ...order,
                        status,
                    }

                    : order

            );

        saveOrders(updated);

        // SIMPAN KE SERVER
        api.orders.update(id, { status })
            .catch(err => console.error("Gagal update status:", err));

        // UPDATE SELECTED ORDER

        if (
            selectedOrder?.id === id
        ) {

            setSelectedOrder({

                ...selectedOrder,

                status,

            });

        }

        toast.success(
            "Status pesanan diperbarui"
        );

    };

    const toggleWorkflow = (
        id,
        key
    ) => {

        const updated = orders.map(order => {
            if (order.id !== id) return order;

            const nextWorkflow = {
                ...order.workflow,
                [key]: !order.workflow?.[key],
            };

            return {
                ...order,
                workflow: nextWorkflow,
            };
        });

        saveOrders(updated);

        const updatedOrder = updated.find(
            order => order.id === id
        );

        if (selectedOrder?.id === id) {
            setSelectedOrder({
                ...selectedOrder,
                workflow: updatedOrder?.workflow,
            });
        }

        if (updatedOrder) {
            api.orders.update(id, {
                workflow: updatedOrder.workflow,
            }).catch(err =>
                console.error(
                    "Gagal update workflow:",
                    err
                )
            );
        }

    };

    // ========================================
    // DELETE
    // ========================================

    const deleteOrder = (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Hapus pesanan ini?"
            );

        if (!confirmDelete)
            return;

        const filtered =

            orders.filter(
                o => o.id !== id
            );

        saveOrders(filtered);

        // HAPUS DARI SERVER
        api.orders.delete(id)
            .catch(err => console.error("Gagal hapus order:", err));

        // CLOSE DETAIL IF DELETED

        if (
            selectedOrder?.id === id
        ) {

            setDetailOpen(false);

            setSelectedOrder(
                null
            );

        }

        toast.success(
            "Pesanan berhasil dihapus"
        );

    };

    // ========================================
    // EXPAND
    // ========================================

    const toggleExpand =
        (orderId) => {

            setExpandedOrders(
                prev => ({
                    ...prev,

                    [orderId]:
                        !prev[
                        orderId
                        ],
                })
            );

        };

    // ========================================
    // FILTER
    // ========================================

    const filteredOrders =
        useMemo(() => {

            return orders.filter(
                order => {

                    const keyword =
                        search.toLowerCase();

                    const searchMatch =

                        (
                            order.customer_name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (
                            order.phone ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (
                            order.id ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword);

                    const statusMatch =

                        selectedStatus ===
                            "all"

                            ? true

                            : order.status ===
                            selectedStatus;

                    return (
                        searchMatch &&
                        statusMatch
                    );

                }
            );

        }, [

            orders,
            search,
            selectedStatus,

        ]);

    // ========================================
    // TOTAL
    // ========================================

    const totalRevenue =
        orders.reduce(
            (sum, order) =>
                sum +
                (
                    getOrderTotal(order)
                ),
            0
        );

    const pendingCount =
        orders.filter(
            o =>
                o.status ===
                "pending"
        ).length;

    // ========================================
    // EXPORT CSV
    // ========================================

    const exportCSV = () => {

        const rows = [

            [
                "Order ID",
                "Customer",
                "Phone",
                "Status",
                "Total",
            ],

            ...orders.map(
                order => [

                    order.id,

                    order.customer_name,

                    order.phone,

                    order.status,

                    getOrderTotal(order),

                ]
            ),

        ];

        const csvContent =
            rows.map(e =>
                e.join(",")
            ).join("\n");

        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `vezberry-orders-${Date.now()}.csv`;

        link.click();

        toast.success(
            "CSV berhasil diunduh"
        );

    };

    // ========================================
    // PRINT RECEIPT
    // ========================================

    const generateReceiptPDF = async (order) => {

        try {

            const doc = new jsPDF({

                orientation: "portrait",

                unit: "mm",

                format: [58, 300],

                compress: true,

            });

            let y = 10;

            doc.setFontSize(14);

            doc.text(
                "VEZBERRY",
                29,
                y,
                {
                    align: "center",
                }
            );

            y += 6;

            doc.setFontSize(8);

            doc.text(
                "Premium Bakery & Dessert",
                29,
                y,
                {
                    align: "center",
                }
            );

            y += 10;

            doc.text(
                `Order ID: ${order.id}`,
                4,
                y
            );

            y += 5;

            doc.text(
                `Status Pesanan: ${getStatusLabel(order.status)}`,
                4,
                y
            );

            y += 5;

            doc.text(
                `Customer: ${order.customer_name || "-"}`,
                4,
                y
            );

            y += 5;

            doc.text(
                `WhatsApp: ${order.phone || "-"}`,
                4,
                y
            );

            y += 5;

            doc.text(
                `Tanggal: ${new Date(
                    order.created_at || Date.now()
                ).toLocaleString("id-ID")}`,
                4,
                y
            );

            y += 8;

            doc.line(4, y, 54, y);

            y += 6;

            (order.items || []).forEach((item) => {

                const subtotal =

                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                doc.setFontSize(9);

                doc.text(
                    `${item.product_name || item.name}`,
                    4,
                    y
                );

                y += 4;

                doc.setFontSize(8);

                doc.text(
                    `${item.quantity} x Rp ${Number(item.price || 0).toLocaleString("id-ID")}`,
                    4,
                    y
                );

                doc.text(
                    `Rp ${subtotal.toLocaleString("id-ID")}`,
                    54,
                    y,
                    {
                        align: "right",
                    }
                );

                y += 5;

                // =====================
                // PREORDER INFO
                // =====================

                if (item.is_preorder) {

                    doc.setFontSize(7);

                    doc.text(
                        "PREORDER",
                        6,
                        y
                    );

                    y += 4;

                    doc.text(
                        `Siap: ${formatPreorderDate(item)}`,
                        6,
                        y
                    );

                    y += 5;

                } else {

                    y += 2;

                }

            });

            doc.line(4, y, 54, y);

            y += 7;

            doc.setFontSize(11);

            doc.text(
                "TOTAL",
                4,
                y
            );

            doc.text(
                `Rp ${getOrderTotal(order).toLocaleString("id-ID")}`,
                54,
                y,
                {
                    align: "right",
                }
            );

            y += 10;

            doc.setFontSize(8);

            const addressLines =
                doc.splitTextToSize(
                    `Alamat: ${order.customer_address || "-"}`,
                    50
                );

            doc.text(
                addressLines,
                4,
                y
            );

            y += addressLines.length * 4;

            y += 4;

            const notesLines =
                doc.splitTextToSize(
                    `Catatan: ${order.notes || "-"}`,
                    50
                );

            doc.text(
                notesLines,
                4,
                y
            );

            y += notesLines.length * 4;

            y += 8;

            doc.text(
                "Terima kasih",
                29,
                y,
                {
                    align: "center",
                }
            );

            // =========================
            // PDF FILE
            // =========================

            const pdfBlob =
                doc.output("blob");

            const pdfFile =
                new File(
                    [pdfBlob],
                    `receipt-${order.id}.pdf`,
                    {
                        type: "application/pdf",
                    }
                );

            // =========================
            // MOBILE SHARE
            // =========================

            const canShareFiles =

                typeof navigator !== "undefined" &&

                navigator.share &&

                navigator.canShare &&

                navigator.canShare({
                    files: [pdfFile],
                });

            if (canShareFiles) {

                await navigator.share({

                    title: "Struk VEZBERRY",

                    text:
                        `Struk Order ${order.id}`,

                    files: [pdfFile],

                });

            } else {

                // =========================
                // WINDOWS / FALLBACK
                // =========================

                saveAs(
                    pdfBlob,
                    `receipt-${order.id}.pdf`
                );

                // =========================
                // OPEN WA
                // =========================

                setTimeout(() => {

                    const phone =
                        (order.phone || "")
                            .replace(/\D/g, "");

                    const message =
                        `Halo ${order.customer_name || ""},

Berikut struk pesanan VEZBERRY 🙏`;

                    window.open(

                        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

                        "_blank"

                    );

                }, 1200);

            }

        } catch (err) {

            console.log(err);

            toast.error(
                "Gagal membuat PDF struk"
            );

        }

    };

    // ========================================
    // DOWNLOAD DETAIL TXT
    // ========================================

    const downloadDetail = (
        order
    ) => {

        const text = `
VEZBERRY

ORDER DETAIL

━━━━━━━━━━━━━━━

Order ID:
${order.id}

Status:
${getLatestWorkflowStatusLabel(order)}

Customer:
${order.customer_name || "-"}

WhatsApp:
${order.phone || "-"}

Alamat:
${order.customer_address || "-"}

Catatan:
${order.notes || "-"}

━━━━━━━━━━━━━━━

ITEMS

${(order.items || [])
                .map(item => `

${item.product_name || item.name}
Qty: ${item.quantity}
Harga: Rp ${Number(item.price || 0).toLocaleString("id-ID")}
Subtotal: Rp ${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("id-ID")}
${item.is_preorder ? `PREORDER
Produk siap: ${formatPreorderDate(item)}` : ""}

`)
                .join("\n")}

━━━━━━━━━━━━━━━

TOTAL:
Rp ${getOrderTotal(order).toLocaleString("id-ID")}

`;

        const blob =
            new Blob(
                [text],
                {
                    type:
                        "text/plain;charset=utf-8",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `order-${order.id}.txt`;

        link.click();

        toast.success(
            "Detail pesanan berhasil diunduh"
        );

    };

    // ========================================
    // UI
    // ========================================

    return (

        <AdminLayout>

            <div className="
                space-y-5
                sm:space-y-6
                md:space-y-8

                pb-[140px]
                md:pb-24
            ">
                {/* HERO */}

                <div className="
                    rounded-[28px]
                    md:rounded-[40px]

                    overflow-hidden

                    bg-gradient-to-r
                    from-[#5c6cff]
                    via-[#8e71ff]
                    to-[#f76d9d]

                    p-5
                    sm:p-6
                    md:p-10

                    text-white

                    relative

                    shadow-[0_20px_60px_rgba(140,90,255,0.25)]
                ">

                    {/* GLOW */}

                    <div className="
                        absolute
                        right-0
                        top-0

                        w-48
                        h-48

                        sm:w-72
                        sm:h-72

                        rounded-full

                        bg-white/10

                        blur-3xl
                    " />

                    <div className="
                        relative
                        z-10

                        flex
                        flex-col
                        lg:flex-row

                        lg:items-center
                        lg:justify-between

                        gap-6
                    ">

                        {/* LEFT */}

                        <div>

                            <div className="
                                inline-flex
                                items-center

                                gap-2

                                rounded-full

                                bg-white/18

                                backdrop-blur-xl

                                px-3
                                py-2

                                text-[11px]
                                sm:text-xs

                                font-bold
                            ">

                                <CalendarDays
                                    size={14}
                                />

                                ORDER MANAGEMENT

                            </div>

                            <h1 className="
                                mt-5

                                text-3xl
                                sm:text-5xl
                                md:text-7xl

                                font-black

                                tracking-tight

                                drop-shadow-sm
                            ">

                                Pesanan

                            </h1>

                            <p className="
                                mt-4

                                max-w-2xl

                                text-sm
                                sm:text-lg
                                md:text-2xl

                                text-white/85

                                leading-relaxed
                            ">

                                Kelola seluruh
                                pesanan customer,
                                preorder,
                                produksi,
                                dan workflow
                                operasional toko.

                            </p>

                        </div>

                        {/* ACTIONS */}

                        <div className="
                            flex
                            flex-wrap

                            gap-3
                        ">

                            <Button

                                onClick={
                                    exportCSV
                                }

                                className="
                                    h-12
                                    sm:h-14

                                    rounded-2xl

                                    bg-white
                                    hover:bg-slate-100

                                    text-slate-900

                                    px-5
                                    sm:px-7

                                    text-sm
                                    sm:text-base

                                    font-black

                                    shadow-xl
                                "
                            >

                                <Download
                                    className="
                                        mr-2
                                        w-5
                                        h-5
                                    "
                                />

                                Export CSV

                            </Button>

                            <Button
                                onClick={() =>
                                    setDatabaseOpen(
                                        true
                                    )
                                }
                                className="
                                    h-12
                                    sm:h-14

                                    rounded-2xl

                                    bg-white
                                    hover:bg-slate-100

                                    text-slate-900

                                    px-5
                                    sm:px-7

                                    text-sm
                                    sm:text-base

                                    font-black

                                    shadow-xl
                                "
                            >

                                <FileText
                                    className="
                                        mr-2
                                        w-5
                                        h-5
                                    "
                                />

                                Daftar Detail

                            </Button>

                        </div>

                    </div>

                </div>

                {/* STATS */}

                <div className="
                    grid
                    grid-cols-2
                    lg:grid-cols-3

                    gap-4
                    sm:gap-5
                ">

                    {/* TOTAL */}

                    <Card className="
                        rounded-[28px]
                        md:rounded-[32px]

                        border-0

                        shadow-xl

                        overflow-hidden
                    ">

                        <CardContent className="
                            p-4
                            sm:p-7
                        ">

                            <div className="
                                flex
                                items-start
                                justify-between

                                gap-4
                            ">

                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        text-sm
                                        sm:text-sm

                                        text-slate-500

                                        font-semibold
                                    ">

                                        Total Penjualan

                                    </p>

                                    <h2 className="
                                        mt-3

                                        text-xl
                                        sm:text-2xl
                                        md:text-3xl

                                        font-black

                                        text-slate-800

                                        break-words
                                    ">

                                        Rp {

                                            totalRevenue.toLocaleString(
                                                "id-ID"
                                            )

                                        }

                                    </h2>

                                </div>

                                <div className="
                                    w-12
                                    h-12

                                    sm:w-16
                                    sm:h-16

                                    rounded-3xl

                                    bg-pink-100

                                    flex
                                    items-center
                                    justify-center

                                    shrink-0
                                ">

                                    <Wallet
                                        className="
                                            text-pink-500
                                        "
                                        size={28}
                                    />

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    {/* TOTAL ORDER */}

                    <Card className="
                        rounded-[28px]
                        md:rounded-[32px]

                        border-0

                        shadow-xl

                        overflow-hidden
                    ">

                        <CardContent className="
                            p-4
                            sm:p-7
                        ">

                            <div className="
                                flex
                                items-start
                                justify-between

                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        sm:text-sm

                                        text-slate-500

                                        font-semibold
                                    ">

                                        Total Order

                                    </p>

                                    <h2 className="
                                        mt-3

                                        text-2xl
                                        sm:text-4xl

                                        font-black

                                        text-slate-800
                                    ">

                                        {
                                            orders.length
                                        }

                                    </h2>

                                </div>

                                <div className="
                                    w-12
                                    h-12

                                    sm:w-16
                                    sm:h-16

                                    rounded-3xl

                                    bg-blue-100

                                    flex
                                    items-center
                                    justify-center

                                    shrink-0
                                ">

                                    <ShoppingCart
                                        className="
                                            text-blue-500
                                        "
                                        size={28}
                                    />

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    {/* PENDING */}

                    <Card className="
                        rounded-[28px]
                        md:rounded-[32px]

                        border-0

                        shadow-xl

                        overflow-hidden

                        col-span-2
                        lg:col-span-1
                    ">
                        <CardContent className="
                            p-4
                            sm:p-7
                        ">

                            <div className="
                                flex
                                items-start
                                justify-between

                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        sm:text-sm

                                        text-slate-500

                                        font-semibold
                                    ">

                                        Pending

                                    </p>

                                    <h2 className="
                                        mt-3

                                        text-2xl
                                        sm:text-4xl

                                        font-black

                                        text-slate-800
                                    ">

                                        {
                                            pendingCount
                                        }

                                    </h2>

                                </div>

                                <div className="
                                    w-12
                                    h-12

                                    sm:w-16
                                    sm:h-16

                                    rounded-3xl

                                    bg-amber-100

                                    flex
                                    items-center
                                    justify-center

                                    shrink-0
                                ">

                                    <Clock3
                                        className="
                                            text-amber-500
                                        "
                                        size={28}
                                    />

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                </div>

                {/* FILTER */}

                <Card className="
                    sticky
                    top-[76px]
                    lg:top-6

                    z-20

                    rounded-[28px]
                    md:rounded-[32px]

                    border-0

                    shadow-xl

                    backdrop-blur-xl

                    bg-white/90
                ">

                    <CardContent className="
                        p-4
                        sm:p-6

                        flex
                        flex-col
                        lg:flex-row

                        gap-4
                        sm:gap-5
                    ">

                        {/* SEARCH */}

                        <div className="
                            relative
                            flex-1
                        ">

                            <Search
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2

                                    text-slate-400
                                "
                                size={20}
                            />

                            <Input

                                placeholder="
Cari customer / WA / order ID..."

                                value={search}

                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }

                                className="
                                    h-12
                                    sm:h-14

                                    rounded-2xl

                                    pl-12

                                    text-[16px]
                                    sm:text-base
                                "
                            />

                        </div>

                        {/* STATUS */}

                        <select

                            value={
                                selectedStatus
                            }

                            onChange={(e) =>
                                setSelectedStatus(
                                    e.target.value
                                )
                            }

                            className="
                                h-12
                                sm:h-14

                                rounded-2xl

                                border
                                border-slate-200

                                px-5

                                bg-white

                                min-w-full
                                lg:min-w-[220px]

                                text-[16px]
                                sm:text-base

                                font-semibold
                            "
                        >
                            <option value="all">
                                Semua Status
                            </option>

                            {statuses.map(
                                status => (

                                    <option
                                        key={
                                            status.value
                                        }

                                        value={
                                            status.value
                                        }
                                    >

                                        {
                                            status.label
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </CardContent>

                </Card>

                {/* ORDERS */}

                <div className="
                    grid
                    gap-4
                    sm:gap-6
                ">

                    {filteredOrders.map(
                        order => {

                            const statusData =
                                statuses.find(
                                    s =>
                                        s.value ===
                                        order.status
                                );

                            const StatusIcon =
                                statusData?.icon;

                            const expanded =
                                expandedOrders[
                                order.id
                                ];

                            return (

                                <motion.div

                                    key={
                                        order.id
                                    }

                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}

                                    transition={{
                                        duration: 0.2,
                                    }}
                                >

                                    <Card className="
                                        rounded-[28px]
                                        md:rounded-[36px]

                                        border-0

                                        shadow-xl

                                        overflow-hidden
                                    ">

                                        <CardContent className="
                                            p-4
                                            sm:p-6
                                            md:p-7
                                        ">

                                            {/* TOP */}

                                            <div className="
                                                flex
                                                flex-col
                                                xl:flex-row

                                                xl:items-start
                                                xl:justify-between

                                                gap-6
                                            ">

                                                {/* LEFT */}

                                                <div className="
                                                    flex-1
                                                    min-w-0
                                                ">

                                                    {/* NAME */}

                                                    <div className="
                                                        flex
                                                        flex-wrap

                                                        items-center

                                                        gap-3
                                                    ">

                                                        <h2 className="
                                                            text-2xl
                                                            sm:text-3xl

                                                            font-black

                                                            text-slate-800

                                                            break-words
                                                        ">

                                                            {
                                                                order.customer_name
                                                            }

                                                        </h2>

                                                        <div className={`
                                                            h-10

                                                            px-4

                                                            rounded-full

                                                            border

                                                            flex
                                                            items-center

                                                            gap-2

                                                            text-xs
                                                            sm:text-sm

                                                            font-black

                                                            ${statusData?.color}
                                                        `}>

                                                            <StatusIcon
                                                                size={16}
                                                            />

                                                            {
                                                                statusData?.label
                                                            }

                                                        </div>

                                                    </div>
                                                    {/* INFO */}

                                                    <div className="
                                                        mt-5

                                                        flex
                                                        flex-wrap

                                                        gap-3
                                                        sm:gap-5
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center

                                                            gap-2

                                                            text-slate-600

                                                            text-sm
                                                            sm:text-base
                                                        ">

                                                            <Phone
                                                                size={18}
                                                            />

                                                            <span className="
                                                                break-all
                                                            ">

                                                                {
                                                                    order.phone
                                                                }

                                                            </span>

                                                        </div>

                                                        <div className="
                                                            flex
                                                            items-center

                                                            gap-2

                                                            text-slate-600

                                                            text-sm
                                                            sm:text-base
                                                        ">

                                                            <Wallet
                                                                size={18}
                                                            />

                                                            Rp {

                                                                getOrderTotal(order).toLocaleString(
                                                                    "id-ID"
                                                                )

                                                            }

                                                        </div>

                                                    </div>

                                                    {/* ADDRESS */}

                                                    {order.customer_address && (

                                                        <div className="
                                                            mt-4

                                                            flex
                                                            items-start

                                                            gap-3

                                                            rounded-3xl

                                                            bg-slate-50

                                                            border
                                                            border-slate-100

                                                            p-4
                                                        ">

                                                            <MapPin
                                                                size={18}
                                                                className="
                                                                    mt-1

                                                                    text-pink-500

                                                                    shrink-0
                                                                "
                                                            />

                                                            <div>

                                                                <p className="
                                                                    text-xs

                                                                    font-bold

                                                                    text-slate-500

                                                                    uppercase
                                                                ">

                                                                    Alamat

                                                                </p>

                                                                <p className="
                                                                    mt-1

                                                                    text-sm
                                                                    sm:text-base

                                                                    text-slate-700

                                                                    leading-relaxed
                                                                ">

                                                                    {
                                                                        order.customer_address
                                                                    }

                                                                </p>

                                                            </div>

                                                        </div>

                                                    )}

                                                    {/* NOTES */}

                                                    {order.notes && (

                                                        <div className="
                                                            mt-4

                                                            flex
                                                            items-start

                                                            gap-3

                                                            rounded-3xl

                                                            bg-yellow-50

                                                            border
                                                            border-yellow-100

                                                            p-4
                                                        ">

                                                            <StickyNote
                                                                size={18}
                                                                className="
                                                                    mt-1

                                                                    text-yellow-500

                                                                    shrink-0
                                                                "
                                                            />

                                                            <div>

                                                                <p className="
                                                                    text-xs

                                                                    font-bold

                                                                    text-yellow-700

                                                                    uppercase
                                                                ">

                                                                    Catatan

                                                                </p>

                                                                <p className="
                                                                    mt-1

                                                                    text-sm
                                                                    sm:text-base

                                                                    text-yellow-700

                                                                    leading-relaxed
                                                                ">

                                                                    {
                                                                        order.notes
                                                                    }

                                                                </p>

                                                            </div>

                                                        </div>

                                                    )}

                                                    {/* PREORDER INFO */}

                                                    {(order.items || [])
                                                        .some(
                                                            item =>
                                                                item.is_preorder
                                                        ) && (

                                                            <div className="
                                                                mt-5

                                                                rounded-3xl

                                                                border
                                                                border-orange-200

                                                                bg-orange-50

                                                                p-4

                                                                text-orange-700
                                                            ">

                                                                <div className="
                                                                    flex
                                                                    items-start

                                                                    gap-3
                                                                ">

                                                                    <Package
                                                                        size={20}
                                                                        className="
                                                                            shrink-0
                                                                            mt-0.5
                                                                        "
                                                                    />

                                                                    <div>

                                                                        <p className="
                                                                            text-sm
                                                                            sm:text-base

                                                                            font-black
                                                                        ">

                                                                            Produk Preorder

                                                                        </p>

                                                                        <p className="
                                                                            mt-1

                                                                            text-xs
                                                                            sm:text-sm

                                                                            leading-relaxed
                                                                        ">

                                                                            Customer memiliki item preorder.
                                                                            Pastikan estimasi produksi
                                                                            dan jadwal ready sesuai.

                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        )}

                                                    {/* ITEMS */}

                                                    <div className="
                                                        mt-5

                                                        flex
                                                        flex-wrap

                                                        gap-2
                                                        sm:gap-3
                                                    ">

                                                        {(order.items || [])
                                                            .slice(
                                                                0,
                                                                expanded
                                                                    ? 999
                                                                    : 4
                                                            )
                                                            .map(item => (

                                                                <div

                                                                    key={
                                                                        item.product_id
                                                                    }

                                                                    className="
                                                                        px-3
                                                                        py-2

                                                                        rounded-2xl

                                                                        bg-slate-100

                                                                        text-xs
                                                                        sm:text-sm

                                                                        font-semibold
                                                                    "
                                                                >

                                                                    {
                                                                        item.product_name
                                                                    }

                                                                    {" x"}

                                                                    {
                                                                        item.quantity
                                                                    }

                                                                    {item.is_preorder && (

                                                                        <span className="
                                                                            ml-2

                                                                            text-orange-500

                                                                            font-black
                                                                        ">

                                                                            PO

                                                                        </span>

                                                                    )}

                                                                </div>

                                                            ))}

                                                    </div>
                                                    {/* EXPAND BUTTON */}

                                                    {(order.items || [])
                                                        .length > 4 && (

                                                            <button

                                                                onClick={() =>
                                                                    toggleExpand(
                                                                        order.id
                                                                    )
                                                                }

                                                                className="
                                                                    mt-4

                                                                    inline-flex
                                                                    items-center

                                                                    gap-2

                                                                    text-sm

                                                                    font-black

                                                                    text-pink-600
                                                                "
                                                            >

                                                                {expanded
                                                                    ? "Sembunyikan"
                                                                    : "Lihat Semua"}

                                                                {expanded

                                                                    ? (
                                                                        <ChevronUp
                                                                            size={16}
                                                                        />
                                                                    )

                                                                    : (
                                                                        <ChevronDown
                                                                            size={16}
                                                                        />
                                                                    )
                                                                }

                                                            </button>

                                                        )}

                                                </div>

                                                {/* RIGHT */}

                                                <div className="
                                                    w-full
                                                    xl:w-[320px]

                                                    shrink-0

                                                    flex
                                                    flex-col

                                                    gap-3
                                                    sm:gap-4
                                                ">

                                                    {/* STATUS */}

                                                    <select

                                                        value={
                                                            order.status
                                                        }

                                                        onChange={(e) =>
                                                            updateStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }

                                                        className="
                                                            h-12
                                                            sm:h-14

                                                            rounded-2xl

                                                            border
                                                            border-slate-200

                                                            px-4
                                                            sm:px-5

                                                            bg-white

                                                            text-[16px]
                                                            sm:text-base

                                                            font-semibold
                                                        "
                                                    >

                                                        {statuses.map(
                                                            status => (

                                                                <option

                                                                    key={
                                                                        status.value
                                                                    }

                                                                    value={
                                                                        status.value
                                                                    }
                                                                >

                                                                    {
                                                                        status.label
                                                                    }

                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                    {/* QUICK ACTIONS */}

                                                    <div className="
                                                        grid
                                                        grid-cols-2

                                                        gap-3
                                                    ">

                                                        {/* DETAIL */}

                                                        <Button

                                                            onClick={() => {

                                                                setSelectedOrder(
                                                                    order
                                                                );

                                                                setDetailOpen(
                                                                    true
                                                                );

                                                            }}

                                                            className="
                                                                h-12
                                                                sm:h-14

                                                                rounded-2xl

                                                                bg-slate-900
                                                                hover:bg-slate-800

                                                                text-xs
                                                                sm:text-sm

                                                                font-black
                                                            "
                                                        >

                                                            <Eye
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                    mr-2
                                                                "
                                                            />

                                                            Detail

                                                        </Button>

                                                        {/* DELETE */}

                                                        <Button

                                                            onClick={() =>
                                                                deleteOrder(
                                                                    order.id
                                                                )
                                                            }

                                                            className="
                                                                h-12
                                                                sm:h-14

                                                                rounded-2xl

                                                                bg-red-500
                                                                hover:bg-red-600

                                                                text-xs
                                                                sm:text-sm

                                                                font-black
                                                            "
                                                        >

                                                            <Trash2
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                    mr-2
                                                                "
                                                            />

                                                            Hapus

                                                        </Button>

                                                    </div>

                                                    {/* PRINT ACTIONS */}

                                                    <div className="
                                                        grid
                                                        grid-cols-2

                                                        gap-3
                                                    ">

                                                        {/* PRINT */}

                                                        <Button

                                                            onClick={() =>
                                                                generateReceiptPDF(order)
                                                            }

                                                            variant="outline"

                                                            className="
                                                                h-12

                                                                rounded-2xl

                                                                border-slate-200

                                                                text-xs
                                                                sm:text-sm

                                                                font-black
                                                            "
                                                        >

                                                            <Printer
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                    mr-2
                                                                "
                                                            />

                                                            Struk

                                                        </Button>

                                                        {/* KITCHEN */}

                                                        <Button

                                                            onClick={() =>
                                                                printKitchen(
                                                                    order
                                                                )
                                                            }

                                                            variant="outline"

                                                            className="
                                                                h-12

                                                                rounded-2xl

                                                                border-orange-200

                                                                text-orange-600

                                                                text-xs
                                                                sm:text-sm

                                                                font-black
                                                            "
                                                        >

                                                            <ChefHat
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                    mr-2
                                                                "
                                                            />

                                                            Dapur

                                                        </Button>

                                                    </div>

                                                    {/* DOWNLOAD DETAIL */}

                                                    <Button

                                                        onClick={() =>
                                                            downloadDetail(
                                                                order
                                                            )
                                                        }

                                                        variant="outline"

                                                        className="
                                                            h-12

                                                            rounded-2xl

                                                            border-pink-200

                                                            text-pink-600

                                                            text-xs
                                                            sm:text-sm

                                                            font-black
                                                        "
                                                    >

                                                        <FileText
                                                            className="
                                                                w-4
                                                                h-4
                                                                mr-2
                                                            "
                                                        />

                                                        Download Detail

                                                    </Button>

                                                    {/* DATE */}

                                                    <div className="
                                                        rounded-3xl

                                                        bg-slate-50

                                                        border
                                                        border-slate-100

                                                        p-4
                                                    ">

                                                        <p className="
                                                            text-xs

                                                            font-bold

                                                            text-slate-500

                                                            uppercase

                                                            tracking-wide
                                                        ">

                                                            Order ID

                                                        </p>

                                                        <p className="
                                                            mt-2

                                                            text-sm
                                                            sm:text-base

                                                            font-black

                                                            text-slate-800

                                                            break-all
                                                        ">

                                                            {
                                                                order.id
                                                            }

                                                        </p>

                                                        <p className="
                                                            mt-3

                                                            text-xs

                                                            text-slate-500
                                                        ">

                                                            {
                                                                new Date(
                                                                    order.created_at || Date.now()
                                                                ).toLocaleString(
                                                                    "id-ID"
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </CardContent>

                                    </Card>

                                </motion.div>

                            );

                        }
                    )}

                </div>
                {/* EMPTY */}

                {filteredOrders.length === 0 && (

                    <div className="
                        rounded-[28px]
                        md:rounded-[36px]

                        bg-white

                        shadow-xl

                        p-10
                        sm:p-14

                        text-center
                    ">

                        <div className="
                            w-20
                            h-20

                            sm:w-24
                            sm:h-24

                            rounded-full

                            bg-pink-100

                            mx-auto

                            flex
                            items-center
                            justify-center
                        ">

                            <ShoppingCart
                                className="
                                    text-pink-500
                                "
                                size={38}
                            />

                        </div>

                        <h2 className="
                            mt-6
                            sm:mt-8

                            text-2xl
                            sm:text-3xl

                            font-black

                            text-slate-800
                        ">

                            Belum ada order

                        </h2>

                        <p className="
                            text-slate-500

                            mt-3

                            text-sm
                            sm:text-lg

                            leading-relaxed
                        ">

                            Pesanan customer
                            akan muncul di sini

                        </p>

                    </div>

                )}

                {/* DETAIL MODAL */}

                <Dialog

                    open={detailOpen}

                    onOpenChange={
                        setDetailOpen
                    }

                >

                    <DialogContent className="
                        w-[95vw]
                        sm:w-full

                        max-w-4xl

                        rounded-[28px]
                        md:rounded-[36px]

                        p-0

                        overflow-hidden

                        border-0

                        max-h-[96vh]
                    ">

                        {/* HEADER */}

                        <DialogHeader className="
                            p-5
                            sm:p-8

                            bg-gradient-to-r
                            from-[#5c6cff]
                            via-[#8e71ff]
                            to-[#f76d9d]

                            text-white
                        ">

                            <div className="
                                flex
                                flex-col
                                sm:flex-row

                                sm:items-center
                                sm:justify-between

                                gap-4
                            ">

                                <div>

                                    <DialogTitle className="
                                        text-2xl
                                        sm:text-3xl

                                        font-black
                                    ">

                                        Detail Pesanan

                                    </DialogTitle>

                                    <p className="
                                        mt-2

                                        text-sm
                                        sm:text-base

                                        text-white/80
                                    ">

                                        Informasi lengkap
                                        pesanan customer

                                    </p>

                                </div>

                                {/* PRINT BUTTON */}

                                {selectedOrder && (

                                    <div className="
                                        flex
                                        flex-wrap

                                        gap-3
                                    ">

                                        <Button

                                            onClick={() =>
                                                generateReceiptPDF(
                                                    selectedOrder
                                                )
                                            }

                                            className="
                                                h-12

                                                rounded-2xl

                                                bg-white
                                                hover:bg-slate-100

                                                text-slate-900

                                                px-5

                                                text-sm

                                                font-black

                                                shrink-0
                                            "
                                        >

                                            <Printer
                                                className="
                                                    w-4
                                                    h-4
                                                    mr-2
                                                "
                                            />

                                            Print Struk

                                        </Button>

                                        <Button

                                            onClick={() =>
                                                printKitchen(
                                                    selectedOrder
                                                )
                                            }

                                            className="
                                                h-12

                                                rounded-2xl

                                                bg-orange-500
                                                hover:bg-orange-600

                                                text-white

                                                px-5

                                                text-sm

                                                font-black

                                                shrink-0
                                            "
                                        >

                                            <ChefHat
                                                className="
                                                    w-4
                                                    h-4
                                                    mr-2
                                                "
                                            />

                                            Print Dapur

                                        </Button>

                                    </div>

                                )}

                            </div>

                        </DialogHeader>

                        {/* CONTENT */}

                        {selectedOrder && (

                            <div className="
                                p-4
                                sm:p-8

                                space-y-6
                                sm:space-y-8

                                max-h-[80vh]

                                overflow-y-auto

                                scrollbar-thin
                                scrollbar-thumb-pink-200
                                scrollbar-track-transparent
                            ">
                                {/* CUSTOMER INFO */}

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2

                                    gap-4
                                    sm:gap-5
                                ">

                                    {/* CUSTOMER */}

                                    <div className="
                                        rounded-3xl

                                        border
                                        border-slate-200

                                        p-5
                                    ">

                                        <div className="
                                            flex
                                            items-start

                                            gap-4
                                        ">

                                            <div className="
                                                w-12
                                                h-12

                                                rounded-2xl

                                                bg-pink-100

                                                flex
                                                items-center
                                                justify-center

                                                shrink-0
                                            ">

                                                <User
                                                    className="
                                                        text-pink-500
                                                    "
                                                />

                                            </div>

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-xs
                                                    sm:text-sm

                                                    text-slate-500

                                                    font-semibold
                                                ">

                                                    Customer

                                                </p>

                                                <h3 className="
                                                    mt-1

                                                    text-xl
                                                    sm:text-2xl

                                                    font-black

                                                    text-slate-800

                                                    break-words
                                                ">

                                                    {
                                                        selectedOrder.customer_name
                                                    }

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                    {/* PHONE */}

                                    <div className="
                                        rounded-3xl

                                        border
                                        border-slate-200

                                        p-5
                                    ">

                                        <div className="
                                            flex
                                            items-start

                                            gap-4
                                        ">

                                            <div className="
                                                w-12
                                                h-12

                                                rounded-2xl

                                                bg-blue-100

                                                flex
                                                items-center
                                                justify-center

                                                shrink-0
                                            ">

                                                <Phone
                                                    className="
                                                        text-blue-500
                                                    "
                                                />

                                            </div>

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-xs
                                                    sm:text-sm

                                                    text-slate-500

                                                    font-semibold
                                                ">

                                                    WhatsApp

                                                </p>

                                                <h3 className="
                                                    mt-1

                                                    text-xl
                                                    sm:text-2xl

                                                    font-black

                                                    text-slate-800

                                                    break-all
                                                ">

                                                    {
                                                        selectedOrder.phone
                                                    }

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="
                                        rounded-3xl

                                        border
                                        border-slate-200

                                        p-5

                                        md:col-span-2
                                    ">

                                        <div className="
                                            flex
                                            items-start

                                            gap-4
                                        ">

                                            <div className="
                                                w-12
                                                h-12

                                                rounded-2xl

                                                bg-emerald-100

                                                flex
                                                items-center
                                                justify-center

                                                shrink-0
                                            ">

                                                <MapPin
                                                    className="
                                                        text-emerald-500
                                                    "
                                                />

                                            </div>

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-xs
                                                    sm:text-sm

                                                    text-slate-500

                                                    font-semibold
                                                ">

                                                    Alamat / Lokasi

                                                </p>

                                                <h3 className="
                                                    mt-1

                                                    text-base
                                                    sm:text-lg

                                                    font-bold

                                                    text-slate-800

                                                    leading-relaxed
                                                ">

                                                    {
                                                        selectedOrder.customer_address || "-"
                                                    }

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                    {/* NOTES */}

                                    <div className="
                                        rounded-3xl

                                        border
                                        border-yellow-200

                                        bg-yellow-50

                                        p-5

                                        md:col-span-2
                                    ">

                                        <div className="
                                            flex
                                            items-start

                                            gap-4
                                        ">

                                            <div className="
                                                w-12
                                                h-12

                                                rounded-2xl

                                                bg-yellow-100

                                                flex
                                                items-center
                                                justify-center

                                                shrink-0
                                            ">

                                                <StickyNote
                                                    className="
                                                        text-yellow-600
                                                    "
                                                />

                                            </div>

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-xs
                                                    sm:text-sm

                                                    text-yellow-700

                                                    font-semibold
                                                ">

                                                    Catatan Tambahan

                                                </p>

                                                <h3 className="
                                                    mt-1

                                                    text-base
                                                    sm:text-lg

                                                    font-bold

                                                    text-yellow-800

                                                    leading-relaxed
                                                ">

                                                    {
                                                        selectedOrder.notes || "-"
                                                    }

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* PREORDER WARNING */}

                                {(selectedOrder.items || [])
                                    .some(
                                        item =>
                                            item.is_preorder
                                    ) && (

                                        <div className="
                                            rounded-3xl

                                            border
                                            border-orange-200

                                            bg-orange-50

                                            p-5
                                        ">

                                            <div className="
                                                flex
                                                items-start

                                                gap-4
                                            ">

                                                <div className="
                                                    w-12
                                                    h-12

                                                    rounded-2xl

                                                    bg-orange-100

                                                    flex
                                                    items-center
                                                    justify-center

                                                    shrink-0
                                                ">

                                                    <Package
                                                        className="
                                                            text-orange-500
                                                        "
                                                    />

                                                </div>

                                                <div>

                                                    <h3 className="
                                                        text-lg
                                                        sm:text-xl

                                                        font-black

                                                        text-orange-700
                                                    ">

                                                        Pesanan Mengandung Produk Preorder

                                                    </h3>

                                                    <p className="
                                                        mt-2

                                                        text-sm
                                                        sm:text-base

                                                        text-orange-600

                                                        leading-relaxed
                                                    ">

                                                        Pastikan jadwal produksi,
                                                        kapasitas harian,
                                                        dan estimasi ready
                                                        sudah sesuai.

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )}
                                {/* ITEMS */}

                                <div className="
                                    rounded-3xl

                                    border
                                    border-slate-200

                                    overflow-hidden
                                ">

                                    {/* HEADER */}

                                    <div className="
                                        p-5

                                        border-b
                                        border-slate-200

                                        bg-slate-50
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            justify-between

                                            gap-4
                                        ">

                                            <div>

                                                <h3 className="
                                                    text-xl
                                                    sm:text-2xl

                                                    font-black

                                                    text-slate-800
                                                ">

                                                    Item Pesanan

                                                </h3>

                                                <p className="
                                                    mt-1

                                                    text-sm

                                                    text-slate-500
                                                ">

                                                    Detail produk
                                                    yang dipesan customer

                                                </p>

                                            </div>

                                            <div className="
                                                h-11

                                                px-4

                                                rounded-2xl

                                                bg-pink-100

                                                flex
                                                items-center

                                                text-sm

                                                font-black

                                                text-pink-600
                                            ">

                                                {
                                                    (selectedOrder.items || [])
                                                        .length
                                                }
                                                {" "}Item

                                            </div>

                                        </div>

                                    </div>

                                    {/* ITEMS */}

                                    <div className="
                                        divide-y
                                        divide-slate-100
                                    ">

                                        {(selectedOrder.items || [])
                                            .map(item => (

                                                <div

                                                    key={
                                                        item.product_id
                                                    }

                                                    className="
                                                        p-4
                                                        sm:p-5

                                                        flex
                                                        flex-col
                                                        sm:flex-row

                                                        sm:items-center
                                                        sm:justify-between

                                                        gap-4
                                                    "
                                                >

                                                    {/* LEFT */}

                                                    <div className="
                                                        flex-1
                                                        min-w-0
                                                    ">

                                                        <div className="
                                                            flex
                                                            flex-wrap

                                                            items-center

                                                            gap-2
                                                        ">

                                                            <h4 className="
                                                                text-lg
                                                                sm:text-xl

                                                                font-black

                                                                text-slate-800

                                                                break-words
                                                            ">

                                                                {
                                                                    item.product_name
                                                                }

                                                            </h4>

                                                            {item.is_preorder && (

                                                                <div className="
                                                                    h-7

                                                                    px-3

                                                                    rounded-full

                                                                    bg-orange-100

                                                                    flex
                                                                    items-center

                                                                    text-[10px]
                                                                    sm:text-xs

                                                                    font-black

                                                                    text-orange-600
                                                                ">

                                                                    PREORDER

                                                                    {item.ready_after_days > 0 && (
                                                                        <>
                                                                            {" "}H-
                                                                            {
                                                                                item.ready_after_days
                                                                            }
                                                                        </>
                                                                    )}

                                                                </div>

                                                            )}

                                                        </div>

                                                        <div className="
                                                            mt-2

                                                            flex
                                                            flex-wrap

                                                            gap-3
                                                            sm:gap-5
                                                        ">

                                                            <p className="
                                                                text-sm
                                                                sm:text-base

                                                                text-slate-500
                                                            ">

                                                                Qty:
                                                                {" "}

                                                                <span className="
                                                                    font-black

                                                                    text-slate-800
                                                                ">

                                                                    {
                                                                        item.quantity
                                                                    }

                                                                </span>

                                                            </p>

                                                            <p className="
                                                                text-sm
                                                                sm:text-base

                                                                text-slate-500
                                                            ">

                                                                Harga:
                                                                {" "}

                                                                <span className="
                                                                    font-black

                                                                    text-slate-800
                                                                ">

                                                                    Rp {

                                                                        Number(
                                                                            item.price || 0
                                                                        ).toLocaleString(
                                                                            "id-ID"
                                                                        )

                                                                    }

                                                                </span>

                                                            </p>

                                                        </div>

                                                        {/* PREORDER READY */}

                                                        {item.is_preorder && (
                                                            <div className="
                                                                mt-3

                                                                rounded-2xl

                                                                border
                                                                border-orange-200

                                                                bg-orange-50

                                                                px-4
                                                                py-3

                                                                text-xs
                                                                sm:text-sm

                                                                text-orange-700

                                                                leading-relaxed
                                                            ">

                                                                ⏰ Estimasi tersedia
                                                                setelah
                                                                {" "}

                                                                <span className="
                                                                    font-black
                                                                ">

                                                                    {
                                                                        item.ready_after_days || 0
                                                                    }
                                                                    {" "}hari

                                                                </span>

                                                                {" "}dari waktu order.

                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* RIGHT */}

                                                    <div className="
                                                        sm:text-right

                                                        shrink-0
                                                    ">

                                                        <div className="
                                                            text-2xl
                                                            sm:text-3xl

                                                            font-black

                                                            text-pink-600
                                                        ">

                                                            Rp {

                                                                Number(
                                                                    (item.price || 0) *
                                                                    (item.quantity || 0)
                                                                ).toLocaleString(
                                                                    "id-ID"
                                                                )

                                                            }

                                                        </div>

                                                        <p className="
                                                            mt-1

                                                            text-xs
                                                            sm:text-sm

                                                            text-slate-500
                                                        ">

                                                            Total item

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>
                                {/* SUMMARY */}

                                <div className="
                                    rounded-3xl

                                    bg-gradient-to-r
                                    from-pink-500
                                    to-rose-600

                                    p-5
                                    sm:p-7

                                    text-white

                                    shadow-xl
                                ">

                                    <div className="
                                        flex
                                        flex-col
                                        sm:flex-row

                                        sm:items-center
                                        sm:justify-between

                                        gap-5
                                    ">

                                        {/* LEFT */}

                                        <div>

                                            <p className="
                                                text-sm
                                                sm:text-base

                                                text-white/80

                                                font-semibold
                                            ">

                                                Total Pembayaran

                                            </p>

                                            <h2 className="
                                                mt-2

                                                text-4xl
                                                sm:text-5xl

                                                font-black

                                                tracking-tight
                                            ">

                                                Rp {

                                                    getOrderTotal(selectedOrder).toLocaleString(
                                                        "id-ID"
                                                    )

                                                }

                                            </h2>

                                            <p className="
                                                mt-3

                                                text-xs
                                                sm:text-sm

                                                text-white/80
                                            ">

                                                Termasuk seluruh item
                                                pesanan customer

                                            </p>

                                        </div>

                                        {/* STATUS */}

                                        <div className="
                                            flex
                                            flex-col

                                            gap-3

                                            w-full
                                            sm:w-auto
                                        ">

                                            <p className="
                                                text-xs
                                                sm:text-sm

                                                text-white/80

                                                font-semibold
                                            ">

                                                Status Pesanan

                                            </p>

                                            <select

                                                value={
                                                    selectedOrder.status
                                                }

                                                onChange={(e) => {

                                                    updateStatus(
                                                        selectedOrder.id,
                                                        e.target.value
                                                    );

                                                    setSelectedOrder({
                                                        ...selectedOrder,
                                                        status: e.target.value,
                                                    });

                                                }}

                                                className="
                                                    h-12
                                                    sm:h-14

                                                    rounded-2xl

                                                    px-4
                                                    sm:px-5

                                                    bg-white

                                                    text-slate-800

                                                    text-sm
                                                    sm:text-base

                                                    font-black

                                                    min-w-full
                                                    sm:min-w-[240px]
                                                "
                                            >

                                                {statuses.map(
                                                    status => (

                                                        <option

                                                            key={
                                                                status.value
                                                            }

                                                            value={
                                                                status.value
                                                            }
                                                        >

                                                            {
                                                                status.label
                                                            }

                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    xl:grid-cols-4

                                    gap-3
                                    sm:gap-4
                                ">

                                    {/* PRINT RECEIPT */}

                                    <Button

                                        onClick={() => {

                                            const isMobile =

                                                /Android|iPhone|iPad/i.test(
                                                    navigator.userAgent
                                                );

                                            if (isMobile) {

                                                downloadDetail(selectedOrder);

                                                return;

                                            }

                                            generateReceiptPDF(selectedOrder);

                                        }}

                                        className="
                                            h-14

                                            rounded-3xl

                                            bg-slate-900
                                            hover:bg-slate-800

                                            text-sm
                                            sm:text-base

                                            font-black

                                            shadow-xl
                                        "
                                    >

                                        <Printer
                                            className="
                                                mr-2
                                                w-5
                                                h-5
                                            "
                                        />

                                        Print Struk

                                    </Button>

                                    {/* PRINT KITCHEN */}

                                    <Button

                                        onClick={() => {

                                            const isMobile =

                                                /Android|iPhone|iPad/i.test(
                                                    navigator.userAgent
                                                );

                                            if (isMobile) {

                                                downloadDetail(selectedOrder);

                                                return;

                                            }

                                            printKitchen(selectedOrder);

                                        }}

                                        className="
                                            h-14

                                            rounded-3xl

                                            bg-orange-500
                                            hover:bg-orange-600

                                            text-sm
                                            sm:text-base

                                            font-black

                                            shadow-xl
                                        "
                                    >

                                        <ChefHat
                                            className="
                                                mr-2
                                                w-5
                                                h-5
                                            "
                                        />

                                        Print Dapur

                                    </Button>

                                    {/* DOWNLOAD */}

                                    <Button

                                        onClick={() =>
                                            downloadDetail(
                                                selectedOrder
                                            )
                                        }

                                        variant="outline"

                                        className="
                                            h-14

                                            rounded-3xl

                                            border-pink-200

                                            text-pink-600

                                            hover:bg-pink-50

                                            text-sm
                                            sm:text-base

                                            font-black
                                        "
                                    >

                                        <Download
                                            className="
                                                mr-2
                                                w-5
                                                h-5
                                            "
                                        />

                                        Download Detail

                                    </Button>

                                    {/* DELETE */}

                                    <Button

                                        onClick={() => {

                                            deleteOrder(
                                                selectedOrder.id
                                            );

                                        }}

                                        className="
                                            h-14

                                            rounded-3xl

                                            bg-red-500
                                            hover:bg-red-600

                                            text-sm
                                            sm:text-base

                                            font-black

                                            shadow-xl
                                        "
                                    >

                                        <Trash2
                                            className="
                                                mr-2
                                                w-5
                                                h-5
                                            "
                                        />

                                        Hapus Order

                                    </Button>

                                </div>

                            </div>

                        )}

                    </DialogContent>

                </Dialog>

                <Dialog
                    open={databaseOpen}
                    onOpenChange={setDatabaseOpen}
                >

                    <DialogContent className="
                        w-[95vw]
                        sm:w-full

                        max-w-6xl

                        rounded-[28px]
                        md:rounded-[36px]

                        p-0

                        overflow-hidden

                        border-0

                        max-h-[96vh]
                    ">

                        <DialogHeader className="
                            p-5
                            sm:p-8

                            bg-slate-900
                            text-white
                        ">

                            <div className="
                                flex
                                flex-col
                                sm:flex-row

                                sm:items-center
                                sm:justify-between

                                gap-4
                            ">

                                <div>

                                    <DialogTitle className="
                                        text-2xl
                                        sm:text-3xl

                                        font-black
                                    ">

                                        Daftar Detail Order

                                    </DialogTitle>

                                    <p className="
                                        mt-2

                                        text-sm
                                        sm:text-base

                                        text-white/80
                                    ">

                                        Lihat semua pesanan dalam format tabel dan kelola status workflow langsung dari admin.

                                    </p>

                                </div>

                                <div className="
                                    flex
                                    flex-wrap
                                    gap-3
                                ">

                                    <Button
                                        onClick={() =>
                                            setDatabaseOpen(false)
                                        }
                                        className="
                                            h-12
                                            rounded-2xl

                                            bg-white
                                            hover:bg-slate-100

                                            text-slate-900
                                            text-sm
                                            font-black
                                        "
                                    >
                                        Tutup
                                    </Button>

                                </div>

                            </div>

                        </DialogHeader>

                        <div className="
                            p-4
                            sm:p-6

                            overflow-x-auto
                            max-h-[80vh]

                            scrollbar-thin
                            scrollbar-thumb-slate-300
                            scrollbar-track-transparent
                        ">

                            <div className="
                                mb-4
                                text-sm
                                text-slate-600
                            ">
                                Tandai semua tahap order: respon, pembayaran, dan pengambilan. Perubahan tersimpan otomatis.
                            </div>

                            <div className="
                                rounded-[28px]
                                overflow-hidden
                                border
                                border-slate-200
                            ">

                                <table className="
                                    min-w-full
                                    divide-y
                                    divide-slate-200
                                ">

                                    <thead className="
                                        bg-slate-50
                                    ">

                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">WA</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Respon</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Bayar</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Siap</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Ambil</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Kirim WA</th>
                                        </tr>

                                    </thead>

                                    <tbody className="bg-white divide-y divide-slate-200">

                                        {orders.map(order => {

                                            const statusData = statuses.find(s => s.value === order.status);
                                            const StatusIcon = statusData?.icon;

                                            return (
                                                <tr key={order.id}>
                                                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{order.id}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{order.customer_name || "-"}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{order.phone || "-"}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">Rp {getOrderTotal(order).toLocaleString("id-ID")}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusData?.color ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                                            {StatusIcon ? <StatusIcon size={14} /> : null}
                                                            {statusData?.label || order.status}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                                            <Checkbox
                                                                checked={order.workflow?.responded}
                                                                onCheckedChange={() => toggleWorkflow(order.id, "responded")}
                                                            />
                                                            {order.workflow?.responded ? "Sudah" : "Belum"}
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                                            <Checkbox
                                                                checked={order.workflow?.paid}
                                                                onCheckedChange={() => toggleWorkflow(order.id, "paid")}
                                                            />
                                                            {order.workflow?.paid ? "Sudah" : "Belum"}
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                                            <Checkbox
                                                                checked={order.workflow?.ready}
                                                                onCheckedChange={() => toggleWorkflow(order.id, "ready")}
                                                            />
                                                            {order.workflow?.ready ? "Sudah" : "Belum"}
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                                            <Checkbox
                                                                checked={order.workflow?.pickedUp}
                                                                onCheckedChange={() => toggleWorkflow(order.id, "pickedUp")}
                                                            />
                                                            {order.workflow?.pickedUp ? "Sudah" : "Belum"}
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="rounded-2xl px-3 py-2 text-xs font-black"
                                                            onClick={() => generateReceiptPDF(order)}
                                                            disabled={!order.phone}
                                                        >
                                                            WA PDF
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );

                                        })}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </DialogContent>

                </Dialog>

            </div>

        </AdminLayout>

    );

}
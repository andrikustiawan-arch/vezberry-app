import React, {
    useState,
    useEffect,
    useMemo,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    toast,
} from "sonner";

import {
    processCheckout,
} from "@/lib/processCheckout";

import {
    formatPreorderDate,
} from "@/utils/preorderUtils";

import {
    ChevronLeft,
    ShoppingBag,
    User,
    CreditCard,
    Package,
} from "lucide-react";

export default function Checkout() {

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const checkoutState =
        location.state || {};

    const {
        cart = [],

        totalPrice = 0,

        orders = [],

        dbProducts = [],

    } = checkoutState;

    const savedCustomer = useMemo(() => {
        if (typeof window === "undefined") {
            return {};
        }

        try {
            return JSON.parse(
                localStorage.getItem(
                    "vezberry_customer"
                ) || "{}"
            ) || {};
        } catch (err) {
            return {};
        }
    }, []);

    const [
        customerName,
        setCustomerName,
    ] = useState(savedCustomer.name || "");

    const [
        customerPhone,
        setCustomerPhone,
    ] = useState(savedCustomer.phone || "");

    const [
        customerAddress,
        setCustomerAddress,
    ] = useState(savedCustomer.address || "");

    const persistedCart = useMemo(() => {
        if (typeof window === "undefined") {
            return [];
        }

        try {
            return JSON.parse(
                localStorage.getItem(
                    "vezberry_cart"
                ) || "[]"
            ) || [];
        } catch (err) {
            return [];
        }
    }, []);

    const effectiveCart = cart.length
        ? cart
        : persistedCart;

    const effectiveTotalPrice = totalPrice || effectiveCart.reduce(
        (sum, item) =>
            sum +
            ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
        0
    );

    const hasPreorder =
        effectiveCart.some(
            item =>
                item.is_preorder
        );

    const [
        customerNotes,
        setCustomerNotes,
    ] = useState("");

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState("cash");

    useEffect(() => {
        try {
            localStorage.setItem(
                "vezberry_customer",
                JSON.stringify({
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                })
            );
        } catch (err) {
            console.warn(
                "Gagal menyimpan data pelanggan lokal:",
                err
            );
        }
    }, [customerName, customerPhone, customerAddress]);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [waUrlState, setWaUrlState] = useState(null);
    const [showFallback, setShowFallback] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let id;
        if (showFallback) {
            // ensure countdown has a starting value
            setCountdown((c) => (c > 0 ? c : 3));
            id = setInterval(() => {
                setCountdown((c) => {
                    if (c <= 1) {
                        clearInterval(id);
                        setShowFallback(false);
                        navigate("/");
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000);
        }
        return () => {
            if (id) clearInterval(id);
        };
    }, [showFallback, navigate]);

    const handleCheckout = async () => {


        if (!customerName.trim()) {

            toast.error(
                "Nama customer wajib diisi"
            );

            return;

        }

        if (!customerPhone.trim()) {

            toast.error(
                "Nomor WhatsApp wajib diisi"
            );

            return;

        }

        console.log(
            "CHECKOUT CART FULL:",
            JSON.stringify(cart, null, 2)
        );

        // build whatsapp message & url and open a blank tab synchronously
        const itemLines =
            effectiveCart.flatMap(
                (item, index) => {

                    const lines = [

                        `${index + 1}. ${item.name || item.product_name} • Qty: ${item.quantity} • Subtotal: Rp${(
                            item.price *
                            item.quantity
                        ).toLocaleString("id-ID")}`

                    ];

                    if (
                        item.is_preorder
                    ) {

                        lines.push(
                            `⚠️ PREORDER (Produk siap ${formatPreorderDate(item)})`
                        );

                    }

                    return lines;

                }
            );

        console.log(
            "CHECKOUT ITEMS:",
            cart
        );

        const messageLines = [
            "Assalamu'alaikum VEZBERRY 🍓",
            "Saya ingin memesan:",
            ...itemLines,
            "━━━━━━━━━━━━━━━",
            `TOTAL:\nRp${effectiveTotalPrice.toLocaleString("id-ID")}`,
            "━━━━━━━━━━━━━━━",
            "Metode Pembayaran:",
            `✅ ${paymentMethod === "cash" ? "Cash di Booth" : "Transfer / QRIS"}`,
            "",
            `👤 Nama: ${customerName || "-"}`,
            `📱 Nomor WhatsApp: ${customerPhone || "-"}`,
            `📍 Alamat: ${customerAddress || "-"}`,
            `📝 Catatan: ${customerNotes || "-"}`,
            "",
            "Terima kasih 🙏",
        ];

        const phone = "6282120012025";
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
            messageLines.join("\n")
        )}`;

        // open blank window immediately to avoid popup blocker

        setIsSubmitting(true);

        try {

            await processCheckout({

                orderData: {

                    customer_name: customerName,

                    phone: customerPhone,

                    customer_address: customerAddress,

                    notes: customerNotes,

                },

                cart: effectiveCart,

                orders,

                dbProducts,

                totalPrice: effectiveTotalPrice,

                paymentMethod,

                toast,

            });

            try {

                localStorage.setItem(
                    "vezberry_customer",
                    JSON.stringify({
                        name: customerName,
                        phone: customerPhone,
                        address: customerAddress,
                    })
                );

            } catch (err) {

                console.warn(
                    "Gagal menyimpan data customer lokal:",
                    err
                );

            }

            window.location.href = waUrl;

        } catch (err) {

            console.error(err);

            toast.error("Checkout gagal");

        } finally {

            setIsSubmitting(false);

        }

    };

    return (

        <div className="
            min-h-screen
            bg-gradient-to-b
            from-[#faf8f6]
            to-[#f5f1ed]
        ">

            {/* HEADER */}
            <div className="
                sticky
                top-0
                z-50
                bg-white/80
                backdrop-blur-lg
                border-b
                border-slate-200/50
            ">

                <div className="
                    max-w-6xl
                    mx-auto
                    px-4
                    md:px-6
                    py-4
                    flex
                    items-center
                    justify-between
                ">

                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            p-2
                            hover:bg-slate-100
                            rounded-lg
                            transition-colors
                        "
                    >

                        <ChevronLeft className="
                            w-6
                            h-6
                            text-slate-600
                        " />

                    </button>

                    <h1 className="
                        text-2xl
                        md:text-3xl
                        font-black
                        text-slate-800
                    ">
                        Checkout
                    </h1>

                    <div className="
                        w-10
                    " />

                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="
                max-w-6xl
                mx-auto
                px-4
                md:px-6
                py-6
                md:py-8
            ">

                {/* FALLBACK / CONFIRMATION OVERLAY */}
                {showFallback && (
                    <div className="
                        fixed
                        inset-0
                        z-60
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-4
                    ">
                        <div className="
                            w-full
                            max-w-md
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            text-center
                        ">
                            <h3 className="
                                text-lg
                                font-black
                                text-slate-800
                            ">
                                Pesanan dibuat
                            </h3>
                            <p className="
                                text-sm
                                text-slate-600
                                mt-2
                            ">
                                WhatsApp sedang dibuka. Jika tidak muncul, klik tombol di bawah.
                            </p>

                            <div className="mt-3">
                                <div className="text-sm text-slate-600">
                                    Mengalihkan dalam <span className="font-bold">{countdown}s</span>
                                </div>

                                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-2 bg-pink-500 transition-all"
                                        style={{ width: `${(countdown / 3) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        try {
                                            window.open(waUrlState, "_blank");
                                        } catch (err) {
                                            window.location.href = waUrlState;
                                        }
                                    }}
                                    className="
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-green-500
                                        text-white
                                        font-bold
                                    "
                                >
                                    Buka WhatsApp
                                </button>

                                <button
                                    onClick={() => navigate("/")}
                                    className="
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-slate-100
                                        text-slate-800
                                        font-bold
                                    "
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                    md:gap-8
                ">

                    {/* LEFT: FORM SECTION */}
                    <div className="
                        lg:col-span-2
                        space-y-5
                        md:space-y-6
                    ">

                        {/* ORDER SUMMARY */}
                        <div className="
                            bg-white
                            rounded-2xl
                            md:rounded-3xl
                            p-5
                            md:p-6
                            shadow-sm
                            border
                            border-slate-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                                mb-5
                            ">

                                <div className="
                                    p-3
                                    bg-pink-100
                                    rounded-xl
                                ">

                                    <ShoppingBag className="
                                        w-5
                                        h-5
                                        text-pink-600
                                    " />

                                </div>

                                <h2 className="
                                    text-xl
                                    md:text-2xl
                                    font-black
                                    text-slate-800
                                ">
                                    Ringkasan Pesanan
                                </h2>

                            </div>

                            {
                                hasPreorder && (

                                    <div className="
            mb-4
            rounded-xl
            border
            border-amber-300
            bg-amber-50
            p-4
        ">

                                        <div className="
                font-bold
                text-amber-900
            ">
                                            ⚠️ Pesanan Mengandung Produk Preorder
                                        </div>

                                        <div className="
                text-sm
                text-amber-700
                mt-1
            ">
                                            Produk preorder membutuhkan waktu produksi sesuai estimasi tanggal siap.
                                        </div>

                                    </div>

                                )
                            }

                            <div className="
                                space-y-3
                                md:space-y-4
                            ">

                                {effectiveCart.map(
                                    (item) => {

                                        const subtotal =
                                            item.price *
                                            item.quantity;

                                        return (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    p-4
                                                    bg-gradient-to-r
                                                    from-slate-50
                                                    to-transparent
                                                    rounded-xl
                                                    border
                                                    border-slate-100
                                                "
                                            >

                                                <div className="
                                                    flex-1
                                                ">

                                                    <h3 className="
                                                        font-bold
                                                        text-slate-800
                                                        text-sm
                                                        md:text-base
                                                    ">
                                                        {
                                                            item.name ||
                                                            item
                                                                .product_name
                                                        }
                                                    </h3>

                                                    {
                                                        item.is_preorder && (
                                                            <div className="
            mt-2
            rounded-lg
            border
            border-amber-200
            bg-amber-50
            px-3
            py-2
            text-xs
            text-amber-800
        ">
                                                                <div className="font-bold">
                                                                    ⚠️ PREORDER
                                                                </div>

                                                                <div>
                                                                    Produk siap:
                                                                </div>

                                                                <div className="font-semibold">
                                                                    {formatPreorderDate(item)}
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    <p className="
                                                        text-xs
                                                        md:text-sm
                                                        text-slate-500
                                                        mt-1
                                                    ">
                                                        Rp{" "}
                                                        {item.price.toLocaleString(
                                                            "id-ID"
                                                        )}{" "}
                                                        × {
                                                            item.quantity
                                                        }
                                                    </p>

                                                </div>

                                                <div className="
                                                    text-right
                                                ">

                                                    <p className="
                                                        font-black
                                                        text-pink-600
                                                        text-sm
                                                        md:text-base
                                                    ">
                                                        Rp{" "}
                                                        {subtotal.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                        {/* CUSTOMER INFO */}
                        <div className="
                            bg-white
                            rounded-2xl
                            md:rounded-3xl
                            p-5
                            md:p-6
                            shadow-sm
                            border
                            border-slate-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                                mb-5
                                md:mb-6
                            ">

                                <div className="
                                    p-3
                                    bg-blue-100
                                    rounded-xl
                                ">

                                    <User className="
                                        w-5
                                        h-5
                                        text-blue-600
                                    " />

                                </div>

                                <h2 className="
                                    text-xl
                                    md:text-2xl
                                    font-black
                                    text-slate-800
                                ">
                                    Data Pemesan
                                </h2>

                            </div>

                            <div className="
                                space-y-4
                                md:space-y-5
                            ">

                                {/* NAME */}
                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        mb-2
                                    ">
                                        Nama Lengkap *(wajib isi)
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            customerName
                                        }
                                        onChange={(
                                            e
                                        ) => {

                                            setCustomerName(
                                                e
                                                    .target
                                                    .value
                                            );

                                        }}
                                        placeholder="Masukkan nama lengkap"
                                        className="
                                            w-full
                                            h-12
                                            md:h-14
                                            px-4
                                            md:px-5
                                            rounded-xl
                                            md:rounded-2xl
                                            border
                                            border-slate-200
                                            focus:border-pink-500
                                            focus:ring-2
                                            focus:ring-pink-200
                                            outline-none
                                            transition-all
                                            text-sm
                                            md:text-base
                                        "
                                    />

                                </div>

                                {/* PHONE */}
                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        mb-2
                                    ">
                                        Nomor WhatsApp *(wajib isi)
                                    </label>

                                    <div className="
                                        relative
                                    ">



                                        <input
                                            type="tel"
                                            value={
                                                customerPhone
                                            }
                                            onChange={(
                                                e
                                            ) => {

                                                setCustomerPhone(
                                                    e
                                                        .target
                                                        .value
                                                );

                                            }}
                                            placeholder="08xxxxxxxxxx"
                                            className="
                                                w-full
                                                h-14
                                                md:h-14
                                                px-4
                                                md:px-5
                                                pl-4
                                                rounded-xl
                                                md:rounded-2xl
                                                border
                                                border-slate-200
                                                focus:border-pink-500
                                                focus:ring-2
                                                focus:ring-pink-200
                                                outline-none
                                                transition-all
                                                text-sm
                                                md:text-base
                                            "
                                        />

                                    </div>

                                </div>

                                {/* ADDRESS */}
                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        mb-2
                                    ">
                                        Alamat Pengiriman *(wajib isi bila via OjOL)
                                    </label>

                                    <div className="
                                        relative
                                    ">



                                        <textarea
                                            value={
                                                customerAddress
                                            }
                                            onChange={(
                                                e
                                            ) => {

                                                setCustomerAddress(
                                                    e
                                                        .target
                                                        .value
                                                );

                                            }}
                                            placeholder="Jl. ... No. ... Kota ..."
                                            className="
                                                w-full
                                                h-20
                                                md:h-24
                                                px-4
                                                md:px-5
                                                pl-4
                                                py-3
                                                md:py-4
                                                rounded-xl
                                                md:rounded-2xl
                                                border
                                                border-slate-200
                                                focus:border-pink-500
                                                focus:ring-2
                                                focus:ring-pink-200
                                                outline-none
                                                resize-none
                                                transition-all
                                                text-sm
                                                md:text-base
                                            "
                                        />

                                    </div>

                                </div>

                                {/* NOTES */}
                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        mb-2
                                    ">
                                        Catatan (Opsional)
                                    </label>

                                    <div className="
                                        relative
                                    ">



                                        <textarea
                                            value={
                                                customerNotes
                                            }
                                            onChange={(
                                                e
                                            ) => {

                                                setCustomerNotes(
                                                    e
                                                        .target
                                                        .value
                                                );

                                            }}
                                            placeholder="Contoh: Jangan terlalu panas, dll"
                                            className="
                                                w-full
                                                h-20
                                                md:h-24
                                                px-4
                                                md:px-5
                                                pl-4
                                                py-3
                                                md:py-4
                                                rounded-xl
                                                md:rounded-2xl
                                                border
                                                border-slate-200
                                                focus:border-pink-500
                                                focus:ring-2
                                                focus:ring-pink-200
                                                outline-none
                                                resize-none
                                                transition-all
                                                text-sm
                                                md:text-base
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="
                            bg-white
                            rounded-2xl
                            md:rounded-3xl
                            p-5
                            md:p-6
                            shadow-sm
                            border
                            border-slate-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                                mb-5
                                md:mb-6
                            ">

                                <div className="
                                    p-3
                                    bg-green-100
                                    rounded-xl
                                ">

                                    <CreditCard className="
                                        w-5
                                        h-5
                                        text-green-600
                                    " />

                                </div>

                                <h2 className="
                                    text-xl
                                    md:text-2xl
                                    font-black
                                    text-slate-800
                                ">
                                    Metode Pembayaran
                                </h2>

                            </div>

                            <div className="
                                space-y-3
                                md:space-y-4
                            ">

                                <button
                                    onClick={() => {

                                        setPaymentMethod(
                                            "cash"
                                        );

                                    }}
                                    className={`
                                        w-full
                                        p-4
                                        md:p-5
                                        rounded-xl
                                        md:rounded-2xl
                                        border-2
                                        transition-all
                                        font-bold
                                        text-left
                                        ${paymentMethod ===
                                            "cash"
                                            ? "border-pink-500 bg-pink-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className={`
                                            w-5
                                            h-5
                                            rounded-full
                                            border-2
                                            flex
                                            items-center
                                            justify-center
                                            ${paymentMethod ===
                                                "cash"
                                                ? "border-pink-500 bg-pink-500"
                                                : "border-slate-300"
                                            }
                                        `}>

                                            {paymentMethod ===
                                                "cash" && (

                                                    <div className="
                                                    w-2
                                                    h-2
                                                    bg-white
                                                    rounded-full
                                                " />

                                                )}

                                        </div>

                                        <div>

                                            <p className="
                                                text-slate-800
                                                text-sm
                                                md:text-base
                                            ">
                                                Cash di
                                                Booth /
                                                Toko
                                            </p>

                                            <p className="
                                                text-xs
                                                md:text-sm
                                                text-slate-500
                                                mt-1
                                            ">
                                                Bayar
                                                saat
                                                pengambilan
                                            </p>

                                        </div>

                                    </div>

                                </button>

                                <button
                                    onClick={() => {

                                        setPaymentMethod(
                                            "transfer"
                                        );

                                    }}
                                    className={`
                                        w-full
                                        p-4
                                        md:p-5
                                        rounded-xl
                                        md:rounded-2xl
                                        border-2
                                        transition-all
                                        font-bold
                                        text-left
                                        ${paymentMethod ===
                                            "transfer"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className={`
                                            w-5
                                            h-5
                                            rounded-full
                                            border-2
                                            flex
                                            items-center
                                            justify-center
                                            ${paymentMethod ===
                                                "transfer"
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-slate-300"
                                            }
                                        `}>

                                            {paymentMethod ===
                                                "transfer" && (

                                                    <div className="
                                                    w-2
                                                    h-2
                                                    bg-white
                                                    rounded-full
                                                " />

                                                )}

                                        </div>

                                        <div>

                                            <p className="
                                                text-slate-800
                                                text-sm
                                                md:text-base
                                            ">
                                                Transfer /
                                                QRIS
                                            </p>

                                            <p className="
                                                text-xs
                                                md:text-sm
                                                text-slate-500
                                                mt-1
                                            ">
                                                Transfer
                                                bank atau
                                                scan QRIS
                                            </p>

                                        </div>

                                    </div>

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT: ORDER SUMMARY STICKY */}
                    <div className="
                        lg:col-span-1
                    ">

                        <div className="
                            sticky
                            top-24
                            bg-white
                            rounded-2xl
                            md:rounded-3xl
                            p-5
                            md:p-6
                            shadow-lg
                            border
                            border-slate-100
                            space-y-4
                            md:space-y-5
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    md:text-sm
                                    text-slate-500
                                    uppercase
                                    font-bold
                                ">
                                    Total Items
                                </p>

                                <p className="
                                    text-lg
                                    md:text-xl
                                    font-black
                                    text-slate-800
                                    mt-1
                                ">
                                    {cart.reduce(
                                        (
                                            total,
                                            item
                                        ) => {

                                            return (
                                                total +
                                                item
                                                    .quantity
                                            );

                                        },
                                        0
                                    )}{" "}
                                    items
                                </p>

                            </div>

                            <div className="
                                h-px
                                bg-slate-200
                            " />

                            <div>

                                <p className="
                                    text-xs
                                    md:text-sm
                                    text-slate-500
                                    uppercase
                                    font-bold
                                ">
                                    Metode Bayar
                                </p>

                                <p className="
                                    text-lg
                                    md:text-xl
                                    font-black
                                    text-slate-800
                                    mt-1
                                ">
                                    {paymentMethod ===
                                        "cash"
                                        ? "Cash"
                                        : "Transfer"}
                                </p>

                            </div>

                            <div className="
                                h-px
                                bg-slate-200
                            " />

                            <div>

                                <p className="
                                    text-xs
                                    md:text-sm
                                    text-slate-500
                                    uppercase
                                    font-bold
                                ">
                                    Total Pembayaran
                                </p>

                                <p className="
                                    text-2xl
                                    md:text-3xl
                                    font-black
                                    text-pink-600
                                    mt-2
                                ">
                                    Rp{" "}
                                    {effectiveTotalPrice.toLocaleString(
                                        "id-ID"
                                    )}
                                </p>

                            </div>

                            <button
                                onClick={
                                    handleCheckout
                                }
                                disabled={
                                    isSubmitting ||
                                    effectiveCart.length ===
                                    0
                                }
                                className="
                                    w-full
                                    py-3
                                    md:py-4
                                    mt-6
                                    rounded-full
                                    bg-gradient-to-r
                                    from-pink-500
                                    via-rose-500
                                    to-orange-400
                                    text-white
                                    font-black
                                    text-sm
                                    md:text-base
                                    shadow-lg
                                    hover:shadow-xl
                                    hover:scale-105
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    disabled:scale-100
                                    disabled:hover:shadow-lg
                                    transition-all
                                    duration-300
                                "
                            >

                                {isSubmitting ? (

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    ">

                                        <div className="
                                            w-4
                                            h-4
                                            border-2
                                            border-white
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        " />

                                        Memproses...

                                    </div>

                                ) : (

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    ">

                                        <Package className="
                                            w-5
                                            h-5
                                        " />

                                        Pesan Sekarang

                                    </div>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

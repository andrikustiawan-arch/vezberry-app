import React, {
    useState,
    useMemo,
} from "react";

import {
    useLocation,
} from "react-router-dom";

import {
    toast,
} from "sonner";

import {
    processCheckout,
} from "@/lib/processCheckout";

export default function MobileCheckout() {

    const location =
        useLocation();

    const checkoutState =
        location.state || {};

    const {
        cart = [],

        totalPrice = 0,

        orders = [],

        dbProducts = [],

        setOrders,

        setDbProducts,

        setCart,

    } = checkoutState;

    const persistedCart = useMemo(() => {
        if (typeof window === "undefined") {
            return [];
        }

        try {
            return JSON.parse(
                localStorage.getItem("vezberry_cart") || "[]"
            ) || [];
        } catch (err) {
            return [];
        }
    }, []);

    const effectiveCart = cart.length ? cart : persistedCart;
    const effectiveTotalPrice = totalPrice || effectiveCart.reduce(
        (sum, item) =>
            sum +
            ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
        0
    );

    const [
        customerName,
        setCustomerName,
    ] = useState("");

    const [
        customerPhone,
        setCustomerPhone,
    ] = useState("");

    const [
        customerAddress,
        setCustomerAddress,
    ] = useState("");

    const [
        customerNotes,
        setCustomerNotes,
    ] = useState("");

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState("cash");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const storeName =
        "VEZBERRY";


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

        setIsSubmitting(true);

        try {

            await processCheckout({

                orderData: {

                    customer_name:
                        customerName,

                    phone:
                        customerPhone,

                    customer_address:
                        customerAddress,

                    notes:
                        customerNotes,

                },

                cart: effectiveCart,

                orders,

                dbProducts,

                totalPrice: effectiveTotalPrice,

                paymentMethod,

                setOrders,

                setDbProducts,

                setCart,

                toast,

            });

        } catch (err) {

            console.error(err);

            toast.error(
                "Checkout gagal"
            );

        } finally {

            setIsSubmitting(false);

        }

    };


    return (

        <div className="
            min-h-screen
            bg-[#faf8f6]
            overflow-y-auto
        ">

            <div className="
                max-w-md
                mx-auto
                px-4
                pt-6
                pb-32
            ">

                {/* HEADER */}

                <div className="
                    bg-white
                    rounded-[32px]
                    p-5
                    shadow-sm
                    border
                    border-slate-100
                ">

                    <h1 className="
                        text-3xl
                        font-black
                        text-slate-800
                    ">
                        Checkout
                    </h1>

                    <p className="
                        text-slate-500
                        mt-2
                    ">
                        Lengkapi data pesanan
                    </p>

                </div>

                {/* CART ITEMS */}

                <div className="
                    mt-5
                    bg-white
                    rounded-[32px]
                    p-5
                    shadow-sm
                    border
                    border-slate-100
                ">

                    <h2 className="
                        text-2xl
                        font-black
                        text-slate-800
                    ">
                        Ringkasan Pesanan
                    </h2>

                    <div className="
                        mt-5
                        space-y-4
                    ">

                        {cart.map((item) => {

                            const subtotal =
                                item.price *
                                item.quantity;

                            return (

                                <div
                                    key={item.id}
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                        pb-4
                                        border-b
                                        border-slate-100
                                    "
                                >

                                    <div>

                                        <h3 className="
                                            text-lg
                                            font-bold
                                            text-slate-800
                                        ">
                                            {item.name || item.product_name}
                                        </h3>

                                        <p className="
                                            mt-1
                                            text-slate-500
                                        ">
                                            Qty: {item.quantity}
                                        </p>

                                    </div>

                                    <p className="
                                        text-lg
                                        font-black
                                        text-pink-600
                                    ">
                                        Rp{" "}
                                        {subtotal.toLocaleString("id-ID")}
                                    </p>

                                </div>

                            );

                        })}

                    </div>

                </div>

                {/* FORM */}

                <div className="
                    mt-5
                    bg-white
                    rounded-[32px]
                    p-5
                    shadow-sm
                    border
                    border-slate-100
                ">

                    <div>

                        <label className="
                            block
                            mb-3
                            text-base
                            font-bold
                            text-slate-700
                        ">
                            Nama Customer
                        </label>

                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => {
                                setCustomerName(
                                    e.target.value
                                );
                            }}
                            placeholder="Nama lengkap"
                            className="
                                w-full
                                h-14
                                rounded-2xl
                                border
                                border-slate-200
                                px-4
                            "
                        />

                    </div>

                    <div className="mt-5">

                        <label className="
                            block
                            mb-3
                            text-base
                            font-bold
                            text-slate-700
                        ">
                            Nomor WhatsApp
                        </label>

                        <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => {
                                setCustomerPhone(
                                    e.target.value
                                );
                            }}
                            placeholder="08xxxxxxxxxx"
                            className="
                                w-full
                                h-14
                                rounded-2xl
                                border
                                border-slate-200
                                px-4
                            "
                        />

                    </div>

                    <div className="mt-5">

                        <label className="
                            block
                            mb-3
                            text-base
                            font-bold
                            text-slate-700
                        ">
                            Alamat Customer
                        </label>

                        <textarea
                            value={customerAddress}
                            onChange={(e) => {
                                setCustomerAddress(
                                    e.target.value
                                );
                            }}
                            placeholder="Alamat lengkap customer"
                            className="
                                w-full
                                h-32
                                rounded-2xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                resize-none
                            "
                        />

                    </div>

                    <div className="mt-5">

                        <label className="
                            block
                            mb-3
                            text-base
                            font-bold
                            text-slate-700
                        ">
                            Catatan
                        </label>

                        <textarea
                            value={customerNotes}
                            onChange={(e) => {
                                setCustomerNotes(
                                    e.target.value
                                );
                            }}
                            placeholder="Contoh: order PO masih hangat oven"
                            className="
                                w-full
                                h-32
                                rounded-2xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                resize-none
                            "
                        />

                    </div>

                </div>

                {/* PAYMENT */}

                <div className="
                    mt-5
                    bg-white
                    rounded-[32px]
                    p-5
                    shadow-sm
                    border
                    border-slate-100
                ">

                    <h2 className="
                        text-2xl
                        font-black
                        text-slate-800
                    ">
                        Metode Pembayaran
                    </h2>

                    <p className="
                        text-slate-500
                        mt-1
                    ">
                        Pilih metode pembayaran
                    </p>

                    <div
                        onClick={() => {
                            setPaymentMethod("cash");
                        }}
                        className={`
                            mt-5
                            rounded-[28px]
                            border-2
                            p-5
                            cursor-pointer
                            transition-all
                            ${paymentMethod === "cash"
                                ? "border-pink-500 bg-pink-50"
                                : "border-slate-200 bg-white"
                            }
                        `}
                    >

                        <h3 className="
                            text-lg
                            font-black
                            text-slate-800
                        ">
                            Cash di Booth / Toko
                        </h3>

                    </div>

                    <div
                        onClick={() => {
                            setPaymentMethod("transfer");
                        }}
                        className={`
                            mt-4
                            rounded-[28px]
                            border-2
                            p-5
                            cursor-pointer
                            transition-all
                            ${paymentMethod === "transfer"
                                ? "border-pink-500 bg-pink-50"
                                : "border-slate-200 bg-white"
                            }
                        `}
                    >

                        <h3 className="
                            text-lg
                            font-black
                            text-slate-800
                        ">
                            Transfer / QRIS
                        </h3>

                    </div>

                </div>

                {/* TOTAL */}

                <div className="
                    mt-5
                    bg-white
                    rounded-[32px]
                    p-5
                    shadow-sm
                    border
                    border-slate-100
                ">

                    <p className="
                        text-slate-500
                    ">
                        Total Pembayaran
                    </p>

                    <h2 className="
                        mt-2
                        text-3xl
                        font-black
                        text-pink-600
                    ">
                        Rp{" "}

                        {cart
                            .reduce(
                                (
                                    total,
                                    item
                                ) => {

                                    return (
                                        total +
                                        (
                                            item.price *
                                            item.quantity
                                        )
                                    );

                                },
                                0
                            )
                            .toLocaleString("id-ID")
                        }

                    </h2>

                </div>

                {/* BUTTON */}

                <div className="
                    mt-6
                ">

                    <button

                        onClick={handleCheckout}

                        disabled={isSubmitting}

                        className="
                            w-full
                            h-16
                            rounded-full
                            bg-gradient-to-r
                            from-pink-500
                            to-rose-600
                            text-white
                            text-xl
                            font-black

                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        {
                            isSubmitting

                                ? "Memproses..."

                                : "Pesan Sekarang"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
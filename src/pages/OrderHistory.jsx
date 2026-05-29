import React, {
    useEffect,
    useState,
} from "react";

import { api } from "@/lib/api";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {

    ShoppingBag,

    Calendar,

    CreditCard,

    Package,

    ArrowLeft,

    CheckCircle2,

    Clock3,

    XCircle,

    Truck,

} from "lucide-react";

import {
    format
} from "date-fns";

import {
    Link
} from "react-router-dom";

import {
    createPageUrl,
    getDeviceOrderIds,
    getOrderTotal,
} from "@/utils";

import {
    Button
} from "@/components/ui/button";



const statusConfig = {

    pending: {
        label: "Menunggu Pembayaran",
        color: "yellow"
    },

    processing: {
        label: "Diproses",
        color: "blue"
    },

    siap: {
        label: "Siap",
        color: "green"
    },

    selesai: {
        label: "Selesai",
        color: "green"
    },

    completed: {
        label: "Selesai",
        color: "green"
    }

};

export default function OrderHistory() {

    const [orders,
        setOrders] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    // ========================================
    // LOAD ORDERS
    // ========================================

    useEffect(() => {

        const deviceOrderIds = getDeviceOrderIds();

        api.orders.list()
            .then(storedOrders => {

                const filteredOrders = deviceOrderIds.length
                    ? storedOrders.filter(order => deviceOrderIds.includes(order.id))
                    : [];

                const sorted = [...filteredOrders].sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.createdAt ||
                                a.created_at ||
                                a.created_date ||
                                0
                            );

                        const dateB =
                            new Date(
                                b.createdAt ||
                                b.created_at ||
                                b.created_date ||
                                0
                            );

                        return dateB - dateA;

                    }
                );

                setOrders(sorted);

            })
            .catch(err => console.error("Gagal load riwayat order:", err))
            .finally(() => setLoading(false));

    }, []);

    // ========================================
    // FORMAT PRICE
    // ========================================

    const formatPrice = (price) => {

        return new Intl.NumberFormat(

            "id-ID",

            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }

        ).format(price);

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            min-h-screen
            bg-gradient-to-b
            from-[#fff7f8]
            via-white
            to-[#fff2f5]
        ">

            {/* HEADER */}

            <header className="
    sticky
    top-0
    z-50
    bg-white/80
    backdrop-blur-2xl
    border-b
    border-rose-100
">

                <div className="
        max-w-6xl
        mx-auto
        px-4
        py-4
    ">

                    <div className="
            flex
            items-center
            gap-4
        ">

                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                    rounded-full
                "
                            onClick={() => {

                                if (
                                    window.history.length > 1
                                ) {

                                    window.history.back();

                                } else {

                                    window.location.href = "/";

                                }

                            }}
                        >

                            <ArrowLeft
                                className="
                        w-5
                        h-5
                    "
                            />

                        </Button>

                        <div className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-pink-500
                via-rose-500
                to-orange-400
                flex
                items-center
                justify-center
                shadow-xl
            ">

                            <ShoppingBag
                                className="
                        text-white
                    "
                                size={28}
                            />

                        </div>

                        <div>

                            <h1 className="
                    text-3xl
                    font-black
                    tracking-tight
                    bg-gradient-to-r
                    from-pink-600
                    to-rose-600
                    bg-clip-text
                    text-transparent
                ">
                                Riwayat Pesanan
                            </h1>

                            <p className="
                    text-sm
                    text-slate-500
                    mt-1
                ">
                                VEZBERRY Order History
                            </p>

                        </div>

                    </div>

                </div>

            </header>

            {/* MAIN */}

            <main className="
                max-w-5xl
                mx-auto
                px-4
                py-10
            ">

                {/* LOADING */}

                {loading ? (

                    <div className="
                        flex
                        items-center
                        justify-center
                        py-32
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-full
                            border-4
                            border-pink-200
                            border-t-pink-500
                            animate-spin
                        " />

                    </div>

                ) : orders.length === 0 ? (

                    // EMPTY

                    <motion.div

                        initial={{
                            opacity: 0,
                            y: 30
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        className="
                            text-center
                            py-28
                        "
                    >

                        <div className="
                            w-32
                            h-32
                            rounded-full
                            bg-pink-50
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-8
                        ">

                            <ShoppingBag
                                className="
                                    w-16
                                    h-16
                                    text-pink-300
                                "
                            />

                        </div>

                        <h2 className="
                            text-4xl
                            font-black
                            text-slate-800
                        ">
                            Belum Ada Pesanan
                        </h2>

                        <p className="
                            text-slate-500
                            mt-4
                            text-lg
                        ">
                            Anda belum pernah melakukan pemesanan
                        </p>

                        <Link
                            to={createPageUrl("Home")}
                        >

                            <Button className="
                                mt-8
                                h-14
                                px-8
                                rounded-2xl
                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500
                            ">

                                Mulai Belanja

                            </Button>

                        </Link>

                    </motion.div>

                ) : (

                    // ORDERS

                    <div className="
                        space-y-8
                    ">

                        <AnimatePresence>

                            {orders.map(
                                (order, index) => {

                                    const statusKey =
                                        String(order.status || "")
                                            .toLowerCase()
                                            .trim();

                                    const status =
                                        statusConfig[statusKey] ||
                                        statusConfig.pending;

                                    const StatusIcon =
                                        status.icon;

                                    return (

                                        <motion.div

                                            key={order.id}

                                            initial={{
                                                opacity: 0,
                                                y: 30
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}

                                            transition={{
                                                delay:
                                                    index * 0.05
                                            }}

                                            className="
                                                rounded-[32px]
                                                overflow-hidden
                                                border
                                                border-slate-200
                                                bg-white
                                                shadow-sm
                                                hover:shadow-2xl
                                                transition-all
                                            "
                                        >

                                            {/* HEADER */}

                                            <div className="
                                                bg-gradient-to-r
                                                from-pink-50
                                                to-rose-50
                                                border-b
                                                px-7
                                                py-6
                                            ">

                                                <div className="
                                                    flex
                                                    flex-col
                                                    md:flex-row
                                                    md:items-start
                                                    md:justify-between
                                                    gap-5
                                                ">

                                                    {/* LEFT */}

                                                    <div>

                                                        <h3 className="
                                                            text-2xl
                                                            font-black
                                                            text-slate-800
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <Package
                                                                className="
                                                                    text-pink-500
                                                                "
                                                            />

                                                            Pesanan #

                                                            {
                                                                order.id
                                                                    ?.slice(0, 8)
                                                                    ?.toUpperCase()
                                                            }

                                                        </h3>

                                                        <div className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-5
                                                            mt-4
                                                            text-sm
                                                            text-slate-500
                                                        ">

                                                            <div className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            ">

                                                                <Calendar
                                                                    size={16}
                                                                />

                                                                {
                                                                    (() => {

                                                                        const dateValue =
                                                                            order.createdAt ||
                                                                            order.created_at ||
                                                                            order.created_date;

                                                                        if (!dateValue)
                                                                            return "-";

                                                                        const parsedDate =
                                                                            new Date(dateValue);

                                                                        if (isNaN(parsedDate.getTime()))
                                                                            return "-";

                                                                        return format(
                                                                            parsedDate,
                                                                            "dd MMM yyyy • HH:mm"
                                                                        );

                                                                    })()
                                                                }

                                                            </div>

                                                            <div className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            ">

                                                                <CreditCard
                                                                    size={16}
                                                                />

                                                                {
                                                                    order.payment_method === "qris"

                                                                        ? "QRIS"

                                                                        : "Cash"
                                                                }

                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* STATUS */}

                                                    <div className={`
                                                        px-5
                                                        py-3
                                                        rounded-2xl
                                                        border
                                                        flex
                                                        items-center
                                                        gap-2
                                                        font-bold
                                                        ${status.className}
                                                    `}>

                                                        <StatusIcon
                                                            size={18}
                                                        />

                                                        {
                                                            status.label
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                            {/* CONTENT */}

                                            <div className="
                                                p-7
                                            ">

                                                {/* CUSTOMER */}

                                                <div className="
                                                    rounded-2xl
                                                    bg-slate-50
                                                    p-5
                                                    mb-6
                                                ">

                                                    <p className="
                                                        text-sm
                                                        text-slate-400
                                                    ">
                                                        Customer
                                                    </p>

                                                    <h4 className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-800
                                                        mt-1
                                                    ">
                                                        {
                                                            order.customer_name
                                                        }
                                                    </h4>

                                                    {
                                                        (order.phone || order.customer_phone) && (

                                                            <p className="
            text-slate-500
            mt-2
        ">
                                                                {order.phone || order.customer_phone}
                                                            </p>

                                                        )
                                                    }

                                                </div>

                                                {/* ITEMS */}

                                                <div className="
                                                    space-y-4
                                                ">

                                                    {order.items?.map(
                                                        (item, idx) => (

                                                            <div

                                                                key={idx}

                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    gap-4
                                                                    rounded-2xl
                                                                    border
                                                                    border-slate-100
                                                                    p-5
                                                                "
                                                            >

                                                                <div>

                                                                    <h5 className="
                                                                        font-bold
                                                                        text-slate-800
                                                                    ">

                                                                        {
                                                                            item.product_name
                                                                        }

                                                                    </h5>

                                                                    <p className="
                                                                        text-sm
                                                                        text-slate-500
                                                                        mt-1
                                                                    ">

                                                                        {
                                                                            item.quantity
                                                                        }

                                                                        x

                                                                        {
                                                                            formatPrice(
                                                                                item.price
                                                                            )
                                                                        }

                                                                    </p>

                                                                </div>

                                                                <div className="
                                                                    text-right
                                                                ">

                                                                    <p className="
                                                                        text-lg
                                                                        font-black
                                                                        text-pink-600
                                                                    ">

                                                                        {
                                                                            formatPrice(
                                                                                item.quantity *
                                                                                item.price
                                                                            )
                                                                        }

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                                {/* TOTAL */}

                                                <div className="
                                                    mt-7
                                                    pt-7
                                                    border-t
                                                    flex
                                                    items-center
                                                    justify-between
                                                ">

                                                    <span className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-700
                                                    ">
                                                        Total
                                                    </span>

                                                    <span className="
                                                        text-4xl
                                                        font-black
                                                        bg-gradient-to-r
                                                        from-pink-600
                                                        to-rose-600
                                                        bg-clip-text
                                                        text-transparent
                                                    ">

                                                        {
                                                            formatPrice(
                                                                getOrderTotal(order)
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        </motion.div>

                                    );

                                }
                            )}

                        </AnimatePresence>

                    </div>

                )}

            </main>

        </div>

    );

}
import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
} from "react";

import {
    motion,
} from "framer-motion";

import AdminLayout from "@/components/admin/AdminLayout";

import { api } from "@/lib/api";



import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {

    Package,
    ShoppingCart,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    Star,
    CreditCard,
    Banknote,
    QrCode,
    Wallet,
    Activity,
    ArrowUpRight,
    Sparkles,
    TrendingUp,

} from "lucide-react";

// ========================================
// FORMAT PRICE
// ========================================

const formatPrice = (price) =>

    new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }
    ).format(price || 0);

// ========================================
// DASHBOARD
// ========================================

export default function Dashboard() {

    // ========================================
    // STATES
    // ========================================

    const [
        orders,
        setOrders,
    ] = useState([]);

    const [
        products,
        setProducts,
    ] = useState([]);

    const [
        settings,
        setSettings,
    ] = useState({});

    // ========================================
    // LOAD DATA DARI SERVER
    // ========================================

    useEffect(() => {

        Promise.all([
            api.orders.list(),
            api.products.list(),
            api.settings.get(),
        ])
            .then(([storedOrders, storedProducts, storedSettings]) => {
                setOrders(storedOrders);
                setProducts(storedProducts);
                setSettings(storedSettings);
            })
            .catch(err => console.error("Gagal load dashboard:", err));

    }, []);
    // ========================================
    // STATUS COUNT
    // ========================================

    const pending =

        orders.filter(
            o => o.status === "pending"
        ).length;

    const inOrder =

        orders.filter(
            o => o.status === "in_order"
        ).length;

    const paid =

        orders.filter(
            o =>
                o.status === "paid" ||
                o.status === "completed"
        ).length;

    // ========================================
    // REVENUE
    // ========================================

    const totalRevenue =

        orders

            .filter(
                o =>
                    o.status === "paid" ||
                    o.status === "completed"
            )

            .reduce(
                (sum, order) =>

                    sum + (
                        order.total_amount || 0
                    ),

                0
            );

    // ========================================
    // TOP BUYERS
    // ========================================

    const topBuyers =
        useMemo(() => {

            const buyerMap = {};

            orders.forEach(order => {

                const key =
                    order.customer_name ||
                    "Unknown";

                if (!buyerMap[key]) {

                    buyerMap[key] = {

                        name: key,

                        phone:
                            order.customer_phone,

                        count: 0,

                        total: 0,

                    };

                }

                buyerMap[key].count += 1;

                buyerMap[key].total +=
                    order.total_amount || 0;

            });

            return Object.values(
                buyerMap
            )

                .sort(
                    (a, b) =>
                        b.count - a.count
                )

                .slice(0, 5);

        }, [orders]);

    // ========================================
    // TOP PRODUCTS
    // ========================================

    const topProducts =
        useMemo(() => {

            const productMap = {};

            orders.forEach(order => {

                (order.items || []).forEach(item => {

                    const key =
                        item.product_name ||
                        "Unknown";

                    if (!productMap[key]) {

                        productMap[key] = {

                            name: key,

                            qty: 0,

                            revenue: 0,

                        };

                    }

                    productMap[key].qty +=
                        item.quantity || 1;

                    productMap[key].revenue +=

                        (item.price || 0) *
                        (item.quantity || 1);

                });

            });

            return Object.values(
                productMap
            )

                .sort(
                    (a, b) =>
                        b.qty - a.qty
                )

                .slice(0, 5);

        }, [orders]);
    // ========================================
    // PAYMENT STATS
    // ========================================

    const paymentMap = {

        qris: 0,
        transfer: 0,
        cash: 0,

    };

    orders.forEach(order => {

        const method =
            order.payment_method || "qris";

        paymentMap[method] =
            (paymentMap[method] || 0) + 1;

    });

    const paymentStats = [

        {
            label: "QRIS",
            count: paymentMap.qris,
            icon: QrCode,
            gradient:
                "from-blue-500 to-cyan-500",
        },

        {
            label: "Transfer",
            count: paymentMap.transfer,
            icon: CreditCard,
            gradient:
                "from-violet-500 to-purple-500",
        },

        {
            label: "Cash",
            count: paymentMap.cash,
            icon: Banknote,
            gradient:
                "from-emerald-500 to-green-500",
        },

    ];

    // ========================================
    // STAT CARDS
    // ========================================

    const stats = [

        {
            label: "Total Produk",
            value: products.length,
            icon: Package,
            gradient:
                "from-blue-500 to-cyan-500",
        },

        {
            label: "Pending",
            value: pending,
            icon: Clock,
            gradient:
                "from-yellow-500 to-orange-500",
        },

        {
            label: "In Order",
            value: inOrder,
            icon: AlertCircle,
            gradient:
                "from-orange-500 to-amber-500",
        },

        {
            label: "Lunas",
            value: paid,
            icon: CheckCircle,
            gradient:
                "from-green-500 to-emerald-500",
        },

        {
            label: "Total Pesanan",
            value: orders.length,
            icon: ShoppingCart,
            gradient:
                "from-violet-500 to-purple-500",
        },

        {
            label: "Revenue",
            value:
                formatPrice(totalRevenue),
            icon: Wallet,
            gradient:
                "from-pink-500 to-rose-500",
        },

    ];

    // ========================================
    // RECENT ORDERS
    // ========================================

    const recentOrders =

        [...orders]

            .sort(

                (a, b) =>

                    new Date(
                        b.created_date
                    ) -

                    new Date(
                        a.created_date
                    )

            )

            .slice(0, 5);
    // ========================================
    // STATUS MAP
    // ========================================

    const statusMap = {

        pending: [
            "bg-yellow-100 text-yellow-700 border-yellow-200",
            "Pending"
        ],

        in_order: [
            "bg-orange-100 text-orange-700 border-orange-200",
            "In Order"
        ],

        paid: [
            "bg-green-100 text-green-700 border-green-200",
            "Lunas"
        ],

        completed: [
            "bg-blue-100 text-blue-700 border-blue-200",
            "Selesai"
        ],

        cancelled: [
            "bg-red-100 text-red-700 border-red-200",
            "Batal"
        ],

    };

    // ========================================
    // UI
    // ========================================

    return (

        <AdminLayout>

            <div className="
                relative

                space-y-5
                md:space-y-8

                pb-[140px]
                md:pb-24
            ">

                {/* FLOATING GLOW */}

                <div className="
                    fixed
                    -top-32
                    -right-32

                    w-[260px]
                    h-[260px]

                    md:w-[450px]
                    md:h-[450px]

                    rounded-full

                    bg-pink-500/15

                    blur-3xl

                    pointer-events-none
                " />

                <div className="
                    fixed
                    -bottom-32
                    -left-32

                    w-[260px]
                    h-[260px]

                    md:w-[450px]
                    md:h-[450px]

                    rounded-full

                    bg-violet-500/10

                    blur-3xl

                    pointer-events-none
                " />

                {/* HERO */}

                <motion.div

                    initial={{
                        opacity: 0,
                        y: 20,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    className="
                        relative
                        overflow-hidden

                        rounded-[24px]
                        md:rounded-[40px]

                        bg-gradient-to-r
                        from-[#5c6cff]
                        via-[#8e71ff]
                        to-[#f76d9d]
                        shadow-[0_20px_60px_rgba(140,90,255,0.25)]

                        p-4
                        sm:p-5
                        md:p-10

                        text-white
                        drop-shadow-sm

                        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                    "
                >

                    {/* GLOW */}

                    <div className="
                        absolute
                        top-0
                        right-0

                        w-40
                        h-40

                        md:w-72
                        md:h-72

                        rounded-full

                        bg-pink-500/20

                        blur-3xl
                    " />

                    <div className="
                        relative
                        z-10
                    ">

                        {/* BADGE */}

                        <div className="
                            inline-flex
                            items-center

                            gap-2

                            h-10
                            md:h-12

                            px-4
                            md:px-5

                            rounded-full

                            bg-white/18
                            backdrop-blur-xl             

                            border
                            border-white/10

                            backdrop-blur-xl

                            text-white

                            text-xs
                            md:text-base

                            font-bold
                        ">

                            <Sparkles
                                size={16}
                            />

                            VEZBERRY ANALYTICS

                        </div>

                        {/* TITLE */}

                        <h1 className="
                            mt-5
                            md:mt-8

                            text-2xl
                            sm:text-4xl
                            md:text-7xl

                            font-black

                            leading-tight
                        ">

                            Dashboard

                        </h1>

                        {/* DESC */}

                        <p className="
                            mt-4
                            md:mt-6

                            max-w-2xl

                            text-xs
                            sm:text-base
                            md:text-2xl

                            text-white/80

                            leading-relaxed
                        ">

                            Monitoring penjualan,
                            order,
                            pelanggan,
                            dan performa bisnis
                            secara realtime.

                        </p>

                    </div>

                </motion.div>

                {/* MAIN GRID */}

                <div className="
                    grid

                    lg:grid-cols-1
                    xl:grid-cols-3                    

                    gap-4
                    md:gap-6
                ">

                    {/* RECENT ORDERS */}

                    <Card className="
                        xl:col-span-2

                        rounded-[24px]
                        md:rounded-[36px]

                        border-white/30

                        bg-white/80

                        backdrop-blur-2xl

                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                    ">

                        <CardHeader className="
                            pb-2
                            md:pb-4
                        ">

                            <CardTitle className="
                                flex
                                items-center
                                justify-between

                                gap-3
                            ">

                                {/* LEFT */}

                                <div>

                                    <h2 className="
                                        text-xl
                                        sm:text-2xl
                                        md:text-3xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Recent Orders

                                    </h2>

                                    <p className="
                                        mt-1
                                        md:mt-2

                                        text-xs
                                        sm:text-sm

                                        text-slate-500

                                        font-normal
                                    ">

                                        Order terbaru customer

                                    </p>

                                </div>

                                {/* ICON */}

                                <div className="
                                    w-12
                                    h-12

                                    md:w-14
                                    md:h-14

                                    rounded-2xl
                                    md:rounded-3xl

                                    bg-pink-100

                                    flex
                                    items-center
                                    justify-center

                                    flex-shrink-0
                                ">

                                    <ShoppingCart
                                        className="
                                            text-pink-500
                                        "
                                        size={22}
                                    />

                                </div>

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="
                            space-y-3
                            md:space-y-4
                        ">

                            {recentOrders.length > 0 ? (

                                recentOrders.map(order => {

                                    const statusData =

                                        statusMap[
                                        order.status
                                        ] ||

                                        statusMap.pending;

                                    return (

                                        <div

                                            key={
                                                order.id
                                            }

                                            className="
                                                rounded-2xl
                                                md:rounded-3xl

                                                border
                                                border-slate-100

                                                bg-slate-50/70

                                                p-4
                                                md:p-5

                                                hover:bg-white

                                                transition-all
                                            "
                                        >

                                            <div className="
                                                flex

                                                flex-col
                                                sm:flex-row

                                                sm:items-center
                                                sm:justify-between

                                                gap-4
                                            ">

                                                {/* LEFT */}

                                                <div className="
                                                    min-w-0
                                                ">

                                                    <h3 className="
                                                        text-lg
                                                        md:text-xl

                                                        font-black

                                                        text-slate-800

                                                        truncate
                                                    ">

                                                        {
                                                            order.customer_name
                                                        }

                                                    </h3>

                                                    <p className="
                                                        mt-1

                                                        text-sm
                                                        md:text-base

                                                        text-slate-500

                                                        truncate
                                                    ">

                                                        {
                                                            order.customer_phone
                                                        }

                                                    </p>

                                                </div>

                                                {/* RIGHT */}

                                                <div className="
                                                    w-full
                                                    sm:w-auto

                                                    sm:text-right                                                   
                                                ">

                                                    {/* PRICE */}

                                                    <div className="
                                                        text-lg
                                                        md:text-xl

                                                        font-black

                                                        text-pink-600
                                                    ">

                                                        {
                                                            formatPrice(
                                                                order.total_amount || 0
                                                            )
                                                        }

                                                    </div>

                                                    {/* STATUS */}

                                                    <div className={`
                                                        mt-2

                                                        inline-flex

                                                        items-center

                                                        gap-2

                                                        px-3
                                                        md:px-4

                                                        h-8
                                                        md:h-9

                                                        rounded-full

                                                        border

                                                        text-xs
                                                        md:text-sm

                                                        font-black

                                                        ${statusData[0]}
                                                    `}>

                                                        {
                                                            statusData[1]
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                })

                            ) : (

                                <div className="
                                    py-10
                                    md:py-16

                                    text-center
                                ">

                                    {/* ICON */}

                                    <div className="
                                        w-16
                                        h-16

                                        md:w-20
                                        md:h-20

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
                                            size={30}
                                        />

                                    </div>

                                    {/* TITLE */}

                                    <h3 className="
                                        mt-5
                                        md:mt-6

                                        text-xl
                                        md:text-2xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Belum ada order

                                    </h3>

                                    {/* DESC */}

                                    <p className="
                                        mt-2

                                        text-sm
                                        md:text-base

                                        text-slate-500
                                    ">

                                        Order customer akan tampil di sini

                                    </p>

                                </div>

                            )}

                        </CardContent>

                    </Card>
                    {/* STORE INFO */}

                    <Card className="
                        overflow-hidden

                        rounded-[24px]
                        md:rounded-[36px]

                        border-0

                        bg-gradient-to-br
                        from-pink-500
                        via-rose-500
                        to-orange-400

                        text-white

                        shadow-[0_20px_60px_rgba(255,80,120,0.25)]
                    ">

                        <CardContent className="
                            relative

                            p-5
                            md:p-7
                        ">

                            {/* GLOW */}

                            <div className="
                                absolute
                                -top-16
                                -right-16

                                w-40
                                h-40

                                md:w-52
                                md:h-52

                                rounded-full

                                bg-white/20

                                blur-3xl
                            " />

                            <div className="
                                relative
                                z-10
                            ">

                                {/* LOGO */}

                                {settings.logo_url && (

                                    <img

                                        src={
                                            settings.logo_url
                                        }

                                        alt="logo"

                                        className="
                                            w-20
                                            h-20

                                            md:w-24
                                            md:h-24

                                            rounded-2xl
                                            md:rounded-3xl

                                            object-cover

                                            border
                                            border-white/20

                                            shadow-xl
                                        "
                                    />

                                )}

                                {/* TITLE */}

                                <h2 className="
                                    mt-6
                                    md:mt-8

                                    text-3xl
                                    md:text-4xl

                                    font-black
                                ">

                                    {
                                        settings.store_name ||
                                        "VEZBERRY"
                                    }

                                </h2>

                                {/* DESC */}

                                <p className="
                                    mt-3
                                    md:mt-4

                                    text-sm
                                    md:text-base

                                    text-white/85

                                    leading-relaxed
                                ">

                                    {
                                        settings.store_description ||

                                        "Premium dessert & modern drink experience."
                                    }

                                </p>

                                {/* MINI STATS */}

                                <div className="
                                    mt-7
                                    md:mt-10

                                    grid
                                    grid-cols-2

                                    gap-3
                                    md:gap-4
                                ">

                                    {/* COMPLETED */}

                                    <div className="
                                        rounded-2xl
                                        md:rounded-3xl

                                        bg-white/10

                                        border
                                        border-white/10

                                        backdrop-blur-xl

                                        p-4
                                        md:p-5
                                    ">

                                        <div className="
                                            text-2xl
                                            md:text-3xl

                                            font-black
                                        ">

                                            {
                                                paid
                                            }

                                        </div>

                                        <div className="
                                            mt-1
                                            md:mt-2

                                            text-white/70

                                            text-xs
                                            md:text-sm
                                        ">

                                            Completed

                                        </div>

                                    </div>

                                    {/* PRODUCTS */}

                                    <div className="
                                        rounded-2xl
                                        md:rounded-3xl

                                        bg-white/10

                                        border
                                        border-white/10

                                        backdrop-blur-xl

                                        p-4
                                        md:p-5
                                    ">

                                        <div className="
                                            text-2xl
                                            md:text-3xl

                                            font-black
                                        ">

                                            {
                                                products.length
                                            }

                                        </div>

                                        <div className="
                                            mt-1
                                            md:mt-2

                                            text-white/70

                                            text-xs
                                            md:text-sm
                                        ">

                                            Products

                                        </div>

                                    </div>

                                </div>

                                {/* TREND */}

                                <div className="
                                    mt-7
                                    md:mt-10

                                    rounded-2xl
                                    md:rounded-3xl

                                    bg-white/10

                                    border
                                    border-white/10

                                    backdrop-blur-xl

                                    p-4
                                    md:p-5

                                    flex
                                    items-center

                                    gap-3
                                    md:gap-4
                                ">

                                    {/* ICON */}

                                    <div className="
                                        w-12
                                        h-12

                                        md:w-14
                                        md:h-14

                                        rounded-2xl

                                        bg-white/15

                                        flex
                                        items-center
                                        justify-center

                                        flex-shrink-0
                                    ">

                                        <TrendingUp
                                            size={24}
                                        />

                                    </div>

                                    {/* TEXT */}

                                    <div className="
                                        min-w-0
                                    ">

                                        <div className="
                                            text-lg
                                            md:text-xl

                                            font-black
                                        ">

                                            Business Growing

                                        </div>

                                        <div className="
                                            mt-1

                                            text-white/70

                                            text-xs
                                            md:text-sm
                                        ">

                                            Sistem toko berjalan normal

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                </div>
                {/* ANALYTICS */}

                <div className="
                    grid

                    md:grid-cols-2
                    xl:grid-cols-3                  

                    gap-4
                    md:gap-6
                ">

                    {/* TOP BUYERS */}

                    <Card className="
                        rounded-[24px]
                        md:rounded-[36px]

                        border-white/30

                        bg-white/80

                        backdrop-blur-2xl

                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                    ">

                        <CardHeader>

                            <CardTitle className="
                                flex
                                items-center
                                justify-between
                            ">

                                {/* TITLE */}

                                <div>

                                    <h2 className="
                                        text-xl
                                        md:text-2xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Top Buyers

                                    </h2>

                                    <p className="
                                        mt-1

                                        text-xs
                                        md:text-sm

                                        text-slate-500

                                        font-normal
                                    ">

                                        Customer paling aktif

                                    </p>

                                </div>

                                {/* ICON */}

                                <div className="
                                    w-12
                                    h-12

                                    rounded-2xl

                                    bg-blue-100

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Users
                                        className="
                                            text-blue-500
                                        "
                                        size={22}
                                    />

                                </div>

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="
                            space-y-3
                        ">

                            {topBuyers.length > 0 ? (

                                topBuyers.map((buyer, index) => (

                                    <div

                                        key={index}

                                        className="
                                            flex
                                            items-center
                                            justify-between

                                            gap-3

                                            rounded-2xl

                                            bg-slate-50

                                            border
                                            border-slate-100

                                            p-4
                                        "
                                    >

                                        {/* LEFT */}

                                        <div className="
                                            flex
                                            items-center

                                            gap-3

                                            min-w-0
                                        ">

                                            {/* AVATAR */}

                                            <div className="
                                                w-11
                                                h-11

                                                rounded-2xl

                                                bg-gradient-to-r
                                                from-blue-500
                                                to-cyan-500

                                                text-white

                                                flex
                                                items-center
                                                justify-center

                                                font-black

                                                flex-shrink-0
                                            ">

                                                {
                                                    buyer.name?.charAt(0)
                                                }

                                            </div>

                                            {/* INFO */}

                                            <div className="
                                                min-w-0
                                            ">

                                                <div className="
                                                    font-black

                                                    text-slate-800

                                                    truncate
                                                ">

                                                    {
                                                        buyer.name
                                                    }

                                                </div>

                                                <div className="
                                                    text-xs

                                                    text-slate-500
                                                ">

                                                    {
                                                        buyer.count
                                                    } order

                                                </div>

                                            </div>

                                        </div>

                                        {/* TOTAL */}

                                        <div className="
                                            text-right
                                            flex-shrink-0
                                        ">

                                            <div className="
                                                font-black

                                                text-pink-600

                                                text-sm
                                            ">

                                                {
                                                    formatPrice(
                                                        buyer.total
                                                    )
                                                }

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="
                                    py-10

                                    text-center

                                    text-slate-400
                                ">

                                    Belum ada data

                                </div>

                            )}

                        </CardContent>

                    </Card>
                    {/* TOP PRODUCTS */}

                    <Card className="
                        rounded-[24px]
                        md:rounded-[36px]

                        border-white/30

                        bg-white/80

                        backdrop-blur-2xl

                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                    ">

                        <CardHeader>

                            <CardTitle className="
                                flex
                                items-center
                                justify-between
                            ">

                                {/* TITLE */}

                                <div>

                                    <h2 className="
                                        text-xl
                                        md:text-2xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Top Products

                                    </h2>

                                    <p className="
                                        mt-1

                                        text-xs
                                        md:text-sm

                                        text-slate-500

                                        font-normal
                                    ">

                                        Produk terlaris

                                    </p>

                                </div>

                                {/* ICON */}

                                <div className="
                                    w-12
                                    h-12

                                    rounded-2xl

                                    bg-pink-100

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Star
                                        className="
                                            text-pink-500
                                        "
                                        size={22}
                                    />

                                </div>

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="
                            space-y-3
                        ">

                            {topProducts.length > 0 ? (

                                topProducts.map((item, index) => (

                                    <div

                                        key={index}

                                        className="
                                            rounded-2xl

                                            bg-slate-50

                                            border
                                            border-slate-100

                                            p-4
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            justify-between

                                            gap-3
                                        ">

                                            {/* LEFT */}

                                            <div className="
                                                min-w-0
                                            ">

                                                <div className="
                                                    font-black

                                                    text-slate-800

                                                    truncate
                                                ">

                                                    {
                                                        item.name
                                                    }

                                                </div>

                                                <div className="
                                                    mt-1

                                                    text-xs

                                                    text-slate-500
                                                ">

                                                    {
                                                        item.qty
                                                    } item terjual

                                                </div>

                                            </div>

                                            {/* BADGE */}

                                            <div className="
                                                h-9

                                                px-3

                                                rounded-full

                                                bg-pink-100

                                                text-pink-600

                                                text-sm

                                                font-black

                                                flex
                                                items-center
                                                justify-center

                                                flex-shrink-0
                                            ">

                                                #
                                                {
                                                    index + 1
                                                }

                                            </div>

                                        </div>

                                        {/* REVENUE */}

                                        <div className="
                                            mt-4

                                            text-lg

                                            font-black

                                            text-pink-600
                                        ">

                                            {
                                                formatPrice(
                                                    item.revenue
                                                )
                                            }

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="
                                    py-10

                                    text-center

                                    text-slate-400
                                ">

                                    Belum ada data

                                </div>

                            )}

                        </CardContent>

                    </Card>
                    {/* PAYMENT */}

                    <Card className="
                        rounded-[24px]
                        md:rounded-[36px]

                        border-white/30

                        bg-white/80

                        backdrop-blur-2xl

                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                    ">

                        <CardHeader>

                            <CardTitle className="
                                flex
                                items-center
                                justify-between
                            ">

                                {/* TITLE */}

                                <div>

                                    <h2 className="
                                        text-xl
                                        md:text-2xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Payment Stats

                                    </h2>

                                    <p className="
                                        mt-1

                                        text-xs
                                        md:text-sm

                                        text-slate-500

                                        font-normal
                                    ">

                                        Metode pembayaran

                                    </p>

                                </div>

                                {/* ICON */}

                                <div className="
                                    w-12
                                    h-12

                                    rounded-2xl

                                    bg-emerald-100

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Activity
                                        className="
                                            text-emerald-500
                                        "
                                        size={22}
                                    />

                                </div>

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="
                            space-y-4
                        ">

                            {paymentStats.map((item, index) => {

                                const Icon =
                                    item.icon;

                                return (

                                    <div

                                        key={index}

                                        className="
                                            flex
                                            items-center
                                            justify-between

                                            gap-3

                                            rounded-2xl

                                            bg-slate-50

                                            border
                                            border-slate-100

                                            p-4
                                        "
                                    >

                                        {/* LEFT */}

                                        <div className="
                                            flex
                                            items-center

                                            gap-3
                                        ">

                                            {/* ICON */}

                                            <div className={`
                                                w-11
                                                h-11

                                                rounded-2xl

                                                bg-gradient-to-r

                                                ${item.gradient}

                                                text-white

                                                flex
                                                items-center
                                                justify-center

                                                shadow-lg
                                            `}>

                                                <Icon
                                                    size={20}
                                                />

                                            </div>

                                            {/* TEXT */}

                                            <div>

                                                <div className="
                                                    font-black

                                                    text-slate-800
                                                ">

                                                    {
                                                        item.label
                                                    }

                                                </div>

                                                <div className="
                                                    text-xs

                                                    text-slate-500
                                                ">

                                                    Payment Method

                                                </div>

                                            </div>

                                        </div>

                                        {/* COUNT */}

                                        <div className="
                                            text-2xl

                                            font-black

                                            text-slate-800
                                        ">

                                            {
                                                item.count
                                            }

                                        </div>

                                    </div>

                                );

                            })}

                        </CardContent>

                    </Card>

                </div>

            </div>

        </AdminLayout>

    );

}
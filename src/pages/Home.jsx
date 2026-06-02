import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from 'react';

import { api } from '@/lib/api';

import {
    motion,
} from 'framer-motion';

import {
    toast,
} from 'sonner';

import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import {
    createPageUrl,
} from '@/utils';

import {
    Button,
} from '@/components/ui/button';

import {
    ShoppingBag,
    Settings,
    Clock3,
    ShoppingCart,
    AlertTriangle,
    ShieldCheck,
} from 'lucide-react';

import HeroSlider from '@/components/HeroSlider';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import SocialLinks from '@/components/SocialLinks';
import StoreInfoBar from '@/components/StoreInfoBar';
import BottomNav from '@/components/BottomNav';
import PrayerHeader from '@/components/PrayerHeader';

import {
    getStoreStatus,
} from "@/lib/storeStatus";

import {

    applyPreorderCapacityLogic,

    buildPreorderWhatsAppText,

} from "@/utils/preorder";

import {
    processCheckout,
} from "@/lib/processCheckout";

// ========================================
// FALLBACK PRODUCTS
// ========================================

const fallbackProducts = [

    {
        id: 1,

        name: "Pizza Beef",

        category: "pizza",

        description:
            "Pizza premium beef dengan topping melimpah.",

        price: 120000,

        discount_percentage: 15,

        image_url:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",

        is_new: true,

        is_preorder: true,

        ready_after_days: 2,

        daily_capacity: 20,

        preorder_closed: false,
    },

    {
        id: 2,

        name: "Pizza Mozza",

        category: "pizza",

        description:
            "Mozzarella melt premium pizza.",

        price: 115000,

        discount_percentage: 10,

        image_url:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    },

];

// ========================================
// COMPONENT
// ========================================

export default function Home() {

    const productsRef =
        useRef(null);

    const location =
        useLocation();

    const navigate =
        useNavigate();

    // ========================================
    // STATES
    // ========================================

    const [
        activeCategory,
        setActiveCategory
    ] = useState('pizza');

    const [
        cart,
        setCart
    ] = useState(() => {
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
    });

    const [
        adminTapCount,
        setAdminTapCount
    ] = useState(0);

    const [
        cartOpen,
        setCartOpen
    ] = useState(false);

    const [
        dbProducts,
        setDbProducts
    ] = useState([]);

    const [
        slides,
        setSlides
    ] = useState([]);

    const [
        settings,
        setSettings
    ] = useState([]);

    // ========================================
    // STORE STATUS (reaktif terhadap settings)
    // ========================================

    const storeStatus = useMemo(
        () => getStoreStatus(settings),
        [settings]
    );


    const [
        paymentMethod,
        setPaymentMethod
    ] = useState("cash");

    const [
        orders,
        setOrders
    ] = useState([]);

    useEffect(() => {
        try {
            localStorage.setItem(
                "vezberry_cart",
                JSON.stringify(cart)
            );
        } catch (err) {
            console.warn(
                "Gagal menyimpan keranjang lokal:",
                err
            );
        }
    }, [cart]);

    // ========================================
    // LOAD DATA DARI SERVER
    // ========================================

    useEffect(() => {

        const loadAll = async () => {

            try {

                // AMBIL DARI API PARALEL
                const [savedProducts, savedOrders, savedSettings] =
                    await Promise.all([
                        api.products.list(),
                        api.orders.list(),
                        api.settings.get(),
                    ]);

                setOrders(savedOrders);

                // APPLY PREORDER LOGIC
                const processedProducts =
                    applyPreorderCapacityLogic(
                        savedProducts.length > 0
                            ? savedProducts
                            : fallbackProducts,
                        savedOrders
                    );

                setDbProducts(processedProducts);

                setSettings(savedSettings);

                // CONVERT BANNERS
                const convertedSlides =
                    Array.isArray(savedSettings?.banner_images)
                        ? savedSettings.banner_images.map(
                            (img, index) => ({
                                id: index,
                                title: savedSettings.store_name || "VEZBERRY",
                                subtitle: savedSettings.tagline || "Premium Dessert & Bakery",
                                image: img,
                            })
                        )
                        : [];

                setSlides(convertedSlides);

            } catch (err) {

                console.error("Gagal load data:", err);

            }

        };

        loadAll();

    }, [location.pathname]);

    // ========================================
    // FILTER PRODUCTS
    // ========================================

    const filteredProducts =
        useMemo(() => {

            return dbProducts.filter(

                (item) =>

                    item.category ===
                    activeCategory

                    &&

                    !item.is_hidden

            );

        }, [

            dbProducts,
            activeCategory,

        ]);

    // ========================================
    // TOTALS
    // ========================================

    const totalItems =
        useMemo(() => {

            return cart.reduce(

                (sum, item) =>

                    sum +
                    item.quantity,

                0

            );

        }, [cart]);

    const totalPrice =
        useMemo(() => {

            return cart.reduce(

                (sum, item) =>

                    sum +

                    (
                        item.price *
                        item.quantity
                    ),

                0

            );

        }, [cart]);

    // ========================================
    // ADD TO CART
    // ========================================

    const addToCart =
        useCallback((product) => {

            if (
                product.preorder_closed
            ) {

                toast.error(
                    "Preorder sedang ditutup"
                );

                return;

            }

            if (

                !product.is_preorder &&

                Number(
                    product.stock || 0
                ) <= 0

            ) {

                toast.error(
                    "Stok habis"
                );

                return;

            }

            setCart((prev) => {

                const existing =

                    prev.find(

                        (item) =>

                            item.id ===
                            product.id

                    );

                if (existing) {

                    return prev.map(

                        (item) =>

                            item.id ===
                                product.id

                                ? {

                                    ...item,

                                    quantity:
                                        item.quantity + 1

                                }

                                : item

                    );

                }

                return [

                    ...prev,

                    {

                        ...product,

                        quantity: 1,

                    }

                ];

            });

            toast.success(
                `${product.name} ditambahkan`
            );

        }, [setCart]);

    // ========================================
    // UPDATE QUANTITY
    // ========================================

    const updateQuantity =
        useCallback((
            id,
            type
        ) => {

            setCart((prev) =>

                prev.map((item) => {

                    if (
                        item.id !== id
                    ) return item;

                    return {

                        ...item,

                        quantity:

                            type === "plus"

                                ? item.quantity + 1

                                : Math.max(
                                    1,
                                    item.quantity - 1
                                )

                    };

                })

            );

        }, []);

    // ========================================
    // REMOVE ITEM
    // ========================================

    const removeFromCart =
        useCallback((id) => {

            setCart((prev) =>

                prev.filter(

                    (item) =>

                        item.id !== id

                )

            );

            toast.success(
                "Item dihapus"
            );

        }, []);

    // ========================================
    // CHECKOUT
    // ========================================

    const handleCheckout =
        useCallback(async (orderData) => {

            await processCheckout({

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

            });

        }, [

            cart,

            orders,

            dbProducts,

            totalPrice,

            paymentMethod,

        ]);

    // ========================================
    // STORE INFO
    // ========================================

    const storeName =

        settings.store_name ||

        "VEZBERRY";

    const tagline =

        settings.tagline ||

        "Premium Dessert & Bakery";

    const waLink =

        settings.whatsapp_link ||

        `https://wa.me/${settings.whatsapp}`;

    const igLink =

        settings.instagram_link ||

        "https://instagram.com/vezberry";


    // ========================================
    // ADMIN SECRET TAP
    // ========================================

    const handleAdminTap = () => {

        const nextCount =
            adminTapCount + 1;

        setAdminTapCount(
            nextCount
        );

        console.log(
            "Admin Tap:",
            nextCount
        );

        clearTimeout(
            window.adminTapTimeout
        );

        window.adminTapTimeout =
            setTimeout(() => {

                setAdminTapCount(0);

            }, 3000);

        if (nextCount >= 7) {

            setAdminTapCount(0);

            navigate(
                "/admin/dashboard"
            );

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            min-h-screen
            bg-[#f8f6f3]
            overflow-x-hidden
            relative
        ">
            {/* BACKGROUND GLOW */}

            <div className="
    absolute
    bottom-0
    left-0

    w-[400px]
    h-[400px]

    bg-rose-300/10

    blur-3xl

    rounded-full

    pointer-events-none

    z-0
" />



            {/* STORE BAR */}

            <StoreInfoBar
                settings={settings}
                storeStatus={storeStatus}
            />

            {/* PRAYER */}

            <PrayerHeader />

            {/* HEADER */}

            <header className="
                sticky
                top-0

                z-50

                bg-white/80

                backdrop-blur-2xl

                border-b
                border-white/40

                shadow-[0_4px_30px_rgba(0,0,0,0.04)]
            ">

                <div className="
                    max-w-[1700px]
                    mx-auto

                    px-3
                    sm:px-4
                    md:px-6
                    xl:px-8
                ">

                    <div className="
                        flex
                        items-center
                        justify-between

                        gap-3

                        py-3
                        md:py-4
                    ">

                        {/* LEFT */}

                        <div className="
                            flex
                            items-center

                            gap-3
                            md:gap-4

                            min-w-0
                        ">

                            {/* LOGO */}

                            {settings.logo_url ? (

                                <img

                                    loading="lazy"

                                    decoding="async"

                                    src={
                                        settings.logo_url
                                    }

                                    alt={storeName}

                                    className="
                                        w-12
                                        h-12

                                        md:w-16
                                        md:h-16

                                        rounded-[22px]

                                        object-cover

                                        shadow-lg

                                        shrink-0
                                    "
                                />

                            ) : (

                                <div className="
                                    w-12
                                    h-12

                                    md:w-16
                                    md:h-16

                                    rounded-[22px]

                                    bg-gradient-to-br
                                    from-pink-500
                                    to-rose-600

                                    flex
                                    items-center
                                    justify-center

                                    shadow-[0_10px_30px_rgba(255,0,100,0.25)]

                                    shrink-0
                                ">

                                    <ShoppingBag
                                        className="
                                            w-6
                                            h-6

                                            md:w-8
                                            md:h-8

                                            text-white
                                        "
                                    />

                                </div>

                            )}

                            {/* STORE */}

                            <div className="
                                min-w-0
                            ">

                                <h1 className="
                                    text-lg
                                    sm:text-2xl
                                    md:text-4xl

                                    font-black

                                    tracking-tight

                                    bg-gradient-to-r
                                    from-pink-600
                                    to-rose-600

                                    bg-clip-text
                                    text-transparent

                                    truncate
                                ">

                                    {storeName}

                                </h1>

                                <p className="
                                    text-[11px]
                                    sm:text-sm
                                    md:text-base

                                    text-slate-500

                                    tracking-wide

                                    mt-1

                                    truncate
                                ">

                                    {tagline}

                                </p>

                            </div>

                        </div>

                        {/* CENTER INFO */}

                        <div className="
                            flex

                            flex-1
                            items-center
                            justify-center

                            px-4
                        ">
                            <span className="
                                text-[10px]
                                sm:text-[11px]
                                md:text-sm

                                font-extrabold
                                uppercase

                                tracking-[0.26em]
                                leading-none

                                text-[#0f2f6c]
                                drop-shadow-[0_1px_1px_rgba(15,47,108,0.25)]
                            ">
                                Web & App designed by Vezberry
                            </span>
                        </div>

                        {/* RIGHT */}

                        <div className="
                            flex
                            items-center

                            gap-2
                            md:gap-3

                            shrink-0
                        ">

                            {/* STATUS */}

                            <div className={`
                                hidden
                                md:flex

                                items-center
                                gap-2

                                px-5

                                h-12

                                rounded-full

                                text-white

                                text-sm

                                font-black

                                shadow-lg

                                ${storeStatus.isOpen

                                    ? "bg-emerald-500"

                                    : "bg-red-500"
                                }
                            `}>

                                <Clock3
                                    size={18}
                                />

                                {
                                    storeStatus.statusText
                                }

                            </div>

                            {/* ADMIN */}

                            <button

                                onClick={
                                    handleAdminTap
                                }

                                className="
                                text-[10px]

                                opacity-20

                                cursor-pointer

                                select-none

                                bg-transparent

                                border-0

                                outline-none
                            "
                            >

                                .

                            </button>

                        </div>

                    </div>

                </div>

            </header>
            {/* MAIN */}

            <main className="
                relative
                z-10

                max-w-[1700px]
                mx-auto

                px-3
                sm:px-4
                md:px-6
                xl:px-8

                pt-4
                md:pt-8

                pb-[130px]
                md:pb-24
            ">

                {/* HERO */}

                <section className="
                    mb-6
                    md:mb-12
                ">

                    <HeroSlider

                        banners={

                            slides.length > 0

                                ? slides

                                : [

                                    {

                                        title:
                                            storeName,

                                        subtitle:
                                            tagline,

                                        image:

                                            settings.banner_url ||

                                            "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop"

                                    }

                                ]

                        }

                        onExplore={() => {

                            const section =
                                document.getElementById(
                                    "products-section"
                                );

                            if (section) {

                                section.scrollIntoView({

                                    behavior: "smooth",

                                    block: "start",

                                });

                            }

                        }}

                    />

                </section>

                {/* STORE STATUS MOBILE */}

                <section className="
                    md:hidden

                    mb-3
                ">

                    <div className={`
                        rounded-[26px]

                        p-1

                        text-white

                        shadow-lg

                        flex
                        items-center

                        gap-4

                        ${storeStatus.isOpen

                            ? "bg-gradient-to-r from-emerald-500 to-green-500"

                            : "bg-gradient-to-r from-red-500 to-rose-500"
                        }
                    `}>

                        <div className="
                            w-12
                            h-10

                            rounded-2xl

                            bg-white/15

                            flex
                            items-center
                            justify-center

                            shrink-0
                        ">

                            <Clock3
                                size={24}
                            />

                        </div>

                        <div>

                            <p className="
                                text-xs

                                text-white/80

                                font-semibold
                            ">

                                Status Toko

                            </p>

                            <h3 className="
                                text-lg

                                font-black
                            ">

                                {
                                    storeStatus.statusText
                                }

                            </h3>

                        </div>

                    </div>

                </section>

                {/* TITLE */}

                <section className="
                    mb-6
                    md:mb-8

                    text-center
                ">

                    <motion.div

                        initial={{
                            opacity: 0,
                            y: 10
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                    >

                        <div className="
                            inline-flex
                            items-center

                            gap-1

                            rounded-full

                            bg-pink-100

                            px-4
                            py-2

                            text-md
                            md:text-sm

                            font-black

                            text-pink-600

                            mb-2
                        ">

                            <ShieldCheck
                                size={16}
                            />

                            PREMIUM MENU

                        </div>

                        <h2 className="
                            text-3xl
                            sm:text-4xl
                            md:text-6xl

                            font-black

                            tracking-tight

                            text-slate-900
                        ">

                            Menu Pilihan

                        </h2>

                        <p className="
                            text-slate-500

                            mt-1
                            md:mt-3

                            text-lg
                            sm:text-base
                            md:text-xl

                            max-w-2xl

                            mx-auto

                            leading-relaxed
                        ">

                            Pilihan terbaik
                            dari VEZBERRY
                            dengan kualitas premium
                            dan rasa terbaik.

                        </p>

                    </motion.div>

                </section>
                {/* CATEGORY */}

                <section className="
                    mb-6
                    md:mb-10

                    sticky

                    top-[72px]
                    md:top-[84px]

                    z-40
                ">

                    <div className="
                        rounded-[28px]

                        bg-white/75

                        backdrop-blur-2xl

                        border
                        border-white/50

                        shadow-[0_8px_30px_rgba(0,0,0,0.04)]

                        px-2
                        py-3
                    ">

                        <div className="
                            flex
                            justify-center
                        ">

                            <CategoryTabs

                                activeCategory={
                                    activeCategory
                                }

                                onCategoryChange={
                                    setActiveCategory
                                }

                            />

                        </div>

                    </div>

                </section>

                {/* PRODUCTS */}

                <section

                    ref={productsRef}

                    id="products-section"

                    className="
                        mb-28
                        md:mb-20
                    "
                >

                    {/* EMPTY */}

                    {filteredProducts.length === 0 && (

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
                                rounded-[32px]

                                bg-white/80

                                backdrop-blur-2xl

                                border
                                border-white/40

                                p-10
                                md:p-16

                                text-center

                                shadow-[0_10px_40px_rgba(0,0,0,0.05)]
                            "
                        >

                            <div className="
                                w-24
                                h-24

                                rounded-full

                                bg-pink-100

                                mx-auto

                                flex
                                items-center
                                justify-center
                            ">

                                <AlertTriangle
                                    className="
                                        text-pink-500
                                    "
                                    size={42}
                                />

                            </div>

                            <h3 className="
                                mt-7

                                text-2xl
                                md:text-4xl

                                font-black

                                text-slate-800
                            ">

                                Produk belum tersedia

                            </h3>

                            <p className="
                                mt-3

                                text-sm
                                md:text-lg

                                text-slate-500

                                leading-relaxed
                            ">

                                Produk pada kategori ini
                                belum tersedia saat ini.

                            </p>

                        </motion.div>

                    )}

                    {/* PRODUCT GRID */}

                    <motion.div

                        key={
                            activeCategory
                        }

                        initial={{
                            opacity: 0,
                            y: 8
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        exit={{
                            opacity: 0,
                            y: -8
                        }}

                        transition={{
                            duration: 0.18
                        }}

                        className="
                            grid

                            grid-cols-2
                            sm:grid-cols-2
                            md:grid-cols-3
                            xl:grid-cols-4
                            2xl:grid-cols-5

                            gap-3
                            sm:gap-4
                            md:gap-5
                            xl:gap-6
                        "
                    >

                        {filteredProducts.map(

                            (
                                product,
                                index
                            ) => (

                                <motion.div

                                    key={
                                        product.id
                                    }

                                    transition={{
                                        duration: 0.2
                                    }}

                                    whileHover={{
                                        y: -5
                                    }}

                                    className="
                                        h-full
                                    "
                                >

                                    {/* WRAPPER */}

                                    <div className="
                                        h-full

                                        rounded-[28px]
                                        md:rounded-[34px]

                                        overflow-hidden

                                        bg-white/70

                                        backdrop-blur-xl

                                        border
                                        border-white/40

                                        shadow-[0_10px_40px_rgba(0,0,0,0.05)]

                                        hover:shadow-[0_20px_60px_rgba(255,0,120,0.10)]

                                        transition-all
                                        duration-500
                                    ">

                                        <ProductCard

                                            product={
                                                product
                                            }

                                            onAddToCart={
                                                addToCart
                                            }

                                        />

                                    </div>

                                </motion.div>

                            )

                        )}

                    </motion.div>

                </section>

            </main>
            {/* CART DRAWER */}

            <div className="hidden md:block">



                <CartDrawer
                    open={cartOpen}
                    onOpenChange={setCartOpen}

                    cart={cart}

                    setCart={setCart}

                    onCheckout={handleCheckout}

                    totalPrice={totalPrice}

                    paymentMethod={paymentMethod}

                    setPaymentMethod={setPaymentMethod}

                    onGoHome={() => {

                        setCartOpen(false);

                    }}
                />

            </div>

            <SocialLinks
                waLink={waLink}
                instagramLink={igLink}
            />

            {cart.length > 0 && (
                <div className="fixed right-6 bottom-24 z-50 hidden lg:flex">
                    <button
                        type="button"
                        onClick={() => {
                            navigate('/checkout', {
                                state: {
                                    cart,
                                    totalPrice,
                                    orders,
                                    dbProducts,
                                },
                            });
                        }}
                        className="relative flex items-center gap-2 rounded-full bg-pink-600 px-4 py-3 text-white shadow-2xl shadow-pink-500/30 transition hover:bg-pink-700"
                        title="Lanjut ke Checkout"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Checkout
                        <span className="absolute -top-2 -right-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-950 text-[12px] font-black text-white px-1.5">
                            {totalItems}
                        </span>
                    </button>
                </div>
            )}

            {/* MOBILE NAV */}

            <BottomNav

                cartCount={
                    totalItems
                }

                onOpenCart={() =>
                    setCartOpen(true)
                }

                onGoHome={() => {

                    setCartOpen(false);

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth",

                    });

                }}

                waLink={
                    waLink
                }

                orderHistoryUrl={
                    createPageUrl(
                        "OrderHistory"
                    )
                }


                cart={cart}

                orders={orders}

                dbProducts={dbProducts}

                totalPrice={totalPrice}

                setOrders={setOrders}

                setDbProducts={setDbProducts}

                setCart={setCart}


            />

        </div>

    );

}
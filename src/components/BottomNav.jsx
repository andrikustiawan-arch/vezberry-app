import {
    useEffect,
    useState,
} from "react";

import {
    motion,
} from "framer-motion";

import {

    Home,

    ShoppingCart,

    MessageCircle,

    Receipt,

} from "lucide-react";

import {

    Link,

    useLocation,

    useNavigate,

} from "react-router-dom";

import {
    createPageUrl,
} from "@/utils";

// ========================================
// COMPONENT
// ========================================

export default function BottomNav({

    cartCount = 0,
    onOpenCart,
    onGoHome,
    waLink,
    orderHistoryUrl,
    cart,
    orders,
    dbProducts,
    totalPrice,
    setOrders,
    setDbProducts,
    setCart,

}) {

    const [

        isKeyboardOpen,

        setIsKeyboardOpen

    ] = useState(false);

    // ========================================
    // KEYBOARD DETECTION
    // ========================================

    useEffect(() => {

        const initialHeight =
            window.innerHeight;

        const handleResize = () => {

            const currentHeight =
                window.innerHeight;

            const keyboardVisible =

                currentHeight <
                initialHeight - 150;

            setIsKeyboardOpen(
                keyboardVisible
            );

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);

    // ========================================
    // LOCATION
    // ========================================

    const location =
        useLocation();

    const navigate =
        useNavigate();

    // ========================================
    // ITEMS
    // ========================================

    const items = [

        {

            label: "Beranda",

            icon: Home,

            type: "home",

        },

        {

            label: "Belanja",

            icon: ShoppingCart,

            path: "/checkout",

            type: "cart",

        },

        {

            label: "Chat",

            icon: MessageCircle,

            type: "wa",

        },

        {

            label: "Pesanan",

            icon: Receipt,

            path: orderHistoryUrl ||

                createPageUrl(
                    "OrderHistory"
                ),

            type: "link",

        },

    ];

    // ========================================
    // RENDER ITEM
    // ========================================

    const renderItem = (
        item
    ) => {

        const Icon =
            item.icon;

        const isActive =

            item.path &&
            location.pathname ===
            item.path;

        // ========================================
        // BASE STYLE
        // ========================================

        const baseClass = `
            relative

            h-[64px]
            sm:h-[70px]

            rounded-[22px]

            flex
            flex-col

            items-center
            justify-center

            gap-1

            transition-all
            duration-300

            overflow-hidden

            group
        `;

        // ========================================
        // CONTENT
        // ========================================

        const content = (

            <>

                {/* ACTIVE BG */}

                {isActive && (

                    <motion.div

                        layoutId="
                        bottomNavActive"

                        className="
                            absolute
                            inset-0

                            rounded-[22px]

                            bg-gradient-to-br
                            from-pink-500
                            via-rose-500
                            to-orange-400

                            shadow-[0_10px_35px_rgba(255,80,120,0.30)]
                        "

                        transition={{

                            type: "spring",

                            bounce: 0.25,

                            duration: 0.6,

                        }}
                    />

                )}

                {/* BADGE */}

                {item.type ===
                    "cart" &&
                    cartCount > 0 && (

                        <motion.div

                            initial={{
                                scale: 0
                            }}

                            animate={{
                                scale: 1
                            }}

                            className="
                                absolute

                                top-1.5
                                right-3

                                min-w-[20px]

                                h-5

                                px-1.5

                                rounded-full

                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500

                                text-white

                                text-[10px]

                                font-black

                                flex
                                items-center
                                justify-center

                                z-20

                                shadow-lg
                            "
                        >

                            {
                                cartCount
                            }

                        </motion.div>

                    )
                }

                {/* ICON */}

                <motion.div

                    whileHover={{
                        scale: 1.08
                    }}

                    className="
                        relative
                        z-10
                    "
                >

                    <Icon className={`
                        w-8
                        h-8

                        sm:w-10
                        sm:h-10

                        transition-all
                        duration-300

                        ${isActive

                            ? `
                                text-white
                            `

                            : `
                                text-slate-600
                                group-hover:text-pink-500
                            `
                        }
                    `} />

                </motion.div>

                {/* LABEL */}

                <span className={`
                    relative
                    z-10

                    text-[14px]
                    sm:text-[16px]

                    font-bold

                    tracking-wide

                    transition-all

                    ${isActive

                        ? `
                            text-white
                        `

                        : `
                            text-slate-500
                            group-hover:text-pink-500
                        `
                    }
                `}>

                    {
                        item.label
                    }

                </span>

            </>

        );

        // ========================================
        // HOME
        // ========================================

        if (
            item.type ===
            "home"
        ) {

            return (

                <motion.button

                    whileTap={{
                        scale: 0.92
                    }}

                    key={
                        item.label
                    }

                    onClick={() => {

                        if (onGoHome) {

                            onGoHome();

                        } else {

                            window.scrollTo({

                                top: 0,

                                behavior: "smooth",

                            });

                        }

                    }}

                    className={`
                        ${baseClass}

                        hover:bg-pink-50/60
                    `}
                >

                    {content}

                </motion.button>

            );

        }

        // ========================================
        // CART
        // ========================================

        if (item.type === "cart") {

            return (

                <motion.button

                    whileTap={{
                        scale: 0.92
                    }}

                    key={
                        item.label
                    }

                    onClick={() => {
                        navigate(
                            "/checkout",
                            {
                                state: {
                                    cart,
                                    orders,
                                    dbProducts,
                                    totalPrice,
                                },
                            }
                        );
                    }}

                    className={`
                        ${baseClass}

                        ${!isActive
                            ? `
                                hover:bg-pink-50/60
                            `
                            : ''
                        }
                    `}
                >

                    {content}

                </motion.button>

            );

        }

        // ========================================
        // WA
        // ========================================

        if (
            item.type ===
            "wa"
        ) {

            return (

                <motion.a

                    whileTap={{
                        scale: 0.92
                    }}

                    href={waLink}

                    target="_blank"

                    rel="noreferrer"

                    key={
                        item.label
                    }

                    className={`
                        ${baseClass}

                        hover:bg-emerald-50/60
                    `}
                >

                    {content}

                </motion.a>

            );

        }

        // ========================================
        // NORMAL LINK
        // ========================================

        return (<motion.button whileTap={{ scale: 0.92 }} key={item.label} onClick={() => { if (!item.path) return; if (item.path === "/checkout") { navigate(item.path, { state: { cart, totalPrice, orders, dbProducts, setOrders, setDbProducts, setCart } }); } else { navigate(item.path); } }} className={` ${baseClass} ${!isActive ? ` hover:bg-pink-50/60 ` : ''} `} > {content} </motion.button>);

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className={`

    fixed

    bottom-3
    sm:bottom-4

    left-1/2

    -translate-x-1/2

    z-[999999]

    w-[94%]
    sm:w-[92%]

    max-w-md

    lg:hidden

    transition-all
    duration-300

    ${isKeyboardOpen

                ? `
            opacity-0
            pointer-events-none
            translate-y-24
        `

                : `
            opacity-100
        `
            }

`}>

            {/* GLOW */}

            <div className="
                absolute
                inset-0

                rounded-[32px]

                bg-gradient-to-r
                from-pink-500/15
                via-rose-400/10
                to-orange-400/10

                blur-3xl

                pointer-events-none
            " />

            {/* NAV */}

            <div className="
                relative

                rounded-[50px]

                border
                border-white/30

                bg-white/60

                backdrop-blur-3xl

                shadow-[0_18px_50px_rgba(0,0,0,0.12)]

                px-2
                sm:px-3

                py-2

                supports-[padding:max(0px)]:
                pb-[max(0.5rem,env(safe-area-inset-bottom))]
            ">

                {/* ITEMS */}

                <div className="
                    grid
                    grid-cols-4

                    gap-1
                    sm:gap-2
                ">

                    {items.map(
                        renderItem
                    )}

                </div>

            </div>

        </div>

    );

}
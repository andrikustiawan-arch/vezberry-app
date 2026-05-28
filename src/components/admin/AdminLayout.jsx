import {
    useState,
    useMemo,
} from "react";

import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Settings,
    LogOut,
    Store,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

// ========================================
// COMPONENT
// ========================================

export default function AdminLayout({
    children,
}) {

    // ========================================
    // HOOKS
    // ========================================

    const location =
        useLocation();

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);

    const [
        sidebarCollapsed,
        setSidebarCollapsed,
    ] = useState(false);

    // ========================================
    // MENU
    // ========================================

    const menus = useMemo(
        () => [

            {
                label: "Dashboard",

                icon: LayoutDashboard,

                path: "/admin/dashboard",
            },

            {
                label: "Produk",

                icon: ShoppingBag,

                path: "/admin/products",
            },

            {
                label: "Pesanan",

                icon: ShoppingCart,

                path: "/admin/orders",

                badge: 3,
            },

            {
                label: "Pengaturan",

                icon: Settings,

                path: "/admin/settings",
            },

        ],
        []
    );

    // ========================================
    // LOGOUT
    // ========================================

    const logout = () => {

        localStorage.removeItem(
            "vezberry_admin_auth"
        );

        window.location.href =
            "/admin/login";

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            min-h-screen
            min-h-[100dvh]
            bg-gradient-to-br
            from-[#5c6cff]/50
            via-[#8e71ff]/50
            to-[#f76d9d]/50

            overflow-x-hidden

            flex
        ">

            {/* ======================================== */}
            {/* MOBILE OVERLAY */}
            {/* ======================================== */}

            <AnimatePresence>

                {mobileOpen && (

                    <motion.div

                        initial={{
                            opacity: 0,
                        }}

                        animate={{
                            opacity: 1,
                        }}

                        exit={{
                            opacity: 0,
                        }}

                        onClick={() =>
                            setMobileOpen(
                                false
                            )
                        }

                        className="
                            fixed
                            inset-0

                            z-40

                            bg-black/18
                            backdrop-blur-sm

                            lg:hidden
                        "
                    />

                )}

            </AnimatePresence>

            {/* ======================================== */}
            {/* SIDEBAR */}
            {/* ======================================== */}

            <motion.aside

                initial={{
                    x: -320,
                }}

                animate={{
                    x: 0,
                }}

                transition={{

                    duration: 0.18,

                    ease: "easeOut",

                }}

                className={`
                    fixed
                    lg:sticky

                    top-0
                    left-0

                    z-50

                    h-[100dvh]

                    ${sidebarCollapsed

                        ? `
                            w-[0px]
                          `

                        : `
                            w-[290px]
                            sm:w-[320px]
                            lg:w-[300px]
                            xl:w-[320px]
                          `
                    }

                    overflow-visible

                    flex
                    flex-col

                    text-white

                    shadow-[0_8px_40px_rgba(0,0,0,0.12)]

                    bg-gradient-to-br
                    from-[#27d7c6]/100
                    via-[#4b7cff]/100
                    to-[#b96dff]/100


                    backdrop-blur-3xl

                    border-r
                    border-white/15

                    will-change-transform
                    transform-gpu

                    transition-all
                    duration-300

                    ${mobileOpen

                        ? "translate-x-0"

                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >

                {/* COLLAPSED HANDLE */}

                {sidebarCollapsed && (

                    <button

                        onClick={() =>

                            setSidebarCollapsed(
                                false
                            )

                        }

                        className="
                            
                            flex

                            fixed

                            top-5
                            left-0
                            sm:top-7

                            z-[99999]

                            w-[62px]
                            h-[62px]

                            sm:w-[74px]
                            sm:h-[74px]

                            rounded-r-[28px]

                            bg-gradient-to-br
                            from-cyan-300/90
                            to-blue-500/90

                            backdrop-blur-3xl

                            border
                            border-white/20

                            shadow-[0_10px_40px_rgba(0,0,0,0.16)]

                            items-center
                            justify-center

                            transition-all
                            duration-300

                            hover:scale-[1.03]
                        "
                    >

                        <Store
                            size={34}
                            className="
                text-white
            "
                        />

                    </button>

                )}

                {/* ======================================== */}
                {/* SIDEBAR CONTENT */}
                {/* ======================================== */}

                <div className={`
                    relative

                    flex
                    flex-col

                    h-full

                    transition-all
                    duration-200

                    ${sidebarCollapsed

                        ? `
                            opacity-0
                            pointer-events-none
                          `

                        : `
                            opacity-100
                          `
                    }
                `}>

                    {/* ======================================== */}
                    {/* BACKGROUND GLOW */}
                    {/* ======================================== */}

                    <div className="
                        absolute
                        inset-0

                        overflow-hidden

                        pointer-events-none
                    ">

                        <div className="
                            absolute
                            -top-24
                            -right-20

                            w-72
                            h-72

                            rounded-full

                            bg-white/15

                            blur-3xl
                        " />

                        <div className="
                            absolute
                            bottom-0
                            left-0

                            w-64
                            h-64

                            rounded-full

                            bg-pink-300/20

                            blur-3xl
                        " />

                    </div>

                    {/* ======================================== */}
                    {/* TOP */}
                    {/* ======================================== */}

                    <div className="
                        relative
                        z-10

                        p-5
                        sm:p-6

                        border-b
                        border-white/15

                        flex
                        items-center
                        justify-between
                    ">

                        {/* LOGO */}

                        <button

                            onClick={() =>

                                setSidebarCollapsed(
                                    true
                                )

                            }

                            className="
                                flex
                                items-center

                                gap-4

                                transition-all
                                duration-300
                            "
                        >

                            <div className="
                                w-14
                                h-14

                                sm:w-16
                                sm:h-16

                                rounded-[26px]

                                bg-white/20

                                backdrop-blur-xl

                                border
                                border-white/20

                                flex
                                items-center
                                justify-center

                                shadow-lg

                                shrink-0
                            ">

                                <Store
                                    size={30}
                                />

                            </div>

                            <div>

                                <h1 className="
                                    text-2xl
                                    sm:text-3xl

                                    font-black

                                    tracking-tight
                                ">

                                    VEZBERRY

                                </h1>

                                <p className="
                                    text-[10px]
                                    sm:text-xs

                                    text-white/80

                                    tracking-[3px]

                                    mt-1
                                ">

                                    ADMIN PANEL

                                </p>

                            </div>

                        </button>

                        {/* MOBILE CLOSE */}

                        <button

                            onClick={() =>
                                setMobileOpen(
                                    false
                                )
                            }

                            className="
                                lg:hidden

                                w-11
                                h-11

                                rounded-2xl

                                bg-white/15

                                backdrop-blur-xl

                                border
                                border-white/15

                                flex
                                items-center
                                justify-center

                                active:scale-[0.96]
                            "
                        >

                            <X size={20} />

                        </button>

                    </div>
                    {/* ======================================== */}
                    {/* PROFILE */}
                    {/* ======================================== */}

                    <div className="
                        relative
                        z-10

                        p-4
                        sm:p-5
                    ">

                        <div className="
                            rounded-[30px]

                            border
                            border-white/15

                            bg-white/12

                            backdrop-blur-2xl

                            p-4
                            sm:p-5

                            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                        ">

                            <div className="
                                flex
                                items-center

                                gap-4
                            ">

                                {/* AVATAR */}

                                <div className="
                                    w-14
                                    h-14

                                    rounded-[24px]

                                    bg-white/20

                                    border
                                    border-white/15

                                    flex
                                    items-center
                                    justify-center

                                    shadow-lg

                                    shrink-0
                                ">

                                    <Store
                                        size={24}
                                    />

                                </div>

                                {/* TEXT */}

                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        text-white/75

                                        text-xs
                                        sm:text-sm
                                    ">

                                        Login sebagai

                                    </p>

                                    <h3 className="
                                        text-lg
                                        sm:text-xl

                                        font-black

                                        truncate
                                    ">

                                        Administrator

                                    </h3>

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="
                                mt-4

                                inline-flex
                                items-center

                                rounded-full

                                bg-white/15

                                px-3
                                py-1.5

                                text-[11px]
                                sm:text-xs

                                font-bold

                                text-white
                            ">

                                ✨ Secure Local Login

                            </div>

                        </div>

                    </div>

                    {/* ======================================== */}
                    {/* MENU */}
                    {/* ======================================== */}

                    <div className="
                        relative
                        z-10

                        flex-1

                        overflow-y-auto
                        overscroll-contain

                        px-3
                        sm:px-4

                        pb-[150px]
                        lg:pb-10
                    ">

                        <nav className="
                            flex
                            flex-col

                            gap-2.5
                        ">

                            {menus.map(
                                (menu) => {

                                    const Icon =
                                        menu.icon;

                                    const active =

                                        location.pathname ===
                                        menu.path;

                                    return (

                                        <Link

                                            key={
                                                menu.path
                                            }

                                            to={
                                                menu.path
                                            }

                                            className={`
                                                relative

                                                min-h-[60px]
                                                sm:min-h-[64px]

                                                rounded-[24px]

                                                flex
                                                items-center
                                                justify-between

                                                gap-3

                                                px-4
                                                sm:px-5

                                                text-sm
                                                sm:text-base

                                                font-bold

                                                overflow-hidden

                                                transition-all
                                                duration-300

                                                active:scale-[0.98]

                                                ${active

                                                    ? `
                                                        bg-white

                                                        text-[#4b7cff]

                                                        shadow-[0_10px_30px_rgba(255,255,255,0.18)]
                                                      `

                                                    : `
                                                        bg-white/10

                                                        text-white

                                                        hover:bg-white/18

                                                        backdrop-blur-xl

                                                        border
                                                        border-white/10
                                                      `
                                                }
                                            `}
                                        >

                                            {/* LEFT */}

                                            <div className="
                                                flex
                                                items-center

                                                gap-3

                                                min-w-0
                                            ">

                                                {/* ICON */}

                                                <div className={`
                                                    w-11
                                                    h-11

                                                    rounded-2xl

                                                    flex
                                                    items-center
                                                    justify-center

                                                    shrink-0

                                                    transition-all

                                                    ${active

                                                        ? `
                                                            bg-gradient-to-br
                                                            from-cyan-400
                                                            via-blue-500
                                                            to-purple-500

                                                            text-white

                                                            shadow-lg
                                                          `

                                                        : `
                                                            bg-white/12

                                                            text-white
                                                          `
                                                    }
                                                `}>

                                                    <Icon
                                                        size={20}
                                                    />

                                                </div>

                                                {/* LABEL */}

                                                <div className="
                                                    flex
                                                    items-center

                                                    min-w-0
                                                ">

                                                    <span className="
                                                        truncate
                                                    ">

                                                        {
                                                            menu.label
                                                        }

                                                    </span>

                                                    {/* BADGE */}

                                                    {menu.badge > 0 && (

                                                        <span className={`
                                                            ml-2

                                                            min-w-[22px]
                                                            h-5

                                                            rounded-full

                                                            px-1.5

                                                            flex
                                                            items-center
                                                            justify-center

                                                            text-[10px]

                                                            font-black

                                                            ${active

                                                                ? `
                                                                    bg-pink-100

                                                                    text-pink-600
                                                                  `

                                                                : `
                                                                    bg-white/20

                                                                    text-white
                                                                  `
                                                            }
                                                        `}>

                                                            {
                                                                menu.badge
                                                            }

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                            {/* RIGHT */}

                                            <ChevronRight

                                                size={18}

                                                className={`
                                                    shrink-0

                                                    transition-all

                                                    ${active

                                                        ? `
                                                            text-pink-500
                                                          `

                                                        : `
                                                            text-white/70
                                                          `
                                                    }
                                                `}
                                            />

                                        </Link>

                                    );

                                }
                            )}

                        </nav>

                    </div>

                    {/* ======================================== */}
                    {/* BOTTOM */}
                    {/* ======================================== */}

                    <div className="
                        relative
                        z-10

                        border-t
                        border-white/15

                        p-4

                        pb-[max(env(safe-area-inset-bottom),16px)]

                        space-y-3

                        bg-black/10

                        backdrop-blur-2xl
                    ">

                        {/* WEBSITE */}

                        <button

                            onClick={() => {

                                window.location.href = "/";

                            }}

                            className="
        w-full

        min-h-[54px]

        rounded-[22px]

        bg-white/14

        border
        border-white/12

        backdrop-blur-xl

        flex
        items-center
        justify-center

        gap-3

        px-4

        text-sm
        sm:text-base

        font-bold

        text-white

        transition-all
        duration-300

        hover:bg-white/20

        active:scale-[0.98]
    "
                        >

                            <Store size={20} />

                            Lihat Website

                        </button>


                        {/* LOGOUT */}

                        <button

                            onClick={
                                logout
                            }

                            className="
                                w-full

                                min-h-[54px]

                                rounded-[22px]

                                bg-red-500/15

                                border
                                border-red-300/20

                                text-white

                                flex
                                items-center

                                gap-3

                                px-4

                                text-sm
                                sm:text-base

                                font-bold

                                transition-all
                                duration-300

                                hover:bg-red-500/25

                                active:scale-[0.98]
                            "
                        >

                            <LogOut
                                size={20}
                            />

                            Logout

                        </button>

                    </div>

                </div>

            </motion.aside>

            {/* ======================================== */}
            {/* CONTENT */}
            {/* ======================================== */}

            <div className="
                flex-1

                min-w-0

                flex
                flex-col
            ">

                {/* ======================================== */}
                {/* MOBILE TOPBAR */}
                {/* ======================================== */}

                <div className="
                    sticky
                    top-0

                    z-30

                    lg:hidden

                    bg-white/85
                    backdrop-blur-2xl

                    border-b
                    border-pink-100

                    shadow-[0_4px_30px_rgba(0,0,0,0.05)]

                    px-4

                    pt-[max(12px,env(safe-area-inset-top))]
                    pb-4
                ">

                    <div className="
                        flex
                        items-center
                        justify-between

                        gap-3
                    ">

                        {/* LEFT */}

                        <div className="
                            flex
                            items-center

                            gap-3

                            min-w-0
                        ">

                            {/* MENU BUTTON */}

                            <button

                                onClick={() =>
                                    setMobileOpen(
                                        true
                                    )
                                }

                                className="
                                    w-11
                                    h-11

                                    rounded-2xl

                                    bg-gradient-to-br
                                    from-pink-400
                                    via-rose-500
                                    to-orange-500

                                    text-white

                                    shadow-lg

                                    flex
                                    items-center
                                    justify-center

                                    active:scale-[0.96]

                                    shrink-0
                                "
                            >

                                <Menu
                                    size={20}
                                />

                            </button>

                            {/* TITLE */}

                            <div className="
                                min-w-0
                            ">

                                <h2 className="
                                    text-lg
                                    sm:text-xl

                                    font-black

                                    tracking-tight

                                    text-slate-900

                                    truncate
                                ">

                                    VEZBERRY

                                </h2>

                                <p className="
                                    text-[10px]
                                    sm:text-xs

                                    text-slate-500

                                    tracking-[2px]

                                    mt-0.5
                                ">

                                    ADMIN PANEL

                                </p>

                            </div>

                        </div>

                    </div>

                </div>
                {/* ======================================== */}
                {/* PAGE CONTENT */}
                {/* ======================================== */}

                <main className="
                    flex-1

                    w-full

                    overflow-x-hidden

                    px-3
                    sm:px-4
                    md:px-6
                    lg:px-8

                    py-4
                    sm:py-5
                    md:py-6
                    lg:py-8

                    pb-[140px]
                    md:pb-10
                ">

                    {/* CONTENT CONTAINER */}

                    <div className="
                        w-full

                        max-w-[1700px]

                        mx-auto
                    ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}
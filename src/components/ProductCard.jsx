import {
    motion,
} from "framer-motion";

import {
    ShoppingBag,
    Flame,
    Clock3,
    Sparkles,
    AlertTriangle,
    Lock,
} from "lucide-react";

import {
    Button,
} from "@/components/ui/button";

// ========================================
// ESTIMATED DATE
// ========================================

const calculateEstimatedDate = (
    days
) => {

    const totalDays =
        parseInt(days || 0);

    const date =
        new Date();

    date.setDate(
        date.getDate() +
        totalDays
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
        }
    );

};

// ========================================
// COMPONENT
// ========================================

export default function ProductCard({

    product,

    onAddToCart,

}) {

    // ========================================
    // PRICE
    // ========================================

    const finalPrice =

        product.discount_percentage > 0

            ? product.price * (
                1 -
                product.discount_percentage / 100
            )

            : product.price;

    // ========================================
    // FLAGS
    // ========================================

    const lowStock =
        Number(
            product.stock || 0
        ) <= 5;

    const preorderClosed =
        product.preorder_closed;

    // ========================================
    // UI
    // ========================================

    return (

        <motion.div

            whileHover={{
                y: -4,
            }}

            transition={{
                duration: 0.25,
            }}

            className="
                group
                relative

                overflow-hidden

                rounded-[28px]
                md:rounded-[34px]

                bg-white/92
                backdrop-blur-2xl

                border
                border-white/40

                shadow-[0_6px_24px_rgba(0,0,0,0.06)]

                hover:shadow-[0_20px_60px_rgba(255,80,120,0.14)]

                transition-all
                duration-500

                h-full

                flex
                flex-col

                will-change-transform
                transform-gpu
            "
        >

            {/* GLOW */}

            <div className="
                absolute
                -top-24
                -right-20

                w-40
                h-40

                sm:w-52
                sm:h-52

                md:w-64
                md:h-64

                rounded-full

                bg-pink-500/10

                blur-3xl

                opacity-0

                group-hover:opacity-100

                transition-all
                duration-700
            " />

            {/* IMAGE */}

            <div className="
                relative
                overflow-hidden

                rounded-b-[24px]

                aspect-[4/3]

                h-48
                sm:h-56
                md:h-64
                xl:h-72
            ">

                <img

                    loading="lazy"

                    decoding="async"

                    src={
                        product.image_url
                    }

                    alt={
                        product.name
                    }

                    className="
                        w-full
                        h-full

                        object-cover

                        transition-all
                        duration-700

                        group-hover:scale-105
                    "
                />

                {/* OVERLAY */}

                <div className="
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/25
                    via-black/0
                    to-black/0
                " />

                {/* BADGES */}

                <div className="
                    absolute
                    top-2.5
                    left-2.5

                    sm:top-3
                    sm:left-3

                    flex
                    flex-wrap

                    gap-1.5

                    z-10

                    max-w-[94%]
                ">

                    {/* NEW */}

                    {product.is_new && (

                        <motion.div

                            initial={{
                                scale: 0.8,
                                opacity: 0,
                            }}

                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}

                            className="
                                h-7
                                sm:h-8
                                md:h-9

                                px-3
                                md:px-4

                                rounded-full

                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500

                                text-white

                                text-[10px]
                                sm:text-[11px]
                                md:text-xs

                                font-black

                                flex
                                items-center

                                gap-1.5

                                shadow-lg

                                shrink-0
                            "
                        >

                            <Sparkles
                                size={12}
                            />

                            NEW

                        </motion.div>

                    )}

                    {/* DISCOUNT */}

                    {product.discount_percentage > 0 && (

                        <motion.div

                            initial={{
                                scale: 0.8,
                                opacity: 0,
                            }}

                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}

                            className="
                                h-7
                                sm:h-8
                                md:h-9

                                px-3
                                md:px-4

                                rounded-full

                                bg-gradient-to-r
                                from-red-500
                                to-orange-500

                                text-white

                                text-[10px]
                                sm:text-[11px]
                                md:text-xs

                                font-black

                                flex
                                items-center

                                gap-1.5

                                shadow-lg

                                shrink-0
                            "
                        >

                            <Flame
                                size={12}
                            />

                            -
                            {
                                product.discount_percentage
                            }%

                        </motion.div>

                    )}
                    {/* PREORDER */}

                    {product.is_preorder && !preorderClosed && (

                        <div className="
                            h-7
                            sm:h-8
                            md:h-9

                            px-3
                            md:px-4

                            rounded-full

                            bg-gradient-to-r
                            from-amber-500
                            to-orange-500

                            text-white

                            text-[10px]
                            sm:text-[11px]
                            md:text-xs

                            font-black

                            flex
                            items-center

                            gap-1.5

                            shadow-lg

                            shrink-0
                        ">

                            <Clock3
                                size={12}
                            />

                            PREORDER

                            {product.ready_after_days > 0 && (
                                <>
                                    {" "}H-
                                    {
                                        product.ready_after_days
                                    }
                                </>
                            )}

                        </div>

                    )}

                    {/* PREORDER CLOSED */}

                    {preorderClosed && (

                        <div className="
                            h-7
                            sm:h-8
                            md:h-9

                            px-3
                            md:px-4

                            rounded-full

                            bg-gradient-to-r
                            from-slate-700
                            to-slate-900

                            text-white

                            text-[10px]
                            sm:text-[11px]
                            md:text-xs

                            font-black

                            flex
                            items-center

                            gap-1.5

                            shadow-lg

                            shrink-0
                        ">

                            <Lock
                                size={12}
                            />

                            PO DITUTUP

                        </div>

                    )}

                    {/* LOW STOCK */}

                    {lowStock && !product.is_preorder && (

                        <div className="
                            h-7
                            sm:h-8
                            md:h-9

                            px-3
                            md:px-4

                            rounded-full

                            bg-gradient-to-r
                            from-yellow-500
                            to-orange-500

                            text-white

                            text-[10px]
                            sm:text-[11px]
                            md:text-xs

                            font-black

                            flex
                            items-center

                            gap-1.5

                            shadow-lg

                            shrink-0
                        ">

                            <AlertTriangle
                                size={12}
                            />

                            STOK MENIPIS

                        </div>

                    )}

                </div>

                {/* COMING SOON */}

                {product.is_coming_soon && (

                    <div className="
                        absolute
                        inset-0

                        bg-black/70
                        backdrop-blur-sm

                        flex
                        items-center
                        justify-center

                        z-20
                    ">

                        <div className="
                            px-5
                            md:px-6

                            h-11
                            md:h-14

                            rounded-full

                            bg-white/10

                            border
                            border-white/20

                            backdrop-blur-xl

                            text-white

                            font-black

                            flex
                            items-center

                            text-sm
                            md:text-lg
                        ">

                            COMING SOON

                        </div>

                    </div>

                )}

            </div>

            {/* CONTENT */}

            <div className="
                p-3.5
                sm:p-4
                md:p-5

                flex
                flex-col
                flex-1
            ">

                {/* CATEGORY */}

                <div className="
                    text-[10px]
                    sm:text-[11px]

                    tracking-[0.08em]

                    font-black

                    text-pink-500

                    uppercase

                    line-clamp-1
                ">

                    {
                        product.category?.replaceAll(
                            "_",
                            " "
                        )
                    }

                </div>

                {/* NAME */}

                <h2 className="
                    mt-0.0

                    text-[19px]
                    sm:text-lg
                    md:text-[24px]

                    font-black

                    leading-[1.15]

                    line-clamp-2

                    text-slate-900

                    tracking-[-0.02em]

                    min-h-[18px]
                    sm:min-h-[26px]
                    md:min-h-[36px]
                ">

                    {product.name}

                </h2>

                {/* DESCRIPTION */}

                <p className="
                    mt-0.0

                    text-[12px]
                    sm:text-[13px]
                    md:text-sm

                    text-slate-500

                    leading-[1.45]

                    line-clamp-2

                    min-h-[18px]
                    sm:min-h-[22px]

                    flex-1
                ">

                    {product.description}

                </p>

                {/* PREORDER INFO */}

                {product.is_preorder && (

                    <div className="
                        mt-0.1
                    
                        space-y-0.5
                    ">

                        {/* BADGE */}

                        <div className="
                            inline-flex
                            items-center

                            gap-0.5

                            rounded-full

                            bg-amber-100

                            px-1
                            py-0.5

                            text-[11px]
                            sm:text-xs

                            font-black

                            text-amber-700
                        ">

                            ⏰

                            PREORDER

                            {product.ready_after_days > 0 && (
                                <>
                                    {" "}H-
                                    {
                                        product.ready_after_days
                                    }
                                </>
                            )}

                        </div>

                        {/* ESTIMATION */}

                        <div className="
                            rounded-[10px]

                            border
                            border-orange-100

                            bg-orange-50/80

                            px-3
                            py-0.5

                            text-[11px]
                            sm:text-xs

                            text-slate-600

                            leading-relaxed
                        ">

                            📅 Tersedia sekitar
                            {" "}

                            <span className="
                                font-black

                                text-slate-800
                            ">

                                {
                                    calculateEstimatedDate(
                                        product.ready_after_days
                                    )
                                }

                            </span>

                            {" "}(
                            {
                                product.ready_after_days || 0
                            }
                            {" "}hari dari order)

                        </div>

                    </div>

                )}
                {/* LOW STOCK INFO */}

                {lowStock && !product.is_preorder && (

                    <div className="
                        mt-3

                        rounded-[10px]

                        border
                        border-yellow-200

                        bg-yellow-50

                        px-3
                        py-1.5

                        text-[11px]
                        sm:text-xs

                        text-yellow-700

                        leading-relaxed
                    ">

                        ⚠️ Stok tersisa
                        {" "}

                        <span className="
                            font-black
                        ">

                            {
                                product.stock || 0
                            }

                        </span>

                    </div>

                )}

                {/* PREORDER CLOSED INFO */}

                {preorderClosed && (

                    <div className="
                        mt-3

                        rounded-[10px]

                        border
                        border-slate-300

                        bg-slate-100

                        px-3
                        py-1.0

                        text-[11px]
                        sm:text-xs

                        text-slate-700

                        leading-relaxed
                    ">

                        🔒 Preorder sedang ditutup
                        karena kapasitas produksi
                        sudah penuh.

                    </div>

                )}

                {/* PRICE */}

                <div className="
                    mt-2

                    flex
                    items-end

                    gap-0

                    flex-wrap
                ">

                    {/* FINAL PRICE */}

                    <div className="
                        text-[22px]
                        sm:text-[24px]
                        md:text-[30px]

                        font-black

                        leading-none

                        tracking-[-0.03em]

                        bg-gradient-to-r
                        from-pink-600
                        to-rose-500

                        bg-clip-text
                        text-transparent

                        break-all
                    ">

                        Rp {

                            Number(
                                finalPrice
                            ).toLocaleString(
                                "id-ID"
                            )

                        }

                    </div>

                    {/* ORIGINAL PRICE */}

                    {product.discount_percentage > 0 && (

                        <div className="
                            text-[13px]
                            md:text-xs

                            text-slate-400

                            line-through

                            font-semibold

                            mb-0
                        ">

                            Rp {

                                Number(
                                    product.price
                                ).toLocaleString(
                                    "id-ID"
                                )

                            }

                        </div>

                    )}

                </div>

                {/* BUTTON */}

                <Button

                    disabled={
                        product.is_coming_soon ||
                        preorderClosed
                    }

                    onClick={() =>
                        onAddToCart(
                            product
                        )
                    }

                    className="
                        mt-1

                        h-12
                        sm:h-12
                        md:h-14

                        rounded-[20px]
                        md:rounded-[24px]

                        bg-gradient-to-r
                        from-pink-500
                        to-rose-500

                        hover:from-pink-600
                        hover:to-rose-600

                        text-[14px]
                        sm:text-sm
                        md:text-base

                        font-black

                        shadow-[0_10px_24px_rgba(255,0,100,0.18)]

                        hover:shadow-[0_14px_34px_rgba(255,0,100,0.24)]

                        hover:scale-[1.01]

                        active:scale-[0.98]

                        transition-all
                        duration-300

                        touch-manipulation

                        disabled:opacity-50
                        disabled:pointer-events-none
                    "
                >

                    {preorderClosed ? (

                        <>

                            <Lock
                                className="
                                    w-4
                                    h-4

                                    mr-2
                                "
                            />

                            PO Ditutup

                        </>

                    ) : (

                        <>

                            <ShoppingBag
                                className="
                                    w-4
                                    h-4

                                    mr-1
                                "
                            />

                            Masuk Keranjang

                        </>

                    )}

                </Button>

            </div>

        </motion.div>

    );

}
import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    Sparkles,
    ArrowRight,
} from "lucide-react";

// ========================================
// COMPONENT
// ========================================

/**
 * @param {{ banners?: any[]; onExplore?: (() => void) }} props
 */
export default function HeroSlider({

    banners = [],

    onExplore,

}) {

    // ========================================
    // STATE
    // ========================================

    const [
        current,
        setCurrent,
    ] = useState(0);

    const [
        direction,
        setDirection,
    ] = useState(1);

    const intervalRef =
        useRef(
            /** @type {number | null} */
            (null)
        );

    const normalizedBanners =

        (banners || []).map(
            (item, index) => {

                if (
                    typeof item === "string"
                ) {

                    return {

                        id: index,

                        image_url: item,

                        title: "VEZBERRY",

                        description:
                            "Premium Dessert & Bakery",

                    };

                }

                return item;

            }
        );

    const slideVariants = {
        /** @param {number} dir */
        enter: (dir) => ({
            x: dir === 1 ? '100%' : '-100%',
            opacity: 1,
            transition: {
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
            },
        }),
        center: {
            x: '0%',
            opacity: 1,
            transition: {
                duration: 0.65,
                ease: [0.01, 0.25, 0.15, 1],
            },
        },
        /** @param {number} dir */
        exit: (dir) => ({
            x: dir === 1 ? '-90%' : '90%',
            opacity: 1,
            transition: {
                duration: 1.05,
                ease: [0.25, 0.1, 0.25, 1],
            },
        }),
    };

    // ========================================
    // IMAGE PRELOAD

    useEffect(() => {
        const images =
            normalizedBanners.map((item) => {
                const src =
                    item.image_url || item.image;

                const img = new Image();
                img.src = src;
                return img;
            });

        return () => {
            images.forEach((img) => {
                img.src = '';
            });
        };
    }, [normalizedBanners]);

    /** @param {number} nextIndex */
    const slideTo = (nextIndex) => {
        setDirection(nextIndex > current ? 1 : -1);
        setCurrent(nextIndex);
    };

    // ========================================
    // AUTOPLAY
    // ========================================

    useEffect(() => {

        if (
            !normalizedBanners ||
            normalizedBanners.length <= 1
        ) return;

        intervalRef.current =
            setInterval(() => {
                const nextIndex =
                    current === normalizedBanners.length - 1
                        ? 0
                        : current + 1;

                setDirection(1);
                setCurrent(nextIndex);
            }, 9000);

        return () => {
            if (
                intervalRef.current
            ) {
                clearInterval(
                    intervalRef.current
                );
            }
        };

    }, [current, normalizedBanners.length]);

    // ========================================
    // EMPTY
    // ========================================

    if (
        !normalizedBanners ||
        normalizedBanners.length === 0
    ) {

        return (

            <div className="
                relative
                overflow-hidden

                bg-black/1

                rounded-3xl
                md:rounded-[40px]

                h-[260px]
                sm:h-[320px]
                md:h-[420px]
                xl:h-[540px]

                bg-gradient-to-br
                from-emerald-400
                via-cyan-400
                to-yellow-300

                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            ">

                {/* GLOW */}

                <div className="
                    absolute
                    -top-20
                    -right-20

                    w-52
                    h-52

                    md:w-72
                    md:h-72

                    rounded-full

                    bg-white/25

                    blur-3xl
                " />

                <div className="
                    absolute
                    -bottom-20
                    -left-20

                    w-52
                    h-52

                    md:w-72
                    md:h-72

                    rounded-full

                    bg-yellow-200/30

                    blur-3xl
                " />

                {/* CONTENT */}

                <div className="
                    relative
                    z-10

                    h-full

                    flex
                    flex-col

                    items-center
                    justify-center

                    text-center

                    px-4
                    md:px-8

                    text-white
                ">

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
                            w-14
                            h-14

                            md:w-24
                            md:h-24

                            rounded-full

                            bg-white/20

                            backdrop-blur-xl

                            flex
                            items-center
                            justify-center

                            mb-4
                            md:mb-8
                        "
                    >

                        <Sparkles
                            size={30}
                        />

                    </motion.div>

                    {/* TITLE */}

                    <motion.h1

                        initial={{
                            y: 30,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.25,
                        }}

                        className="
                            text-3xl
                            sm:text-4xl
                            md:text-6xl
                            xl:text-7xl

                            font-black

                            leading-tight
                        "
                    >

                        VEZBERRY

                    </motion.h1>

                    {/* DESCRIPTION */}

                    <motion.p

                        initial={{
                            y: 30,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.25,
                        }}

                        className="
                            mt-3
                            md:mt-6

                            max-w-2xl

                            text-sm
                            sm:text-base
                            md:text-xl
                            xl:text-2xl

                            text-white/90

                            leading-relaxed
                        "
                    >

                        Premium dessert &
                        modern drinks
                        experience 🍓

                    </motion.p>

                    {/* BUTTON */}

                    <motion.div

                        initial={{
                            y: 30,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.25,
                        }}

                        className="
                            mt-5
                            md:mt-10
                        "
                    >

                        <button

                            onClick={
                                onExplore
                            }

                            className="
                                shimmer-btn

                                h-11
                                md:h-16

                                px-5
                                md:px-10

                                rounded-2xl
                                md:rounded-3xl

                                bg-white

                                text-pink-600

                                hover:bg-white

                                hover:scale-105

                                shadow-2xl

                                text-sm
                                md:text-lg

                                font-black
                            "
                        >

                            Explore Menu

                            <ArrowRight
                                className="
                                    ml-2
                                    md:ml-3

                                    w-4
                                    h-4

                                    md:w-5
                                    md:h-5
                                "
                            />

                        </button>

                    </motion.div>

                </div>

            </div>

        );

    }

    // ========================================
    // ACTIVE
    // ========================================

    // NORMALIZE BANNER



    const banner =

        banners?.[current] ||

        banners?.[0] ||

        null;

    if (!banner) {

        return null;

    }

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            relative
            overflow-hidden

            rounded-3xl
            md:rounded-[40px]

            h-[260px]
            sm:h-[320px]
            md:h-[420px]
            xl:h-[540px]

            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        ">

            {/* SLIDER */}

            <AnimatePresence
                mode="sync"
                initial={false}
            >

                <motion.div

                    key={current}

                    custom={direction}

                    variants={slideVariants}

                    initial="enter"

                    animate="center"

                    exit="exit"

                    transition={{
                        ease: [0.25, 0.1, 0.25, 1],
                    }}

                    className="
                absolute
                inset-0
                "
                    style={{
                        backgroundColor: '#050816',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                    }}
                >

                    {/* IMAGE */}

                    <img

                        key={current}

                        src={banner.image_url || banner.image}

                        alt={banner.title || "Banner"}

                        loading="eager"

                        decoding="async"

                        fetchPriority={
                            current === 0
                                ? "high"
                                : "auto"
                        }

                        className="
                        absolute
                        inset-0

                        w-full
                        h-full

                        object-cover
                        object-center

                        will-change-transform
                        transform-gpu
                    "
                        style={{
                            display: 'block',
                            backgroundColor: '#050816',
                            WebkitBackfaceVisibility: 'hidden',
                            backfaceVisibility: 'hidden',
                            WebkitTransform: 'translateZ(0)',
                        }}
                    />

                    {/* OVERLAY */}

                    <div className="
                        absolute
                        inset-0

                        bg-gradient-to-r
                        from-black/15
                        via-black/5
                        to-black/0
                    " />

                    {/* EXTRA */}

                    <div className="
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-black/55
                        via-transparent
                        to-transparent
                    " />

                </motion.div>

            </AnimatePresence>

            {/* GLOW */}

            <div className="
                absolute
                -top-20
                -right-20

                w-52
                h-52

                md:w-[400px]
                md:h-[400px]

                rounded-full

                bg-pink-500/20

                blur-3xl
            " />

            <div className="
                absolute
                -bottom-20
                -left-20

                w-52
                h-52

                md:w-[400px]
                md:h-[400px]

                rounded-full

                bg-yellow-300/15

                blur-3xl
            " />

            {/* CONTENT */}

            <div className="
                relative
                z-10

                h-full

                flex
                items-center

                px-4
                sm:px-6
                md:px-12
                xl:px-16
            ">

                <div className="
                    max-w-3xl
                ">

                    {/* BADGE */}

                    <motion.div

                        initial={{
                            y: 20,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        className="
                            inline-flex

                            items-center
                            gap-2

                            h-9
                            md:h-12

                            px-4
                            md:px-5

                            rounded-full

                            bg-white/10

                            border
                            border-white/20

                            backdrop-blur-xl

                            text-white

                            text-xs
                            md:text-base

                            font-bold

                            shadow-lg
                        "
                    >

                        <Sparkles
                            size={16}
                        />

                        Humbly crafted,
                        premium taste

                    </motion.div>

                    {/* TITLE */}

                    <motion.h1

                        initial={{
                            y: 40,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.2,
                        }}

                        className="
                            mt-4
                            md:mt-8

                            text-3xl
                            sm:text-4xl
                            md:text-6xl
                            xl:text-7xl

                            font-black

                            leading-tight

                            text-white
                        "
                    >

                        {
                            banner.title
                        }

                    </motion.h1>

                    {/* DESCRIPTION */}

                    <motion.p

                        initial={{
                            y: 40,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.35,
                        }}

                        className="
                            mt-3
                            md:mt-6

                            text-sm
                            sm:text-base
                            md:text-xl
                            xl:text-2xl

                            text-white/85

                            leading-relaxed

                            max-w-2xl
                        "
                    >

                        {
                            banner.description ||

                            banner.subtitle ||

                            ""
                        }

                    </motion.p>

                    {/* BUTTON */}

                    <motion.div

                        initial={{
                            y: 40,
                            opacity: 0,
                        }}

                        animate={{
                            y: 0,
                            opacity: 1,
                        }}

                        transition={{
                            delay: 0.5,
                        }}

                        className="
                            mt-5
                            md:mt-10
                        "
                    >

                        <button

                            onClick={
                                onExplore
                            }

                            className="
                                shimmer-btn

                                h-11
                                md:h-16

                                px-5
                                md:px-10

                                rounded-2xl
                                md:rounded-3xl

                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500

                                hover:scale-105

                                shadow-[0_20px_50px_rgba(255,80,120,0.45)]

                                text-sm
                                md:text-lg

                                font-black
                            "
                        >

                            Explore Menu

                            <ArrowRight
                                className="
                                    ml-2
                                    md:ml-3

                                    w-4
                                    h-4

                                    md:w-5
                                    md:h-5
                                "
                            />

                        </button>

                    </motion.div>

                </div>

            </div>

            {/* DOTS */}

            <div className="
                absolute

                bottom-4
                md:bottom-8

                left-1/2
                -translate-x-1/2

                z-20

                flex
                gap-2
                md:gap-3
            ">

                {normalizedBanners.map(

                    (_, index) => (

                        <button

                            key={index}

                            onClick={() =>
                                slideTo(
                                    index
                                )
                            }

                            className={`
                                transition-all
                                duration-500

                                rounded-full

                                ${current === index

                                    ? `
                                        w-8
                                        md:w-12

                                        h-3
                                        md:h-4

                                        bg-white
                                    `

                                    : `
                                        w-3
                                        md:w-4

                                        h-3
                                        md:h-4

                                        bg-white/40
                                    `
                                }
                            `}
                        />

                    )

                )}

            </div>

        </div >

    );

}

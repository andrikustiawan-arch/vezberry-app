import React from 'react';

import {
    motion
} from 'framer-motion';

import {

    Pizza,

    Croissant,

    Cookie,

    Wheat,

    Soup,

    CupSoda,

} from 'lucide-react';

// ========================================
// COLOR
// ========================================

const getCategoryColor = (id) => {

    switch (id) {

        case 'pizza':
            return '#f97316';

        case 'sweet_fluffy_bread':
            return '#f59e0b';

        case 'naturally_bread':
            return '#84cc16';

        case 'kitchen_snack':
            return '#10b981';

        case 'fingery_snack':
            return '#a855f7';

        case 'authentic_drink':
            return '#06b6d4';

        default:
            return '#6b7280';

    }

};

// ========================================
// DATA
// ========================================

const categories = [

    {

        id: 'pizza',

        name: 'Pizza',

        desc: 'Fusion taste',

        icon: Pizza,

        color: 'from-orange-500 to-red-500',

    },

    {

        id: 'sweet_fluffy_bread',

        name: 'Fluffy Bread',

        desc: 'Manis & premium',

        icon: Croissant,

        color: 'from-amber-500 to-yellow-500',

    },

    {

        id: 'naturally_bread',

        name: 'Natural Bread',

        desc: 'Lebih sehat & alami',

        icon: Wheat,

        color: 'from-lime-500 to-green-500',

    },

    {

        id: 'kitchen_snack',

        name: 'Kitchen Snack',

        desc: 'Jajanan tradisional',

        icon: Soup,

        color: 'from-emerald-500 to-teal-500',

    },

    {

        id: 'fingery_snack',

        name: 'Fingery Snack',

        desc: 'Cemilan favorit',

        icon: Cookie,

        color: 'from-purple-500 to-pink-500',

    },

    {

        id: 'authentic_drink',

        name: 'Authentic Drink',

        desc: 'Khas VezBerry',

        icon: CupSoda,

        color: 'from-cyan-500 to-blue-500',

    },

];

// ========================================
// COMPONENT
// ========================================

export default function CategoryTabs({

    activeCategory,

    onCategoryChange

}) {

    const [
        ripple,
        setRipple
    ] = React.useState(null);

    // ========================================
    // CLICK
    // ========================================

    const handleClick = (
        e,
        id
    ) => {

        const rect =

            e.currentTarget
                .getBoundingClientRect();

        setRipple({

            x:
                e.clientX - rect.left,

            y:
                e.clientY - rect.top,

            key:
                Date.now()

        });

        onCategoryChange(id);

    };

    // ========================================
    // BUTTON
    // ========================================

    const renderButton = (
        category
    ) => {

        const Icon =
            category.icon;

        const isActive =

            activeCategory ===
            category.id;

        return (

            <motion.button

                key={
                    category.id
                }

                onClick={(e) =>
                    handleClick(
                        e,
                        category.id
                    )
                }

                whileHover={{
                    scale: 1.02
                }}

                whileTap={{
                    scale: 0.96
                }}

                className={`
                    relative
                    overflow-hidden

                    flex
                    items-center

                    gap-0.5

                    px-2
                    sm:px-5
                    md:px-6

                    py-1.5
                    sm:py-4
                    md:py-5

                    rounded-[24px]
                    md:rounded-full

                    transition-all
                    duration-300

                    backdrop-blur-xl

                    active:scale-95

                    min-w-[150px]
                    sm:min-w-[190px]
                    md:min-w-[250px]

                    shadow-[0_4px_14px_rgba(0,0,0,0.08)]

                    hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]

                    border

                    ${isActive

                        ? `
                            text-white
                            border-transparent

                            shadow-[0_12px_30px_rgba(255,120,120,0.25)]
                        `

                        : `
                            bg-white/95

                            text-gray-800

                            border-gray-200/80
                        `
                    }
                `}
            >

                {/* ACTIVE GLOW */}

                {isActive && (

                    <div className={`
                        absolute
                        inset-0

                        rounded-[24px]
                        md:rounded-full

                        blur-2xl

                        opacity-30

                        bg-gradient-to-r

                        ${category.color}
                    `} />

                )}

                {/* ACTIVE TAB */}

                {isActive && (

                    <motion.div

                        layoutId="activeTab"

                        className={`
                            absolute
                            inset-0

                            rounded-[24px]
                            md:rounded-full

                            bg-gradient-to-r

                            ${category.color}
                        `}

                        transition={{

                            type: "spring",

                            stiffness: 400,

                            damping: 30,

                        }}
                    />

                )}

                {/* ICON */}

                <div className="
                    relative
                    z-10

                    flex
                    items-center
                    justify-center

                    w-10
                    h-11

                    sm:w-12
                    sm:h-12

                    md:w-14
                    md:h-14

                    rounded-2xl

                    bg-white/15

                    backdrop-blur-xl

                    flex-shrink-0

                    shadow-inner
                ">

                    <Icon

                        className="
                            w-10
                            h-10

                            sm:w-12
                            sm:h-12

                            md:w-14
                            md:h-14

                            transition-all
                        "

                        style={{

                            color:

                                isActive

                                    ? '#ffffff'

                                    : getCategoryColor(
                                        category.id
                                    )

                        }}
                    />

                </div>

                {/* TEXT */}

                <div className="
                    flex
                    flex-col

                    text-left

                    leading-[1.15]

                    relative
                    z-10

                    min-w-0

                    gap-1
                ">

                    {/* NAME */}

                    <span className="
                        whitespace-nowrap

                        font-extrabold

                        text-[18px]
                        sm:text-[20px]
                        md:text-[24px]

                        tracking-[-0.02em]

                        truncate
                    ">

                        {
                            category.name
                        }

                    </span>

                    {/* DESC */}

                    <span className={`
                        text-[13px]
                        sm:text-xs
                        md:text-sm

                        font-medium

                        truncate

                        ${isActive

                            ? 'text-white/85'

                            : 'text-gray-500'
                        }
                    `}>

                        {
                            category.desc
                        }

                    </span>

                </div>

                {/* RIPPLE */}

                {ripple && (

                    <span

                        key={
                            ripple.key
                        }

                        className="
                            absolute

                            rounded-full

                            bg-white/40

                            pointer-events-none
                        "

                        style={{

                            left:
                                ripple.x,

                            top:
                                ripple.y,

                            width: 100,

                            height: 100,

                            transform:
                                "translate(-50%, -50%)",

                            animation:
                                "ripple 0.45s linear"

                        }}
                    />

                )}

            </motion.button>

        );

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            w-full

            flex
            flex-col

            gap-4
            md:gap-5

            items-center
        ">

            {/* TOP */}

            <div className="
                flex

                gap-3
                md:gap-4

                justify-center

                flex-wrap

                w-full
            ">

                {categories
                    .slice(0, 3)
                    .map((category) =>

                        renderButton(
                            category
                        )

                    )
                }

            </div>

            {/* BOTTOM */}

            <div className="
                flex

                gap-3
                md:gap-4

                justify-center

                flex-wrap

                w-full
            ">

                {categories
                    .slice(3, 6)
                    .map((category) =>

                        renderButton(
                            category
                        )

                    )
                }

            </div>

        </div>

    );

}
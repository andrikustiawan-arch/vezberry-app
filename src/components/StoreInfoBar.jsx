import React, {

    useState,

    useEffect

} from 'react';

import {

    Clock,

    MapPin,

    Store,

} from 'lucide-react';

// ========================================
// TIME PARSER
// ========================================

function parseTime(timeStr) {

    if (!timeStr)
        return null;

    const [
        h,
        m
    ] = timeStr
        .split(':')
        .map(Number);

    return h * 60 + m;

}

// ========================================
// COMPONENT
// ========================================

export default function StoreInfoBar({

    settings,

    storeStatus,

}) {

    // ========================================
    // STATE
    // ========================================

    const [
        now,
        setNow
    ] = useState(
        new Date()
    );

    // ========================================
    // TIMER
    // ========================================

    useEffect(() => {

        const t =
            setInterval(() => {

                setNow(
                    new Date()
                );

            }, 1000);

        return () =>
            clearInterval(t);

    }, []);

    // ========================================
    // DATE
    // ========================================

    const days = [

        'Minggu',

        'Senin',

        'Selasa',

        'Rabu',

        'Kamis',

        'Jumat',

        'Sabtu'

    ];

    const months = [

        'Jan',

        'Feb',

        'Mar',

        'Apr',

        'Mei',

        'Jun',

        'Jul',

        'Agu',

        'Sep',

        'Okt',

        'Nov',

        'Des'

    ];

    // ========================================
    // TIME STRING
    // ========================================

    const timeStr =

        now.toLocaleTimeString(
            'id-ID',
            {

                hour: '2-digit',

                minute: '2-digit',

                second: '2-digit',

                hour12: false

            }
        );

    const dayStr =
        days[now.getDay()];

    const dateStr =
        `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const isOpen =
        storeStatus?.isOpen || false;

    const statusText =
        storeStatus?.statusText || "TUTUP";

    const todaySchedule =
        storeStatus?.today || null;

    const openTime =
        todaySchedule?.open || "--:--";

    const closeTime =
        todaySchedule?.close || "--:--";


    // ========================================
    // SETTINGS
    // ========================================



    // ========================================
    // OPEN STATUS
    // ========================================



    // ========================================
    // PROGRESS
    // ========================================

    let progress = 0;

    if (

        openMins !== null &&
        closeMins !== null &&
        isOpen

    ) {

        const total =
            closeMins - openMins;

        const elapsed =
            currentMins - openMins;

        progress = Math.min(

            100,

            Math.max(
                0,
                (elapsed / total) * 100
            )

        );

    }

    // ========================================
    // REMAINING
    // ========================================

    const minsToClose =

        isOpen &&
            closeMins !== null

            ? closeMins - currentMins

            : 0;

    const hoursLeft =
        Math.floor(
            minsToClose / 60
        );

    const minsLeft =
        minsToClose % 60;

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            relative

            border-b
            border-white/30

            bg-white/75

            backdrop-blur-2xl

            shadow-sm
        ">

            {/* GLOW */}

            <div className="
                absolute
                inset-0

                bg-gradient-to-r

                from-pink-50/40
                via-white/20
                to-emerald-50/30

                pointer-events-none
            " />

            {/* CONTENT */}

            <div className="
                relative

                max-w-7xl

                mx-auto

                px-3
                sm:px-4
                md:px-6

                py-2
                md:py-3
            ">

                {/* TOP BAR */}

                <div className="
                    flex

                    flex-col
                    md:flex-row

                    md:items-center
                    md:justify-between

                    gap-2
                    md:gap-4
                ">

                    {/* LEFT */}

                    <div className="
                        flex
                        items-center

                        gap-2
                        md:gap-4

                        flex-wrap
                    ">

                        {/* TIME */}

                        <div className="
                            flex
                            items-center

                            gap-1.5

                            text-slate-600
                        ">

                            <Clock className="
                                w-3.5
                                h-3.5

                                md:w-4
                                md:h-4

                                text-rose-500
                            " />

                            <span className="
                                font-mono

                                font-bold

                                text-[11px]
                                sm:text-xs
                                md:text-sm

                                text-slate-800
                            ">

                                {timeStr}

                            </span>

                        </div>

                        {/* DATE */}

                        <div className="
                            hidden
                            sm:flex

                            items-center

                            text-[11px]
                            md:text-xs

                            text-slate-500
                        ">

                            {dayStr},
                            {dateStr}

                        </div>

                    </div>

                    {/* CENTER */}

                    {settings?.address && (

                        <div className="
                            hidden
                            lg:flex

                            items-center

                            gap-1.5

                            text-xs

                            text-slate-500

                            max-w-[380px]

                            truncate
                        ">

                            <MapPin className="
                                w-3.5
                                h-3.5

                                text-pink-400

                                flex-shrink-0
                            " />

                            <span className="
                                truncate
                            ">

                                {
                                    settings.address
                                }

                            </span>

                        </div>

                    )}

                    {/* RIGHT */}

                    <div className="
                        flex
                        items-center

                        justify-between
                        md:justify-end

                        gap-3
                    ">

                        {/* STORE */}

                        <div className="
                            flex
                            items-center

                            gap-1.5

                            text-slate-500
                        ">

                            <Store className="
                                w-3.5
                                h-3.5

                                md:w-4
                                md:h-4
                            " />

                            <span className="
                                text-[11px]
                                md:text-xs
                            ">

                                {openTime}
                                —
                                {closeTime}

                            </span>

                        </div>

                        {/* STATUS */}

                        <div className={`
                            inline-flex

                            items-center

                            gap-1.5

                            px-2.5
                            md:px-3

                            py-1

                            rounded-full

                            text-[10px]
                            md:text-xs

                            font-bold

                            shadow-sm

                            transition-all

${statusText === "LIBUR"

                                ? `
                                    bg-yellow-100
                                    text-yellow-700
                                `

                                : isOpen

                                    ? `
                                        bg-emerald-100
                                        text-emerald-700
                                    `

                                    : `
                                        bg-red-100
                                        text-red-600
                                    `
                            }
                        `}>

                            {/* DOT */}

                            <span className={`
                                w-1.5
                                h-1.5

                                rounded-full

                            ${statusText === "LIBUR"

                                    ? `
                                        bg-yellow-500
                                    `

                                    : isOpen

                                        ? `
                                            bg-emerald-500
                                            animate-pulse
                                        `

                                        : `
                                            bg-red-500
                                        `
                                }
                            `} />

                            {statusText}

                        </div>

                    </div>

                </div>

                {/* PROGRESS */}

                {isOpen && (

                    <div className="
                        mt-2
                        md:mt-3
                    ">

                        {/* LABEL */}

                        <div className="
                            flex
                            items-center
                            justify-between

                            text-[10px]
                            sm:text-xs

                            text-slate-400

                            mb-1
                        ">

                            <span>

                                Jam operasional

                            </span>

                            <span>

                                {hoursLeft > 0
                                    ? `${hoursLeft}j `
                                    : ''
                                }

                                {minsLeft}m lagi tutup

                            </span>

                        </div>

                        {/* BAR */}

                        <div className="
                            h-1.5
                            md:h-2

                            rounded-full

                            bg-slate-100

                            overflow-hidden
                        ">

                            <div

                                className="
                                    h-full

                                    rounded-full

                                    bg-gradient-to-r

                                    from-emerald-400
                                    via-lime-400
                                    to-pink-400

                                    transition-all
                                    duration-1000
                                "

                                style={{

                                    width:
                                        `${progress}%`

                                }}
                            />

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}
import {
    useEffect,
    useState,
} from "react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {

    Plus,
    Trash2,
    Upload,
    Image as ImageIcon,
    Save,
    Sparkles,
    CheckCircle2,

} from "lucide-react";

// ========================================
// STORAGE
// ========================================

const STORAGE_KEY =
    "vezberry_banner_slides";

// ========================================
// COMPONENT
// ========================================

export default function BannerManager() {

    // ========================================
    // STATES
    // ========================================

    const [slides,
        setSlides] =
        useState([]);

    const [saved,
        setSaved] =
        useState(false);

    // ========================================
    // INIT
    // ========================================

    useEffect(() => {

        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (stored) {

            setSlides(
                JSON.parse(stored)
            );

        } else {

            const defaultSlides = [

                {
                    id: 1,

                    title: "VezBerry",

                    subtitle:
                        "Unforgettable Taste",

                    image:
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600",

                },

            ];

            setSlides(defaultSlides);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultSlides)
            );

        }

    }, []);

    // ========================================
    // SAVE
    // ========================================

    const saveSlides = (
        newSlides
    ) => {

        setSlides(newSlides);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(newSlides)
        );

        setSaved(true);

        setTimeout(() => {

            setSaved(false);

        }, 2500);

    };

    // ========================================
    // ADD
    // ========================================

    const addSlide = () => {

        const updated = [

            ...slides,

            {
                id: Date.now(),

                title: "",

                subtitle: "",

                image: "",

            },

        ];

        saveSlides(updated);

    };

    // ========================================
    // REMOVE
    // ========================================

    const removeSlide = (id) => {

        const updated =
            slides.filter(
                (slide) =>
                    slide.id !== id
            );

        saveSlides(updated);

    };

    // ========================================
    // UPDATE
    // ========================================

    const updateSlide = (
        id,
        field,
        value
    ) => {

        const updated =
            slides.map((slide) =>

                slide.id === id

                    ? {
                        ...slide,
                        [field]: value,
                    }

                    : slide

            );

        setSlides(updated);

    };

    // ========================================
    // SAVE SINGLE
    // ========================================

    const handleSaveSlide = () => {

        saveSlides(slides);

    };

    // ========================================
    // IMAGE UPLOAD
    // ========================================

    const handleImageUpload = (
        e,
        id
    ) => {

        const file =
            e.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onloadend = () => {

            updateSlide(
                id,
                "image",
                reader.result
            );

        };

        reader.readAsDataURL(file);

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            relative
            space-y-8
        ">

            {/* FLOATING GLOW */}

            <div className="
                absolute
                -top-20
                -right-20
                w-72
                h-72
                rounded-full
                bg-pink-500/10
                blur-3xl
                pointer-events-none
            " />

            <div className="
                absolute
                -bottom-20
                -left-20
                w-72
                h-72
                rounded-full
                bg-orange-400/10
                blur-3xl
                pointer-events-none
            " />

            {/* HEADER */}

            <div className="
                flex
                flex-col
                md:flex-row
                gap-5
                items-start
                md:items-center
                justify-between
            ">

                <div>

                    <div className="
                        inline-flex
                        items-center
                        gap-2
                        h-11
                        px-5
                        rounded-full
                        bg-pink-100
                        text-pink-600
                        font-bold
                    ">

                        <Sparkles
                            size={18}
                        />

                        Banner Slideshow

                    </div>

                    <h2 className="
                        mt-5
                        text-4xl
                        font-black
                        tracking-tight
                        text-slate-900
                    ">

                        Homepage Banner

                    </h2>

                    <p className="
                        mt-2
                        text-slate-500
                    ">

                        Kelola banner slideshow
                        homepage VEZBERRY.

                    </p>

                </div>

                {/* ADD */}

                <button

                    onClick={addSlide}

                    className="
                        h-14
                        px-7
                        rounded-2xl
                        bg-gradient-to-r
                        from-pink-500
                        via-rose-500
                        to-orange-400
                        text-white
                        font-black
                        flex
                        items-center
                        gap-3
                        shadow-[0_15px_40px_rgba(255,80,120,0.25)]
                        hover:scale-[1.03]
                        active:scale-[0.98]
                        transition-all
                        duration-300
                    "
                >

                    <Plus size={20} />

                    Tambah Slide

                </button>

            </div>

            {/* SAVE INFO */}

            <AnimatePresence>

                {saved && (

                    <motion.div

                        initial={{
                            opacity: 0,
                            y: -10,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        exit={{
                            opacity: 0,
                            y: -10,
                        }}

                        className="
                            flex
                            items-center
                            gap-2
                            text-green-600
                            font-bold
                        "
                    >

                        <CheckCircle2
                            size={18}
                        />

                        Perubahan berhasil disimpan

                    </motion.div>

                )}

            </AnimatePresence>

            {/* LIST */}

            <div className="
                grid
                gap-8
            ">

                {slides.map((slide) => (

                    <motion.div

                        key={slide.id}

                        initial={{
                            opacity: 0,
                            y: 20,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        className="
                            overflow-hidden
                            rounded-[36px]
                            border
                            border-white/30
                            bg-white/80
                            backdrop-blur-2xl
                            shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                            hover:shadow-[0_20px_50px_rgba(255,80,120,0.12)]
                            transition-all
                            duration-500
                        "
                    >

                        <div className="
                            grid
                            lg:grid-cols-2
                            gap-8
                            p-7
                        ">

                            {/* PREVIEW */}

                            <div className="
                                relative
                                overflow-hidden
                                rounded-[32px]
                                min-h-[350px]
                                bg-slate-100
                            ">

                                {slide.image ? (

                                    <img

                                        src={slide.image}

                                        alt=""

                                        className="
                                            absolute
                                            inset-0
                                            w-full
                                            h-full
                                            object-cover
                                            scale-105
                                            transition-transform
                                            [animation-duration:8000ms]
                                            ease-linear
                                        "
                                    />

                                ) : (

                                    <div className="
                                        absolute
                                        inset-0
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        text-slate-400
                                    ">

                                        <ImageIcon
                                            size={54}
                                        />

                                        <p className="
                                            mt-4
                                            font-medium
                                        ">
                                            Belum ada gambar
                                        </p>

                                    </div>

                                )}

                                {/* OVERLAY */}

                                <div className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/70
                                    via-black/20
                                    to-transparent
                                " />

                                {/* TEXT */}

                                <div className="
                                    absolute
                                    bottom-0
                                    left-0
                                    right-0
                                    p-8
                                    text-white
                                ">

                                    <h3 className="
                                        text-4xl
                                        font-black
                                        leading-tight
                                    ">

                                        {
                                            slide.title ||
                                            "Judul Banner"
                                        }

                                    </h3>

                                    <p className="
                                        mt-3
                                        text-white/80
                                        text-lg
                                    ">

                                        {
                                            slide.subtitle ||
                                            "Subjudul banner..."
                                        }

                                    </p>

                                </div>

                            </div>

                            {/* FORM */}

                            <div className="
                                space-y-5
                            ">

                                {/* TITLE */}

                                <div>

                                    <label className="
                                        text-sm
                                        font-bold
                                        text-slate-700
                                    ">

                                        Judul Banner

                                    </label>

                                    <input

                                        type="text"

                                        value={
                                            slide.title
                                        }

                                        onChange={(e) =>

                                            updateSlide(
                                                slide.id,
                                                "title",
                                                e.target.value
                                            )

                                        }

                                        placeholder="
                                        Judul banner...
                                        "

                                        className="
                                            mt-2
                                            w-full
                                            h-14
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white/80
                                            px-5
                                            transition-all
                                            duration-300
                                            focus:ring-4
                                            focus:ring-pink-200
                                            focus:border-pink-400
                                        "
                                    />

                                </div>

                                {/* SUBTITLE */}

                                <div>

                                    <label className="
                                        text-sm
                                        font-bold
                                        text-slate-700
                                    ">

                                        Subjudul Banner

                                    </label>

                                    <input

                                        type="text"

                                        value={
                                            slide.subtitle
                                        }

                                        onChange={(e) =>

                                            updateSlide(
                                                slide.id,
                                                "subtitle",
                                                e.target.value
                                            )

                                        }

                                        placeholder="
                                        Subjudul banner...
                                        "

                                        className="
                                            mt-2
                                            w-full
                                            h-14
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white/80
                                            px-5
                                            transition-all
                                            duration-300
                                            focus:ring-4
                                            focus:ring-pink-200
                                            focus:border-pink-400
                                        "
                                    />

                                </div>

                                {/* UPLOAD */}

                                <label className="
                                    relative
                                    overflow-hidden
                                    h-16
                                    rounded-2xl
                                    border-2
                                    border-dashed
                                    border-pink-200
                                    bg-pink-50/70
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                    cursor-pointer
                                    font-bold
                                    text-pink-600
                                    hover:scale-[1.01]
                                    hover:border-pink-400
                                    transition-all
                                    duration-300
                                ">

                                    <Upload
                                        size={20}
                                    />

                                    Upload Banner

                                    <input

                                        type="file"

                                        accept="image/*"

                                        hidden

                                        onChange={(e) =>

                                            handleImageUpload(
                                                e,
                                                slide.id
                                            )

                                        }

                                    />

                                </label>

                                {/* ACTIONS */}

                                <div className="
                                    flex
                                    gap-4
                                ">

                                    {/* SAVE */}

                                    <button

                                        onClick={
                                            handleSaveSlide
                                        }

                                        className="
                                            flex-1
                                            h-14
                                            rounded-2xl
                                            bg-gradient-to-r
                                            from-pink-500
                                            via-rose-500
                                            to-orange-400
                                            text-white
                                            font-black
                                            flex
                                            items-center
                                            justify-center
                                            gap-3
                                            shadow-[0_15px_35px_rgba(255,80,120,0.25)]
                                            hover:scale-[1.02]
                                            active:scale-[0.98]
                                            transition-all
                                            duration-300
                                        "
                                    >

                                        <Save
                                            size={18}
                                        />

                                        Simpan Slide

                                    </button>

                                    {/* DELETE */}

                                    <button

                                        onClick={() =>
                                            removeSlide(
                                                slide.id
                                            )
                                        }

                                        className="
                                            h-14
                                            px-6
                                            rounded-2xl
                                            bg-red-500
                                            text-white
                                            font-bold
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            hover:bg-red-600
                                            hover:scale-[1.02]
                                            transition-all
                                            duration-300
                                        "
                                    >

                                        <Trash2
                                            size={18}
                                        />

                                        Hapus

                                    </button>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                ))}

            </div>

        </div>

    );

}
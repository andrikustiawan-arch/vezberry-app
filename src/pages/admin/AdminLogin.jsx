import React, {
    useState,
} from "react";

import {
    useNavigate,
    Link,
} from "react-router-dom";

import {
    motion,
} from "framer-motion";

import {

    ShieldCheck,

    LockKeyhole,

    Store,

    Eye,

    EyeOff,

    ArrowLeft,

    Sparkles,

} from "lucide-react";

import {
    Button
} from "@/components/ui/button";

import {
    toast
} from "sonner";

export default function AdminLogin() {

    const navigate =
        useNavigate();

    const [pin,
        setPin] =
        useState("");

    const [showPin,
        setShowPin] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            // delay animation
            await new Promise(
                r => setTimeout(r, 800)
            );

            // PIN ADMIN
            if (pin === "135790") {

                localStorage.setItem(

                    "vezberry_admin_auth",

                    "true"

                );

                localStorage.setItem(

                    "vezberry_admin_profile",

                    JSON.stringify({

                        name: "Administrator",

                        role: "admin",

                        login_date:
                            new Date().toISOString(),

                    })

                );

                toast.success(
                    "Login berhasil 🎉"
                );

                navigate(
                    "/admin/dashboard"
                );

            } else {

                toast.error(
                    "PIN administrator salah"
                );

            }

        } catch (err) {

            console.log(err);

            toast.error(
                "Gagal login"
            );

        } finally {

            setLoading(false);

        }

    };

    // ========================================
    // UI
    // ========================================

    return (

        <div className="
            min-h-screen
            overflow-hidden
            relative
            bg-[#0f172a]
            flex
            items-center
            justify-center
            px-4
        ">

            {/* BACKGROUND */}

            <div className="
                absolute
                inset-0
                overflow-hidden
            ">

                <div className="
                    absolute
                    top-[-150px]
                    left-[-100px]
                    w-[420px]
                    h-[420px]
                    rounded-full
                    bg-pink-500/20
                    blur-3xl
                " />

                <div className="
                    absolute
                    bottom-[-180px]
                    right-[-100px]
                    w-[500px]
                    h-[500px]
                    rounded-full
                    bg-rose-500/20
                    blur-3xl
                " />

                <div className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]
                " />

            </div>

            {/* CARD */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: 30,
                    scale: 0.95
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}

                transition={{
                    duration: 0.45
                }}

                className="
                    relative
                    z-10
                    w-full
                    max-w-md
                "
            >

                <div className="
                    rounded-[40px]
                    border
                    border-white/10
                    bg-white/10
                    backdrop-blur-2xl
                    shadow-[0_20px_80px_rgba(0,0,0,0.45)]
                    overflow-hidden
                ">

                    {/* TOP */}

                    <div className="
                        px-8
                        pt-10
                        pb-8
                        text-center
                    ">

                        {/* LOGO */}

                        <motion.div

                            animate={{
                                y: [0, -6, 0]
                            }}

                            transition={{
                                repeat: Infinity,
                                duration: 3
                            }}

                            className="
                                w-28
                                h-28
                                rounded-[32px]
                                bg-gradient-to-br
                                from-pink-500
                                via-rose-500
                                to-orange-400
                                flex
                                items-center
                                justify-center
                                mx-auto
                                shadow-[0_20px_40px_rgba(244,63,94,0.45)]
                            "
                        >

                            <Store
                                className="
                                    text-white
                                "
                                size={50}
                            />

                        </motion.div>

                        {/* TITLE */}

                        <h1 className="
                            mt-8
                            text-5xl
                            font-black
                            tracking-tight
                            text-white
                        ">
                            VEZBERRY
                        </h1>

                        <div className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            mt-4
                            text-pink-200
                        ">

                            <Sparkles
                                size={16}
                            />

                            <p className="
                                text-sm
                                tracking-[0.25em]
                                uppercase
                            ">
                                Premium Admin Panel
                            </p>

                        </div>

                    </div>

                    {/* FORM */}

                    <form

                        onSubmit={handleLogin}

                        className="
                            px-8
                            pb-10
                        "
                    >

                        {/* LABEL */}

                        <div className="
                            mb-3
                            flex
                            items-center
                            gap-2
                            text-white
                        ">

                            <ShieldCheck
                                size={18}
                            />

                            <span className="
                                text-sm
                                font-semibold
                            ">
                                Administrator PIN
                            </span>

                        </div>

                        {/* INPUT */}

                        <div className="
                            relative
                        ">

                            <LockKeyhole
                                className="
                                    absolute
                                    left-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-pink-300
                                "
                                size={20}
                            />

                            <input

                                type={
                                    showPin
                                        ? "text"
                                        : "password"
                                }

                                value={pin}

                                onChange={(e) =>
                                    setPin(
                                        e.target.value
                                    )
                                }

                                placeholder="
                                Masukkan PIN Admin
                                "

                                className="
                                    w-full
                                    h-16
                                    rounded-2xl
                                    bg-white/10
                                    border
                                    border-white/10
                                    backdrop-blur-xl
                                    text-white
                                    placeholder:text-white/40
                                    pl-14
                                    pr-14
                                    outline-none
                                    focus:ring-4
                                    focus:ring-pink-500/30
                                    transition-all
                                "
                            />

                            {/* EYE */}

                            <button

                                type="button"

                                onClick={() =>
                                    setShowPin(
                                        !showPin
                                    )
                                }

                                className="
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-pink-300
                                "
                            >

                                {showPin ? (

                                    <EyeOff
                                        size={20}
                                    />

                                ) : (

                                    <Eye
                                        size={20}
                                    />

                                )}

                            </button>

                        </div>

                        {/* LOGIN BUTTON */}

                        <Button

                            type="submit"

                            disabled={loading}

                            className="
                                w-full
                                h-16
                                mt-7
                                rounded-2xl
                                text-lg
                                font-bold
                                bg-gradient-to-r
                                from-pink-500
                                via-rose-500
                                to-orange-400
                                hover:opacity-95
                                border-0
                                shadow-[0_15px_40px_rgba(244,63,94,0.35)]
                            "
                        >

                            {loading ? (

                                <div className="
                                    w-6
                                    h-6
                                    rounded-full
                                    border-2
                                    border-white/30
                                    border-t-white
                                    animate-spin
                                " />

                            ) : (

                                <>
                                    <ShieldCheck
                                        className="
                                            w-5
                                            h-5
                                            mr-2
                                        "
                                    />

                                    Masuk Dashboard
                                </>

                            )}

                        </Button>

                        {/* SECURITY */}

                        <div className="
                            mt-6
                            rounded-2xl
                            bg-white/5
                            border
                            border-white/10
                            p-4
                        ">

                            <p className="
                                text-xs
                                text-white/60
                                leading-relaxed
                                text-center
                            ">
                                Sistem administrator lokal VEZBERRY.
                                Semua data tersimpan aman di browser.
                            </p>

                        </div>

                        {/* BACK */}

                        <Link
                            to="/"
                        >

                            <Button

                                type="button"

                                variant="ghost"

                                className="
                                    w-full
                                    mt-5
                                    h-14
                                    rounded-2xl
                                    text-white/70
                                    hover:text-white
                                    hover:bg-white/10
                                "
                            >

                                <ArrowLeft
                                    className="
                                        w-4
                                        h-4
                                        mr-2
                                    "
                                />

                                Kembali ke Toko

                            </Button>

                        </Link>

                    </form>

                </div>

            </motion.div>

        </div>

    );

}
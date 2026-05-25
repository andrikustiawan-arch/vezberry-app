import { useState } from "react";
import {
    useNavigate,
} from "react-router-dom";

import {
    LockKeyhole,
    ShieldCheck,
    ArrowLeft,
} from "lucide-react";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [pin, setPin] = useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    function handleLogin(e) {

        e.preventDefault();

        setError("");

        setLoading(true);

        setTimeout(() => {

            if (pin === "135790") {

                localStorage.setItem(
                    "vezberry_admin_auth",
                    "true"
                );

                navigate("/admin/dashboard");

            } else {

                setError("PIN administrator salah");

            }

            setLoading(false);

        }, 700);

    }

    return (

        <div className="
      min-h-screen
      bg-[radial-gradient(circle_at_top,#ffedf3_0%,#fff8fa_35%,#fff_100%)]
      flex
      items-center
      justify-center
      px-4
      relative
      overflow-hidden
    ">

            {/* BACKGROUND BLUR */}

            <div className="
        absolute
        top-[-120px]
        left-[-120px]
        w-[320px]
        h-[320px]
        bg-pink-300/30
        rounded-full
        blur-3xl
      " />

            <div className="
        absolute
        bottom-[-140px]
        right-[-100px]
        w-[340px]
        h-[340px]
        bg-rose-300/30
        rounded-full
        blur-3xl
      " />

            {/* CARD */}

            <div className="
        relative
        z-10
        w-full
        max-w-md
        rounded-[40px]
        bg-white/75
        backdrop-blur-2xl
        border
        border-pink-100
        shadow-[0_20px_80px_rgba(255,105,145,0.18)]
        p-8
      ">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <button
                        onClick={() => navigate("/")}
                        className="
              w-11
              h-11
              rounded-2xl
              bg-pink-50
              border
              border-pink-100
              flex
              items-center
              justify-center
              text-pink-500
              hover:bg-pink-100
              transition-all
            "
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="
            px-4
            py-2
            rounded-full
            bg-emerald-50
            border
            border-emerald-100
            text-emerald-600
            text-xs
            font-bold
            tracking-wide
          ">
                        SECURE LOGIN
                    </div>

                </div>

                {/* ICON */}

                <div className="
          w-28
          h-28
          rounded-[36px]
          bg-gradient-to-br
          from-pink-500
          via-rose-400
          to-fuchsia-500
          flex
          items-center
          justify-center
          mx-auto
          shadow-[0_20px_40px_rgba(255,0,100,0.25)]
          mt-6
          relative
        ">

                    <div className="
            absolute
            inset-0
            rounded-[36px]
            bg-white/10
            backdrop-blur-sm
          " />

                    <ShieldCheck
                        size={50}
                        className="text-white relative z-10"
                    />

                </div>

                {/* TITLE */}

                <h1 className="
          text-4xl
          font-black
          text-center
          mt-7
          bg-gradient-to-r
          from-pink-600
          via-rose-500
          to-fuchsia-500
          bg-clip-text
          text-transparent
        ">
                    Admin Panel
                </h1>

                <p className="
          text-center
          text-slate-500
          mt-3
          leading-relaxed
        ">
                    Dashboard administrator
                    <br />
                    VEZBERRY Management System
                </p>

                {/* FORM */}

                <form
                    onSubmit={handleLogin}
                    className="mt-10"
                >

                    <label className="
            text-sm
            font-bold
            text-slate-600
            block
            mb-3
          ">
                        PIN Administrator
                    </label>

                    <div className="relative">

                        <LockKeyhole
                            className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-pink-400
              "
                            size={22}
                        />

                        <input
                            type="password"
                            placeholder="Masukkan PIN"
                            value={pin}
                            onChange={(e) =>
                                setPin(e.target.value)
                            }
                            className="
                w-full
                h-16
                rounded-2xl
                bg-gradient-to-br
                from-pink-50
                to-rose-50
                border
                border-pink-100
                pl-14
                pr-4
                text-lg
                font-bold
                tracking-widest
                text-slate-700
                outline-none
                focus:ring-4
                focus:ring-pink-200
                focus:border-pink-300
                transition-all
              "
                        />

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className="
              mt-4
              rounded-2xl
              bg-red-50
              border
              border-red-100
              px-4
              py-3
              text-sm
              text-red-500
              font-semibold
            ">
                            {error}
                        </div>

                    )}

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full
              h-16
              rounded-2xl
              mt-7
              bg-gradient-to-r
              from-pink-500
              via-rose-500
              to-fuchsia-500
              text-white
              text-lg
              font-black
              shadow-[0_15px_35px_rgba(255,0,100,0.25)]
              hover:scale-[1.02]
              transition-all
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
                    >

                        {loading
                            ? "Memverifikasi..."
                            : "Masuk Dashboard"}

                    </button>

                </form>

                {/* FOOTER */}

                <div className="
          mt-8
          text-center
          text-xs
          text-slate-400
          leading-relaxed
        ">
                    Protected Local Administrator Access
                    <br />
                    VezBerry © 2026
                </div>

            </div>

        </div>

    );

}
import { useLocation } from "react-router-dom";

import {
    AlertTriangle,
    Home,
    ShieldAlert
} from "lucide-react";

export default function PageNotFound() {

    const location = useLocation();

    const pageName =
        location.pathname.substring(1);

    const isAdmin =
        localStorage.getItem(
            "vezberry_admin_auth"
        ) === "true";

    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            px-6
            py-10
            bg-gradient-to-br
            from-[#fff7f8]
            via-[#fff2f5]
            to-[#ffe9f0]
        ">

            <div className="
                w-full
                max-w-2xl
                rounded-[40px]
                bg-white/90
                backdrop-blur-2xl
                border
                border-pink-100
                shadow-[0_25px_80px_rgba(255,105,145,0.15)]
                overflow-hidden
            ">

                {/* HEADER */}

                <div className="
                    relative
                    px-10
                    pt-14
                    pb-10
                    text-center
                    bg-gradient-to-r
                    from-pink-500
                    via-rose-500
                    to-orange-400
                ">

                    <div className="
                        w-28
                        h-28
                        rounded-[35px]
                        bg-white/20
                        backdrop-blur-xl
                        flex
                        items-center
                        justify-center
                        mx-auto
                        border
                        border-white/20
                        shadow-2xl
                    ">

                        <AlertTriangle
                            size={56}
                            className="text-white"
                        />

                    </div>

                    <h1 className="
                        mt-8
                        text-7xl
                        font-black
                        tracking-tight
                        text-white
                    ">
                        404
                    </h1>

                    <p className="
                        mt-3
                        text-white/90
                        text-xl
                        font-medium
                    ">
                        Halaman Tidak Ditemukan
                    </p>

                </div>

                {/* CONTENT */}

                <div className="
                    px-10
                    py-10
                ">

                    <div className="
                        rounded-3xl
                        bg-pink-50
                        border
                        border-pink-100
                        p-6
                    ">

                        <p className="
                            text-slate-700
                            text-lg
                            leading-relaxed
                        ">
                            Halaman
                            <span className="
                                font-black
                                text-pink-600
                                mx-2
                            ">
                                /{pageName}
                            </span>
                            belum tersedia atau sudah dipindahkan.
                        </p>

                    </div>

                    {/* ADMIN NOTE */}

                    {isAdmin && (

                        <div className="
                            mt-8
                            rounded-3xl
                            border
                            border-orange-200
                            bg-orange-50
                            p-6
                        ">

                            <div className="
                                flex
                                items-start
                                gap-4
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-orange-100
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                ">

                                    <ShieldAlert
                                        size={28}
                                        className="
                                            text-orange-500
                                        "
                                    />

                                </div>

                                <div>

                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-orange-700
                                    ">
                                        Catatan Administrator
                                    </h3>

                                    <p className="
                                        mt-2
                                        text-orange-600
                                        leading-relaxed
                                    ">
                                        Halaman ini belum dibuat
                                        atau route belum didaftarkan
                                        pada App.jsx.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* BUTTON */}

                    <div className="
                        mt-10
                        flex
                        justify-center
                    ">

                        <button
                            onClick={() =>
                                window.location.href = "/"
                            }
                            className="
                                h-16
                                px-8
                                rounded-2xl
                                bg-gradient-to-r
                                from-pink-500
                                to-rose-400
                                text-white
                                text-lg
                                font-bold
                                flex
                                items-center
                                gap-3
                                shadow-xl
                                hover:scale-[1.03]
                                transition-all
                            "
                        >

                            <Home size={22} />

                            Kembali ke Home

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}
import {
    useMemo,
    useState,
    useEffect,
} from "react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerOverlay,
} from "@/components/ui/drawer";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Textarea,
} from "@/components/ui/textarea";

import {

    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    Wallet,
    MessageCircle,
    Receipt,
    QrCode,
    Clock3,
    AlertTriangle,
    ShieldCheck,

} from "lucide-react";

import {
    toast,
} from "sonner";

// ========================================
// DATE FORMATTER
// ========================================

const formatEstimatedDate = (
    days
) => {

    const totalDays =
        Number(days || 0);

    const date =
        new Date();

    date.setDate(
        date.getDate() +
        totalDays
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

};

// ========================================
// COMPONENT
// ========================================

export default function CartDrawer({

    cart,

    onUpdateQuantity,

    onRemove,

    onCheckout,

    paymentMethod,

    setPaymentMethod,

    qrisImageUrl,

    isOpen,

    onOpenChange,

}) {

    // ========================================
    // FORM
    // ========================================

    const getSavedCustomer = () => {
        if (typeof window === "undefined") {
            return {};
        }

        try {
            return (
                JSON.parse(
                    localStorage.getItem(
                        "vezberry_customer"
                    ) || "{}"
                ) || {}
            );
        } catch (err) {
            return {};
        }
    };

    const [customerName, setCustomerName] = useState(
        () => getSavedCustomer().name || ""
    );

    const [phone, setPhone] = useState(
        () => getSavedCustomer().phone || ""
    );

    const [address, setAddress] = useState(
        () => getSavedCustomer().address || ""
    );

    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const saved = getSavedCustomer();
        setCustomerName(saved.name || "");
        setPhone(saved.phone || "");
        setAddress(saved.address || "");
    }, [isOpen]);

    useEffect(() => {
        try {
            localStorage.setItem(
                "vezberry_customer",
                JSON.stringify({
                    name: customerName,
                    phone,
                    address,
                })
            );
        } catch (err) {
            console.warn(
                "Gagal menyimpan data pelanggan lokal:",
                err
            );
        }
    }, [customerName, phone, address]);

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
    // TOTAL
    // ========================================

    const subtotal =
        useMemo(() => {

            return cart.reduce(

                (sum, item) =>

                    sum +

                    (
                        item.price *
                        item.quantity
                    ),

                0

            );

        }, [cart]);

    const total =
        subtotal;

    // ========================================
    // PREORDER CHECK
    // ========================================

    const hasPreorderItem =
        cart.some(
            item => item.is_preorder
        );

    // ========================================
    // CHECKOUT
    // ========================================

    const handleCheckout = async () => {

        if (!customerName) {

            toast.error(
                "Nama wajib diisi"
            );

            return;

        }

        if (!phone) {

            toast.error(
                "Nomor WA wajib diisi"
            );

            return;

        }

        const orderData = {

            customer_name:
                customerName,

            phone,

            customer_address:
                address,

            notes,

            payment_method:
                paymentMethod,

            items: cart,

            subtotal,

            total,

        };

        // ========================================
        // SAVE ORDER
        // ========================================

        if (onCheckout) {
            try {
                await onCheckout(orderData);
            } catch (err) {
                console.error(err);
                toast.error(
                    err?.message ||
                    "Checkout gagal. Silakan coba lagi."
                );
                return;
            }
        }

        // ========================================
        // WA ITEM TEXT
        // ========================================

        const itemText =
            cart.map(item => {

                const preorderText =

                    item.is_preorder

                        ? `

⏰ PREORDER H-${item.ready_after_days || 0}

📅 Estimasi tersedia:
${formatEstimatedDate(
                            item.ready_after_days
                        )}
`

                        : "";

                return `• ${item.product_name || item.name} x${item.quantity}${preorderText}`;

            }).join("\n");

        // ========================================
        // WA MESSAGE
        // ========================================

        const message = `Halo VEZBERRY 🍓

Saya ingin order:

${itemText}

━━━━━━━━━━━━━━━
TOTAL:
Rp ${total.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━

Nama:
${customerName}

No WA:
${phone}

Alamat:
${address}

Metode Bayar:
${paymentMethod}

Catatan:
${notes || "-"}

Terima kasih 🙏`;

        const encoded =
            encodeURIComponent(
                message
            );

        const waNumber =
            "6282120012025";

        window.open(

            `https://wa.me/${waNumber}?text=${encoded}`,

            "_blank"

        );

        // ========================================
        // RESET
        // ========================================

        setCustomerName("");
        setPhone("");
        setAddress("");
        setNotes("");

        onOpenChange(false);

    };

    // ========================================
    // UI
    // ========================================

    return (

        <Drawer

            modal

            open={isOpen}

            onOpenChange={
                onOpenChange
            }

        >

            <DrawerOverlay
                className={`

fixed
inset-0

z-[9998]

transition-all
duration-300

${isKeyboardOpen

                        ? `
        bg-black/10
        backdrop-blur-0
    `

                        : `
        bg-black/40
        backdrop-blur-sm
    `
                    }

`}
            />

            <DrawerContent className="

pointer-events-auto
z-[9999]

h-[100svh]
max-h-[100svh]

bottom-0

rounded-t-[30px]
md:rounded-t-[42px]

border-0

bg-[#faf8f6]

flex
flex-col
"
            >

                {/* SAFE AREA TOP */}

                <div className="
                    pt-safe
                " />

                {/* HANDLE BAR */}

                <div
                    className={`
        pt-2
        flex
        flex-col
        items-center
        gap-2

        ${isKeyboardOpen ? "hidden" : "flex"}
    `}
                >

                    {/* HANDLE */}

                    <div className="
        w-14
        h-1.5

        rounded-full

        bg-slate-300
    " />

                    {/* CLOSE BUTTON */}

                    <button

                        onClick={() =>
                            onOpenChange(false)
                        }

                        className="
            flex
            items-center

            gap-1

            text-xs

            font-bold

            text-slate-500

            active:scale-95

            transition-all
        "
                    >

                        ↓ Tutup Keranjang

                    </button>

                </div>

                {/* WRAPPER */}

                <div className="
                    mx-auto

                    w-full

                    max-w-full
                    md:max-w-4xl

                    flex-1

                    flex
                    flex-col

                    min-h-0
                ">

                    {/* HEADER */}



                    <DrawerHeader className="
    shrink-0

    px-4
    sm:px-5
    md:px-7

    pt-2
    md:pt-4

    pb-3

    border-b
    border-slate-200/70

    bg-[#faf8f6]/95

    backdrop-blur-xl
">

                        <DrawerTitle className="
        flex
        items-center
        justify-between

        gap-4
    ">

                            {/* LEFT */}

                            <div className="
            flex
            items-center
            gap-3
        ">

                                <div className="
                w-11
                h-11

                md:w-14
                md:h-14

                rounded-2xl

                bg-gradient-to-br
                from-pink-500
                to-rose-500

                flex
                items-center
                justify-center

                shadow-lg
            ">

                                    <ShoppingBag
                                        className="
                        text-white

                        w-5
                        h-5

                        md:w-7
                        md:h-7
                    "
                                    />

                                </div>

                                <div>

                                    <h2 className="
                    text-xl
                    sm:text-2xl
                    md:text-3xl

                    font-black

                    text-slate-900
                ">

                                        Keranjang

                                    </h2>

                                    <p className="
                    text-xs
                    md:text-sm

                    text-slate-500

                    mt-0.5
                ">

                                        {cart.length} item dipilih

                                    </p>

                                </div>

                            </div>

                            {/* RIGHT */}

                            <div className="
            flex
            items-center
            gap-2
        ">

                                {/* HOME */}

                                <button

                                    onClick={() => {

                                        onOpenChange(false);

                                        window.scrollTo({

                                            top: 0,

                                            behavior: "smooth",

                                        });

                                    }}

                                    className="
                    h-10
                    md:h-12

                    px-4

                    rounded-2xl

                    bg-pink-100

                    flex
                    items-center

                    text-sm
                    md:text-base

                    font-black

                    text-pink-600

                    hover:bg-pink-200

                    transition-all
                "
                                >

                                    Beranda

                                </button>

                                {/* TOTAL */}

                                {cart.length > 0 && (

                                    <div className="
                    h-10
                    md:h-12

                    px-4

                    rounded-2xl

                    bg-pink-100

                    flex
                    items-center

                    text-sm
                    md:text-base

                    font-black

                    text-pink-600
                ">

                                        Rp {

                                            total.toLocaleString(
                                                "id-ID"
                                            )

                                        }

                                    </div>

                                )}

                            </div>

                        </DrawerTitle>

                    </DrawerHeader>



                    {/* SCROLL AREA */}

                    <div className="

flex-1
min-h-0

overflow-y-auto

overscroll-contain

px-4
sm:px-5
md:px-7

py-4
md:py-6

space-y-5
md:space-y-7

pb-[90px]
md:pb-[80px]

scrollbar-thin
scrollbar-thumb-pink-200
scrollbar-track-transparent
">

                        {/* EMPTY */}

                        {cart.length === 0 && (

                            <motion.div

                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}

                                className="
                                    py-16
                                    md:py-24

                                    text-center
                                "
                            >

                                <div className="
                                    w-24
                                    h-24

                                    md:w-32
                                    md:h-32

                                    rounded-full

                                    bg-pink-100

                                    mx-auto

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <ShoppingBag
                                        className="
                                            text-pink-500
                                        "
                                        size={42}
                                    />

                                </div>

                                <h2 className="
                                    mt-7

                                    text-2xl
                                    md:text-4xl

                                    font-black

                                    text-slate-800
                                ">

                                    Keranjang kosong

                                </h2>

                                <p className="
                                    mt-3

                                    text-sm
                                    md:text-lg

                                    text-slate-500

                                    leading-relaxed
                                ">

                                    Tambahkan menu favorit
                                    untuk mulai order 🍓

                                </p>

                            </motion.div>

                        )}

                        {/* CONTENT */}

                        {cart.length > 0 && (

                            <>

                                {/* PREORDER ALERT */}

                                <AnimatePresence>

                                    {hasPreorderItem && (

                                        <motion.div

                                            initial={{
                                                opacity: 0,
                                                y: 15,
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}

                                            exit={{
                                                opacity: 0,
                                            }}

                                            className="
                                                rounded-[28px]

                                                border
                                                border-orange-200

                                                bg-orange-50

                                                p-4
                                                md:p-5
                                            "
                                        >

                                            <div className="
                                                flex
                                                items-start

                                                gap-3
                                            ">

                                                <div className="
                                                    w-11
                                                    h-11

                                                    rounded-2xl

                                                    bg-orange-100

                                                    flex
                                                    items-center
                                                    justify-center

                                                    shrink-0
                                                ">

                                                    <Clock3
                                                        className="
                                                            text-orange-500
                                                        "
                                                    />

                                                </div>

                                                <div>

                                                    <h3 className="
                                                        text-sm
                                                        md:text-base

                                                        font-black

                                                        text-orange-700
                                                    ">

                                                        Produk Preorder Terdeteksi

                                                    </h3>

                                                    <p className="
                                                        mt-1

                                                        text-xs
                                                        md:text-sm

                                                        text-orange-600

                                                        leading-relaxed
                                                    ">

                                                        Beberapa item memerlukan
                                                        waktu produksi tambahan.
                                                        Estimasi ready sudah
                                                        ditampilkan di bawah item.

                                                    </p>

                                                </div>

                                            </div>

                                        </motion.div>

                                    )}

                                </AnimatePresence>

                                {/* ITEMS */}

                                <div className="
                                    space-y-4
                                    md:space-y-5
                                ">

                                    {cart.map(item => (

                                        <motion.div

                                            key={
                                                item.product_id || item.id
                                            }

                                            layout

                                            initial={{
                                                opacity: 0,
                                                y: 16,
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}

                                            className="
                                                bg-white

                                                rounded-[30px]

                                                p-5
                                                sm:p-5
                                                md:p-6

                                                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                                            "
                                        >

                                            <div className="
                                                flex
                                                gap-4
                                                md:gap-5
                                            ">

                                                {/* IMAGE */}

                                                <div className="
                                                    relative

                                                    shrink-0
                                                ">

                                                    <img

                                                        loading="lazy"

                                                        decoding="async"

                                                        src={
                                                            item.image_url
                                                        }

                                                        alt={
                                                            item.product_name ||
                                                            item.name
                                                        }

                                                        className="
                                                            w-24
                                                            h-24

                                                            sm:w-28
                                                            sm:h-28

                                                            md:w-32
                                                            md:h-32

                                                            rounded-[24px]

                                                            object-cover
                                                        "
                                                    />

                                                    {/* PREORDER BADGE */}

                                                    {item.is_preorder && (

                                                        <div className="
                                                            absolute
                                                            top-2
                                                            left-2

                                                            h-6

                                                            px-2.5

                                                            rounded-full

                                                            bg-gradient-to-r
                                                            from-amber-500
                                                            to-orange-500

                                                            text-white

                                                            text-[9px]

                                                            font-black

                                                            flex
                                                            items-center

                                                            shadow-lg
                                                        ">

                                                            PO

                                                            {item.ready_after_days > 0 && (
                                                                <>
                                                                    {" "}H-
                                                                    {
                                                                        item.ready_after_days
                                                                    }
                                                                </>
                                                            )}

                                                        </div>

                                                    )}

                                                </div>

                                                {/* CONTENT */}

                                                <div className="
                                                    flex-1
                                                    min-w-0
                                                ">

                                                    {/* NAME */}

                                                    <h3 className="
                                                        text-sm
                                                        sm:text-base
                                                        md:text-2xl

                                                        font-black

                                                        text-slate-800

                                                        leading-tight

                                                        line-clamp-2
                                                    ">

                                                        {
                                                            item.product_name ||
                                                            item.name
                                                        }

                                                    </h3>
                                                    {/* PREORDER INFO */}

                                                    {item.is_preorder && (

                                                        <div className="
                                                            mt-3

                                                            space-y-2
                                                        ">

                                                            {/* BADGE */}

                                                            <div className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5

                                                                rounded-full

                                                                bg-amber-100

                                                                px-3
                                                                py-1.5

                                                                text-[10px]
                                                                md:text-xs

                                                                font-black

                                                                text-amber-700
                                                            ">

                                                                <Clock3
                                                                    size={12}
                                                                />

                                                                PREORDER

                                                                {item.ready_after_days > 0 && (
                                                                    <>
                                                                        {" "}H-
                                                                        {
                                                                            item.ready_after_days
                                                                        }
                                                                    </>
                                                                )}

                                                            </div>

                                                            {/* ESTIMATION */}

                                                            <div className="
                                                                rounded-2xl

                                                                border
                                                                border-orange-200

                                                                bg-orange-50

                                                                px-3
                                                                py-3

                                                                text-[11px]
                                                                sm:text-xs
                                                                md:text-sm

                                                                text-orange-700

                                                                leading-relaxed
                                                            ">

                                                                <div className="
                                                                    flex
                                                                    items-start

                                                                    gap-2
                                                                ">

                                                                    <AlertTriangle
                                                                        size={14}
                                                                        className="
                                                                            mt-0.5
                                                                            shrink-0
                                                                        "
                                                                    />

                                                                    <div>

                                                                        <p className="
                                                                            font-black
                                                                        ">

                                                                            Estimasi Ketersediaan

                                                                        </p>

                                                                        <p className="
                                                                            mt-1
                                                                        ">

                                                                            Produk tersedia sekitar
                                                                            {" "}

                                                                            <span className="
                                                                                font-black
                                                                            ">

                                                                                {
                                                                                    formatEstimatedDate(
                                                                                        item.ready_after_days
                                                                                    )
                                                                                }

                                                                            </span>

                                                                            {" "}(
                                                                            {
                                                                                item.ready_after_days || 0
                                                                            }
                                                                            {" "}hari dari order)

                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    )}

                                                    {/* PRICE */}

                                                    <div className="
                                                        mt-4

                                                        flex
                                                        items-center
                                                        justify-between

                                                        gap-3
                                                    ">

                                                        <div>

                                                            <div className="
                                                                text-lg
                                                                sm:text-xl
                                                                md:text-3xl

                                                                font-black

                                                                text-pink-600
                                                            ">

                                                                Rp {

                                                                    Number(
                                                                        item.price
                                                                    ).toLocaleString(
                                                                        "id-ID"
                                                                    )

                                                                }

                                                            </div>

                                                            <div className="
                                                                mt-1

                                                                text-[11px]
                                                                md:text-xs

                                                                text-slate-500
                                                            ">

                                                                per item

                                                            </div>

                                                        </div>

                                                        {/* REMOVE */}

                                                        <button

                                                            onClick={() =>
                                                                onRemove(
                                                                    item.product_id || item.id
                                                                )
                                                            }

                                                            className="
                                                                w-11
                                                                h-11

                                                                md:w-12
                                                                md:h-12

                                                                rounded-2xl

                                                                bg-red-50

                                                                text-red-500

                                                                flex
                                                                items-center
                                                                justify-center

                                                                hover:bg-red-100

                                                                active:scale-[0.96]

                                                                transition-all

                                                                shrink-0
                                                            "
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

                                                        </button>

                                                    </div>

                                                    {/* QUANTITY */}

                                                    <div className="
                                                        mt-4

                                                        flex
                                                        items-center
                                                        justify-between

                                                        gap-4

                                                        flex-wrap
                                                    ">

                                                        {/* QTY */}

                                                        <div className="
                                                            flex
                                                            items-center

                                                            gap-2
                                                            md:gap-3

                                                            bg-slate-100

                                                            rounded-full

                                                            px-2
                                                            md:px-3

                                                            h-11
                                                            md:h-14
                                                        ">

                                                            {/* MINUS */}

                                                            <button

                                                                onClick={() =>
                                                                    onUpdateQuantity(
                                                                        item.product_id || item.id,
                                                                        "minus"
                                                                    )
                                                                }

                                                                className="
                                                                    w-8
                                                                    h-8

                                                                    md:w-10
                                                                    md:h-10

                                                                    rounded-full

                                                                    bg-white

                                                                    flex
                                                                    items-center
                                                                    justify-center

                                                                    shadow-sm

                                                                    active:scale-[0.94]

                                                                    transition-all
                                                                "
                                                            >

                                                                <Minus
                                                                    size={15}
                                                                />

                                                            </button>

                                                            {/* QTY */}

                                                            <div className="
                                                                min-w-[28px]

                                                                text-center

                                                                font-black

                                                                text-sm
                                                                md:text-lg
                                                            ">

                                                                {
                                                                    item.quantity
                                                                }

                                                            </div>

                                                            {/* PLUS */}

                                                            <button

                                                                onClick={() =>
                                                                    onUpdateQuantity(
                                                                        item.product_id || item.id,
                                                                        "plus"
                                                                    )
                                                                }

                                                                className="
                                                                    w-8
                                                                    h-8

                                                                    md:w-10
                                                                    md:h-10

                                                                    rounded-full

                                                                    bg-pink-500

                                                                    text-white

                                                                    flex
                                                                    items-center
                                                                    justify-center

                                                                    active:scale-[0.94]

                                                                    transition-all
                                                                "
                                                            >

                                                                <Plus
                                                                    size={15}
                                                                />

                                                            </button>

                                                        </div>

                                                        {/* SUBTOTAL */}

                                                        <div className="
                                                            text-right
                                                        ">

                                                            <div className="
                                                                text-xs
                                                                md:text-sm

                                                                text-slate-500
                                                            ">

                                                                Subtotal

                                                            </div>

                                                            <div className="
                                                                text-base
                                                                md:text-xl

                                                                font-black

                                                                text-slate-900
                                                            ">

                                                                Rp {

                                                                    Number(
                                                                        item.price *
                                                                        item.quantity
                                                                    ).toLocaleString(
                                                                        "id-ID"
                                                                    )

                                                                }

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </motion.div>

                                    ))}

                                </div>
                                {/* CHECKOUT FORM */}

                                <div className="
                                    bg-white

                                    rounded-[30px]

                                    p-4
                                    sm:p-5
                                    md:p-7

                                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]

                                    space-y-5
                                    md:space-y-6
                                ">

                                    {/* TITLE */}

                                    <div className="
                                        flex
                                        items-center

                                        gap-3
                                    ">

                                        <div className="
                                            w-11
                                            h-11

                                            rounded-2xl

                                            bg-pink-100

                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <Receipt
                                                className="
                                                    text-pink-500
                                                "
                                            />

                                        </div>

                                        <div>

                                            <h2 className="
                                                text-xl
                                                md:text-3xl

                                                font-black

                                                text-slate-800
                                            ">

                                                Checkout

                                            </h2>

                                            <p className="
                                                text-xs
                                                md:text-sm

                                                text-slate-500

                                                mt-0.5
                                            ">

                                                Lengkapi data pesanan

                                            </p>

                                        </div>

                                    </div>

                                    {/* NAME */}

                                    <div>

                                        <label className="
                                            block

                                            mb-2
                                            md:mb-3

                                            font-semibold

                                            text-sm
                                            md:text-base

                                            text-slate-700
                                        ">

                                            Nama Customer

                                        </label>

                                        <Input

                                            value={
                                                customerName
                                            }

                                            onChange={(e) =>
                                                setCustomerName(
                                                    e.target.value
                                                )
                                            }

                                            placeholder="
Nama lengkap"

                                            className="
                                                h-12
                                                md:h-14

                                                rounded-2xl

                                                text-[16px]
                                                md:text-base
                                            "
                                        />

                                    </div>

                                    {/* PHONE */}

                                    <div>

                                        <label className="
                                            block

                                            mb-2
                                            md:mb-3

                                            font-semibold

                                            text-sm
                                            md:text-base

                                            text-slate-700
                                        ">

                                            Nomor WhatsApp

                                        </label>

                                        <Input

                                            value={phone}

                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                )
                                            }

                                            placeholder="
08xxxxxxxxxx"

                                            inputMode="numeric"

                                            className="
                                                h-12
                                                md:h-14

                                                rounded-2xl

                                                text-[16px]
                                                md:text-base
                                            "
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div>

                                        <label className="
                                            block

                                            mb-2
                                            md:mb-3

                                            font-semibold

                                            text-sm
                                            md:text-base

                                            text-slate-700
                                          
                                        ">
                                            Alamat Customer

                                        </label>

                                        <Textarea

                                            rows={3}

                                            value={address}

                                            onChange={(e) =>
                                                setAddress(
                                                    e.target.value
                                                )
                                            }

                                            placeholder="Alamat lengkap customer"

                                            className="
                                            rounded-2xl

                                            text-left
                                            placeholder:text-left

                                            px-4
                                            py-3

                                            text-[16px]
                                            md:text-base
                                        "
                                        />

                                    </div>

                                    {/* NOTES */}

                                    <div>

                                        <label className="
                                            block

                                            mb-2
                                            md:mb-3

                                            font-semibold

                                            text-sm
                                            md:text-base

                                            text-slate-700
                                        ">

                                            Catatan

                                        </label>

                                        <Textarea

                                            rows={4}

                                            value={notes}

                                            onChange={(e) =>
                                                setNotes(
                                                    e.target.value
                                                )
                                            }

                                            placeholder="Contoh: saya mau yang hanga (Order PO)"

                                            className="
    rounded-2xl

    text-left
    placeholder:text-left

    px-4
    py-3

    text-[16px]
    md:text-base
"
                                        />

                                    </div>

                                </div>

                                {/* PAYMENT */}

                                <div className="
                                    rounded-[30px]

                                    border
                                    border-slate-200

                                    bg-white

                                    p-7
                                    sm:p-5
                                    md:p-6

                                    shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                                ">

                                    <div className="
                                        flex
                                        items-center

                                        gap-3
                                    ">

                                        <div className="
                                            w-11
                                            h-11

                                            rounded-2xl

                                            bg-emerald-100

                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <ShieldCheck
                                                className="
                                                    text-emerald-600
                                                "
                                            />

                                        </div>

                                        <div>

                                            <h3 className="
                                                text-lg
                                                md:text-2xl

                                                font-black

                                                text-slate-900
                                            ">

                                                Metode Pembayaran

                                            </h3>

                                            <p className="
                                                text-xs
                                                md:text-sm

                                                text-slate-500

                                                mt-0.5
                                            ">

                                                Pilih metode pembayaran

                                            </p>

                                        </div>

                                    </div>

                                    <div className="
                                        mt-5

                                        space-y-3
                                    ">
                                        {/* CASH */}

                                        <label className={`
                                            flex
                                            items-start

                                            gap-4

                                            rounded-[24px]

                                            border

                                            p-4
                                            md:p-5

                                            cursor-pointer

                                            transition-all

                                            active:scale-[0.99]

                                            ${paymentMethod === "cash"

                                                ? "border-pink-500 bg-pink-50"

                                                : "border-slate-200 bg-white"
                                            }
                                        `}>

                                            <input

                                                type="radio"

                                                value="cash"

                                                checked={
                                                    paymentMethod ===
                                                    "cash"
                                                }

                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }

                                                className="
                                                    mt-1
                                                "
                                            />

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-2x1
                                                    md:text-3x1

                                                    font-black

                                                    text-slate-800
                                                ">

                                                    Cash di Booth / Toko

                                                </p>

                                                <p className="
                                                    mt-1

                                                    text-xs
                                                    md:text-sm

                                                    text-slate-500

                                                    leading-relaxed
                                                ">

                                                    Pembayaran dilakukan
                                                    saat pengambilan pesanan.

                                                </p>

                                            </div>

                                        </label>

                                        {/* TRANSFER */}

                                        <label className={`
                                            flex
                                            items-start

                                            gap-4

                                            rounded-[24px]

                                            border

                                            p-4
                                            md:p-5

                                            cursor-pointer

                                            transition-all

                                            active:scale-[0.99]

                                            ${paymentMethod === "transfer"

                                                ? "border-pink-500 bg-pink-50"

                                                : "border-slate-200 bg-white"
                                            }
                                        `}>

                                            <input

                                                type="radio"

                                                value="transfer"

                                                checked={
                                                    paymentMethod ===
                                                    "transfer"
                                                }

                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }

                                                className="
                                                    mt-1
                                                "
                                            />

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-sm
                                                    md:text-lg

                                                    font-black

                                                    text-slate-800
                                                ">

                                                    Transfer / QRIS

                                                </p>

                                                <p className="
                                                    mt-1

                                                    text-xs
                                                    md:text-sm

                                                    text-slate-500

                                                    leading-relaxed
                                                ">

                                                    QRIS belum tersedia, Transfer terlebih dahulu
                                                    sebelum pengambilan.


                                                </p>

                                            </div>

                                        </label>

                                    </div>

                                </div>

                                {/*Baris ini kebawah adalah Pindahan dari Sticky Bottom*/}

                                {/* BUTTON CHECKOUT */}

                                <div className="
                                    mt-5
                                ">

                                    <button

                                        type="button"

                                        onClick={() => {

                                            handleCheckout();

                                        }}

                                        className="
                                    mt-0.5

                                    w-[85%]
                                    mx-auto
                                    block

                                    h-16
                                    md:h-18

                                    rounded-[40px]
                                    md:rounded-428px]

                                    text-2xl
                                    md:text-3xl

                                    font-black

                                    bg-gradient-to-r
                                    from-pink-500
                                    to-rose-600

                                    hover:from-pink-600
                                    hover:to-rose-700

                                    text-white

                                    shadow-[0_15px_40px_rgba(255,0,100,0.22)]

                                    transition-all
                                    duration-300

                                    active:scale-[0.99]

                                    touch-manipulation
                                "
                                    >

                                        <div className="
                                                flex
                                                flex-col

                                                items-center 

                                                leading-tight
                                            ">
                                            {/* kalau item-start berarti tulisan di kiri */}
                                            <span>
                                                Pesan Sekarang
                                            </span>

                                            <span className="
                                                text-[17px]
                                                md:text-xs

                                                text-white/80

                                                font-medium
                                            ">

                                                Checkout via WhatsApp

                                            </span>

                                        </div>

                                    </button>

                                </div>

                                {/*Baris ini keatas adalah Pindahan dari Sticky Bottom*/}

                                {/* QRIS */}

                                {paymentMethod === "transfer" && (

                                    <motion.div

                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}

                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}

                                        className="
                                            rounded-[30px]

                                            bg-white

                                            border
                                            border-slate-200

                                            p-4
                                            sm:p-5
                                            md:p-6

                                            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                                        "
                                    >

                                        {/* HEADER */}

                                        <div className="
                                            flex
                                            items-center

                                            gap-3

                                            mb-5
                                        ">

                                            <div className="
                                                w-11
                                                h-11

                                                rounded-2xl

                                                bg-pink-100

                                                flex
                                                items-center
                                                justify-center
                                            ">

                                                <QrCode
                                                    className="
                                                        text-pink-500
                                                    "
                                                />

                                            </div>

                                            <div>

                                                <h3 className="
                                                    text-lg
                                                    md:text-2xl

                                                    font-black

                                                    text-slate-800
                                                ">

                                                    QRIS Payment

                                                </h3>

                                                <p className="
                                                    text-xs
                                                    md:text-sm

                                                    text-slate-500

                                                    mt-0.5
                                                ">

                                                    Scan QR berikut
                                                    untuk pembayaran

                                                </p>

                                            </div>

                                        </div>

                                        {/* QR */}

                                        {qrisImageUrl ? (

                                            <img

                                                src={
                                                    qrisImageUrl
                                                }

                                                alt="QRIS"

                                                className="
                                                    w-full

                                                    rounded-[28px]

                                                    border
                                                    border-slate-200

                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <div className="
                                                h-56
                                                md:h-72

                                                rounded-[28px]

                                                border-2
                                                border-dashed
                                                border-slate-300

                                                flex
                                                items-center
                                                justify-center

                                                text-center

                                                text-sm
                                                md:text-base

                                                text-slate-500

                                                px-6
                                            ">

                                                Admin belum
                                                mengupload QRIS

                                            </div>

                                        )}

                                    </motion.div>

                                )}

                                {/* SAFE SPACE */}

                                <div className="
                                    h-10
                                    md:h-12
                                " />

                            </>

                        )}

                    </div>


                    {/*tempat sticky dan tombol checkout sebelumnya*/}


                </div>

            </DrawerContent >

        </Drawer >

    );

}
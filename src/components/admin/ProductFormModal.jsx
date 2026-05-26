import React, {
    useState,
    useEffect,
} from "react";

import { api } from "@/lib/api";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Textarea,
} from "@/components/ui/textarea";

import {
    Switch,
} from "@/components/ui/switch";

import {
    Loader2,
    Package2,
    Sparkles,
    BadgePercent,
    Boxes,
    ShoppingBag,
    Clock3,
} from "lucide-react";

import {
    toast,
} from "sonner";

import ImageUploader from "@/components/ImageUploader";

import { resizeImage } from "@/utils/imageResize";

// ========================================
// CATEGORIES
// ========================================

const CATEGORIES = [
    {
        value: "pizza",
        label: "Pizza",
    },
    {
        value: "sweet_fluffy_bread",
        label: "Sweet Fluffy Bread",
    },
    {
        value: "naturally_bread",
        label: "Naturally Bread",
    },
    {
        value: "kitchen_snack",
        label: "Kitchen Snack",
    },
    {
        value: "fingery_snack",
        label: "Fingery Snack",
    },
    {
        value: "authentic_drink",
        label: "Authentic Drink",
    },
];

// ========================================
// DEFAULT FORM
// ========================================

const defaultForm = {
    name: "",
    category: "pizza",
    price: "",
    description: "",
    stock: "",
    discount_percentage: 0,

    // PRE ORDER

    is_preorder: false,

    ready_after_days: "",

    daily_capacity: "",

    // POS & PRINT

    sku: "",

    barcode: "",

    printer_category: "kitchen",

    allow_cashier_note: true,

    // IMAGE

    image_url: "",

    // FLAGS

    is_new: true,

    is_coming_soon: false,
};

// ========================================
// FORMAT PRICE
// ========================================

const formatPrice = (v) =>
    new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }
    ).format(v || 0);

// ========================================
// NORMALIZE CATEGORY
// ========================================

const normalizeCategory = (cat) => {

    if (cat === "pizzanezia")
        return "pizza";

    if (cat === "tasty_bready")
        return "sweet_fluffy_bread";

    if (cat === "legendary_snack")
        return "kitchen_snack";

    if (cat === "fresh_drink")
        return "authentic_drink";

    return cat;

};

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
            month: "long",
            year: "numeric",
        }
    );

};
export default function ProductFormModal({

    open,

    onClose,

    product,

    onSaved,

}) {

    // ========================================
    // STATES
    // ========================================

    const [
        form,
        setForm,
    ] = useState(defaultForm);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        existingProducts,
        setExistingProducts,
    ] = useState([]);

    // ========================================
    // INIT FORM
    // ========================================

    useEffect(() => {

        if (product) {

            setForm({

                ...defaultForm,

                ...product,

                price:
                    product.price || "",

                stock:
                    product.stock || "",

                discount_percentage:
                    product.discount_percentage || 0,

                ready_after_days:
                    product.ready_after_days || "",

                daily_capacity:
                    product.daily_capacity || "",

            });

        } else {

            setForm(defaultForm);

        }

    }, [product, open]);

    // ========================================
    // EXISTING PRODUCTS
    // ========================================

    useEffect(() => {

        if (!open) return;

        api.products.list()
            .then(data => setExistingProducts(data))
            .catch(() => setExistingProducts([]));

    }, [open]);

    // ========================================
    // CATEGORY PRODUCTS
    // ========================================

    const categoryProducts =
        existingProducts.filter(
            (p) =>

                normalizeCategory(
                    p.category
                ) === form.category

        );

    // ========================================
    // FINAL PRICE
    // ========================================

    const finalPrice =

        Number(form.price || 0) -

        (
            Number(form.price || 0) *

            Number(
                form.discount_percentage || 0
            )

        ) / 100;

    // ========================================
    // HANDLE SUBMIT
    // ========================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (saving) return;

            // ========================================
            // VALIDATION
            // ========================================

            if (!form.name?.trim()) {

                toast.error(
                    "Nama produk wajib diisi"
                );

                return;

            }

            if (
                !form.price ||

                Number(form.price) <= 0
            ) {

                toast.error(
                    "Harga produk tidak valid"
                );

                return;

            }

            if (!form.image_url) {

                toast.error(
                    "Upload gambar produk terlebih dahulu"
                );

                return;

            }

            // PREORDER VALIDATION

            if (
                form.is_preorder &&
                !form.ready_after_days
            ) {

                toast.error(
                    "Isi jumlah hari produksi"
                );

                return;

            }

            if (
                form.is_preorder &&
                !form.daily_capacity
            ) {

                toast.error(
                    "Isi kapasitas produksi harian"
                );

                return;

            }

            setSaving(true);

            try {

                // ========================================
                // PRODUCT DATA
                // ========================================

                const data = {

                    ...form,

                    id:
                        product?.id ||

                        Date.now().toString(),

                    name:
                        form.name.trim(),

                    price:
                        Number(form.price),

                    stock:
                        Number(form.stock || 0),

                    discount_percentage:
                        Number(
                            form.discount_percentage || 0
                        ),

                    ready_after_days:
                        Number(
                            form.ready_after_days || 0
                        ),

                    daily_capacity:
                        Number(
                            form.daily_capacity || 0
                        ),

                    created_date:

                        product?.created_date ||

                        new Date().toISOString(),

                    updated_date:
                        new Date().toISOString(),

                    sales_daily: 0,
                    sales_weekly: 0,
                    sales_monthly: 0,
                    sales_yearly: 0,

                };

                // ========================================
                // UPDATE LOCAL STATE & CALLBACK
                // ========================================

                if (product?.id) {

                    setExistingProducts(prev =>
                        prev.map(p => p.id === product.id ? data : p)
                    );

                    toast.success("Produk berhasil diperbarui");

                } else {

                    setExistingProducts(prev => [data, ...prev]);

                    toast.success("Produk berhasil ditambahkan");

                }

                // ========================================
                // CALLBACK (API save happens in parent)
                // ========================================

                onSaved?.(data);

                // ========================================
                // RESET
                // ========================================

                setForm(defaultForm);

                // ========================================
                // CLOSE
                // ========================================

                onClose?.();

            } catch (err) {

                console.log(err);

                if (
                    err?.name ===
                    "QuotaExceededError"
                ) {

                    toast.error(
                        "Storage penuh. Gambar terlalu besar."
                    );

                } else {

                    toast.error(
                        "Gagal menyimpan produk"
                    );

                }

            } finally {

                setSaving(false);

            }

        };
    // ========================================
    // UI
    // ========================================

    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent
                className="

                w-[95vw]
                sm:w-[92vw]
                lg:w-[90vw]

                max-w-[1600px]

                max-h-[100dvh]

                h-[100dvh]
                sm:h-[96vh]

                sm:max-h-[96vh]

                overflow-hidden

                rounded-[24px]
                sm:rounded-[32px]

                border
                border-white/20

                p-0

                bg-white/90
                backdrop-blur-2xl

                shadow-[0_20px_80px_rgba(0,0,0,0.18)]

            "
            >

                {/* MAIN SCROLL */}

                <div className="
                    h-full
                    overflow-y-auto
                    scrollbar-thin
                    scrollbar-thumb-pink-200
                    scrollbar-track-transparent
                    overscroll-contain
                    scroll-smooth
            ">

                    {/* HEADER */}

                    <div
                        className="

                        relative
                        overflow-hidden

                        bg-gradient-to-r
                        from-pink-500
                        via-rose-500
                        to-orange-400

                        text-white

                        px-4
                        sm:px-7
                        lg:px-8

                        py-4
                        sm:py-6

                    "
                    >

                        {/* GLOW */}

                        <div
                            className="
                            absolute
                            -top-20
                            -right-20
                            w-72
                            h-72
                            rounded-full
                            bg-white/20
                            blur-3xl
                        "
                        />

                        {/* CONTENT */}

                        <div
                            className="
                            relative
                            z-10

                            flex
                            items-center
                            gap-4
                        "
                        >

                            {/* ICON */}

                            <motion.div

                                whileHover={{
                                    rotate: 6,
                                    scale: 1.04,
                                }}

                                className="
                                w-12
                                h-12

                                sm:w-16
                                sm:h-16

                                rounded-[20px]

                                bg-white/20
                                backdrop-blur-xl

                                flex
                                items-center
                                justify-center

                                shadow-xl

                                shrink-0
                            "
                            >

                                <Package2
                                    size={30}
                                />

                            </motion.div>

                            {/* TEXT */}

                            <div className="
                            min-w-0
                        ">

                                <h2
                                    className="
                                    text-2xl
                                    sm:text-3xl
                                    font-black
                                    leading-tight
                                "
                                >

                                    {
                                        product
                                            ? "Edit Produk"
                                            : "Tambah Produk"
                                    }

                                </h2>

                                <p
                                    className="
                                    text-white/80
                                    text-sm
                                    sm:text-base
                                    mt-1
                                "
                                >

                                    VEZBERRY Product Management

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                        p-4
                        sm:p-6
                        lg:p-8
                    "
                    >

                        {/* MAIN GRID */}

                        <div
                            className="

                            grid

                            grid-cols-1

                            xl:grid-cols-[1.3fr_0.7fr]

                            gap-6
                            lg:gap-8

                            items-start

                        "
                        >

                            {/* LEFT */}

                            <div
                                className="
                            space-y-6

                            xl:sticky
                            xl:top-6
                            xl:self-start
                            "
                            >
                                {/* IMAGE */}

                                <div
                                    className="

        rounded-[24px]
        sm:rounded-[32px]

        border
        border-white/30

        bg-white/70
        backdrop-blur-xl

        p-4
        sm:p-6

        hover:shadow-xl
        transition-all
        duration-300

    "
                                >

                                    <ImageUploader
                                        label="Gambar Produk"
                                        value={form.image_url}

                                        onChange={async (
                                            fileOrUrl
                                        ) => {

                                            try {

                                                // EDIT MODE

                                                if (
                                                    typeof fileOrUrl === "string"
                                                ) {

                                                    setForm((f) => ({
                                                        ...f,
                                                        image_url:
                                                            fileOrUrl,
                                                    }));

                                                    return;

                                                }

                                                // RESIZE

                                                const resized =
                                                    await resizeImage(
                                                        fileOrUrl,
                                                        300,
                                                        300,
                                                        0.5
                                                    );

                                                // TO BASE64

                                                const reader =
                                                    new FileReader();

reader.onloadend = () => {

    const base64 =
        String(reader.result || '');

    setForm((f) => ({
        ...f,
        image_url: base64,
    }));

};

                                                reader.readAsDataURL(
                                                    resized
                                                );

                                            } catch (err) {

                                                console.log(err);

                                                toast.error(
                                                    "Gagal memproses gambar"
                                                );

                                            }

                                        }}

                                        aspectHint="
        Format: JPG, PNG, WEBP
        Auto resize & compress
        Rekomendasi: 800x800
        "
                                    />

                                </div>

                                {/* MAIN FORM */}

                                <div
                                    className="

        rounded-[24px]
        sm:rounded-[32px]

        border
        border-white/30

        bg-white/70
        backdrop-blur-xl

        p-4
        sm:p-6

        space-y-5
        sm:space-y-6

        hover:shadow-xl
        transition-all
        duration-300

    "
                                >

                                    {/* NAME */}

                                    <div>

                                        <Label>
                                            Nama Produk
                                        </Label>

                                        <Input

                                            required

                                            value={form.name}

                                            onChange={(e) =>

                                                setForm((f) => ({
                                                    ...f,
                                                    name:
                                                        e.target.value,
                                                }))

                                            }

                                            placeholder="
            Nama produk...
            "

                                            className="

                mt-2

                h-12
                sm:h-14

                rounded-2xl

                bg-white/80

                text-sm
                sm:text-base

                transition-all
                duration-300

                focus:ring-4
                focus:ring-pink-200
                focus:border-pink-400

                hover:border-pink-300

            "
                                        />

                                    </div>

                                    {/* CATEGORY */}

                                    <div>

                                        <Label>
                                            Kategori
                                        </Label>

                                        <Select

                                            value={
                                                form.category
                                            }

                                            onValueChange={(v) =>

                                                setForm((f) => ({
                                                    ...f,
                                                    category: v,
                                                }))

                                            }

                                        >

                                            <SelectTrigger
                                                className="

                    mt-2

                    h-12
                    sm:h-14

                    rounded-2xl

                    bg-white/80

                    text-sm
                    sm:text-base

                "
                                            >

                                                <SelectValue />

                                            </SelectTrigger>

                                            <SelectContent>

                                                {CATEGORIES.map((c) => (

                                                    <SelectItem
                                                        key={c.value}
                                                        value={c.value}
                                                    >

                                                        {c.label}

                                                    </SelectItem>

                                                ))}

                                            </SelectContent>

                                        </Select>

                                    </div>

                                    {/* PRICE + STOCK */}

                                    <div
                                        className="

            grid
            grid-cols-1

            sm:grid-cols-2

            gap-4
            sm:gap-5

        "
                                    >

                                        {/* PRICE */}

                                        <div>

                                            <Label>
                                                Harga
                                            </Label>

                                            <Input

                                                type="number"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                required

                                                value={
                                                    form.price
                                                }

                                                onChange={(e) =>

                                                    setForm((f) => ({
                                                        ...f,
                                                        price:
                                                            e.target.value,
                                                    }))

                                                }

                                                placeholder="0"

                                                className="

                    mt-2

                    h-12
                    sm:h-14

                    rounded-2xl

                    bg-white/80

                    text-sm
                    sm:text-base

                    transition-all
                    duration-300

                    focus:ring-4
                    focus:ring-pink-200

                "
                                            />

                                        </div>

                                        {/* STOCK */}

                                        <div>

                                            <Label>
                                                Stok
                                            </Label>

                                            <Input

                                                type="number"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={
                                                    form.stock
                                                }

                                                onChange={(e) =>

                                                    setForm((f) => ({
                                                        ...f,
                                                        stock:
                                                            e.target.value,
                                                    }))

                                                }

                                                placeholder="0"

                                                className="

                                                    mt-2

                                                    h-12
                                                    sm:h-14

                                                    rounded-2xl

                                                    bg-white/80

                                                    text-sm
                                                    sm:text-base

                                                    transition-all
                                                    duration-300

                                                    focus:ring-4
                                                    focus:ring-pink-200

                "
                                            />

                                        </div>

                                    </div>

                                    {/* DISCOUNT */}

                                    <div>

                                        <Label>
                                            Diskon (%)
                                        </Label>

                                        <Input

                                            type="number"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            min="0"

                                            max="100"

                                            value={
                                                form.discount_percentage
                                            }

                                            onChange={(e) =>

                                                setForm((f) => ({
                                                    ...f,
                                                    discount_percentage:
                                                        e.target.value,
                                                }))

                                            }

                                            className="

                                                mt-2

                                                h-12
                                                sm:h-14

                                                rounded-2xl

                                                bg-white/80

                                                text-sm
                                                sm:text-base

                                                transition-all
                                                duration-300

                                                focus:ring-4
                                                focus:ring-pink-200

                                            "
                                        />

                                    </div>

                                    {/* SWITCHES */}

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            sm:grid-cols-2
                                            gap-4
                                        "
                                    >

                                        {/* PREORDER */}

                                        <div
                                            className="

                                            rounded-2xl

                                            border
                                            border-slate-200

                                            bg-white/80

                                            p-4
                                            sm:p-5

                                        "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <div className="
                                                    min-w-0
                                                ">

                                                    <h3
                                                        className="
                                                            font-bold
                                                            text-sm
                                                            sm:text-base
                                                        "
                                                    >

                                                        Pre Order

                                                    </h3>

                                                    <p
                                                        className="
                                                            text-xs
                                                            sm:text-sm
                                                            text-slate-400
                                                            mt-1
                                                        "
                                                    >

                                                        Aktifkan PO

                                                    </p>

                                                </div>

                                                <Switch

                                                    checked={
                                                        form.is_preorder
                                                    }

                                                    onCheckedChange={(v) =>

                                                        setForm((f) => ({
                                                            ...f,
                                                            is_preorder: v,
                                                        }))

                                                    }

                                                />

                                            </div>

                                        </div>

                                        {/* COMING SOON */}

                                        <div
                                            className="

                rounded-2xl

                border
                border-slate-200

                bg-white/80

                p-4
                sm:p-5

            "
                                        >

                                            <div
                                                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
                                            >

                                                <div className="
                    min-w-0
                ">

                                                    <h3
                                                        className="
                            font-bold
                            text-sm
                            sm:text-base
                        "
                                                    >

                                                        Coming Soon

                                                    </h3>

                                                    <p
                                                        className="
                                                        text-xs
                                                        sm:text-sm
                                                        text-slate-400
                                                        mt-1
                                                    "
                                                    >

                                                        Sembunyikan checkout

                                                    </p>

                                                </div>

                                                <Switch

                                                    checked={
                                                        form.is_coming_soon
                                                    }

                                                    onCheckedChange={(v) =>

                                                        setForm((f) => ({
                                                            ...f,
                                                            is_coming_soon: v,
                                                        }))

                                                    }

                                                />

                                            </div>

                                        </div>

                                    </div>
                                    {/* PRE ORDER SETTINGS */}

                                    <AnimatePresence>

                                        {form.is_preorder && (

                                            <motion.div

                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                }}

                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}

                                                exit={{
                                                    opacity: 0,
                                                    y: -10,
                                                }}

                                                transition={{
                                                    duration: 0.25,
                                                }}

                                                className="
                                                        rounded-[24px]
                                                    border
                                                    border-orange-200
                                                    bg-orange-50/70
                                                    p-4
                                                    sm:p-5
                                                    space-y-5
                                                    "
                                            >

                                                {/* HEADER */}

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        w-11
                                                        h-11
                                                        rounded-2xl
                                                        bg-orange-100
                                                        text-orange-600
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    ">

                                                        <Clock3 size={20} />

                                                    </div>

                                                    <div>

                                                        <h3 className="
                                                            font-black
                                                            text-slate-900
                                                            text-sm
                                                            sm:text-base
                                                        ">

                                                            Pengaturan Pre Order

                                                        </h3>

                                                        <p className="
                                                            text-xs
                                                            sm:text-sm
                                                            text-slate-500
                                                            mt-1
                                                        ">

                                                            Sistem estimasi otomatis produksi

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* READY AFTER DAYS */}

                                                <div>

                                                    <Label
                                                        className="
                                                            leading-relaxed
                                                            text-sm
                                                            sm:text-base
                                                        "
                                                    >

                                                        Item ini siap setelah ... hari
                                                        (dihitung dari waktu dan tanggal order)

                                                    </Label>

                                                    <Input

                                                        type="number"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        min="0"

                                                        value={
                                                            form.ready_after_days || ""
                                                        }

                                                        onChange={(e) =>

                                                            setForm((f) => ({
                                                                ...f,
                                                                ready_after_days:
                                                                    e.target.value,
                                                            }))

                                                        }

                                                        placeholder="Contoh: 2"

                                                        className="

                                                            mt-2

                                                            h-12
                                                            sm:h-14

                                                            rounded-2xl

                                                            bg-white

                                                            text-sm
                                                            sm:text-base

                                                        "
                                                    />

                                                </div>

                                                {/* ESTIMATION */}

                                                <div>

                                                    <Label
                                                        className="
                                                            text-sm
                                                            sm:text-base
                                                        "
                                                    >

                                                        Item ini akan tersedia pada tanggal

                                                    </Label>

                                                    <div
                                                        className="

                                                        mt-2

                                                        min-h-[52px]
                                                        sm:min-h-[56px]

                                                        rounded-2xl

                                                        border
                                                        border-orange-200

                                                        bg-white

                                                        px-4

                                                        flex
                                                        items-center

                                                        text-sm
                                                        sm:text-base

                                                        font-semibold

                                                        text-slate-700

                                                    "
                                                    >

                                                        {
                                                            calculateEstimatedDate(
                                                                form.ready_after_days
                                                            )
                                                        }

                                                    </div>

                                                </div>

                                                {/* DAILY CAPACITY */}

                                                <div>

                                                    <Label
                                                        className="
                        text-sm
                        sm:text-base
                    "
                                                    >

                                                        Kapasitas pembuatan per hari

                                                    </Label>

                                                    <Input

                                                        type="number"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        min="1"

                                                        value={
                                                            form.daily_capacity || ""
                                                        }

                                                        onChange={(e) =>

                                                            setForm((f) => ({
                                                                ...f,
                                                                daily_capacity:
                                                                    e.target.value,
                                                            }))

                                                        }

                                                        placeholder="Contoh: 50"

                                                        className="

                        mt-2

                        h-12
                        sm:h-14

                        rounded-2xl

                        bg-white

                        text-sm
                        sm:text-base

                    "
                                                    />

                                                    <p className="
                    mt-2
                    text-xs
                    sm:text-sm
                    text-slate-500
                    leading-relaxed
                ">

                                                        Jika jumlah order pada tanggal yang sama
                                                        sudah mencapai kapasitas produksi +10%,
                                                        maka produk otomatis tidak dapat diorder.

                                                    </p>

                                                </div>

                                            </motion.div>

                                        )}

                                    </AnimatePresence>

                                    {/* DESCRIPTION */}

                                    <div>

                                        <Label>
                                            Deskripsi
                                        </Label>

                                        <Textarea

                                            rows={5}

                                            value={
                                                form.description
                                            }

                                            onChange={(e) =>

                                                setForm((f) => ({
                                                    ...f,
                                                    description:
                                                        e.target.value,
                                                }))

                                            }

                                            placeholder="
        Deskripsi produk...
        "

                                            className="

            mt-2

            rounded-2xl

            bg-white/80

            text-sm
            sm:text-base

            min-h-[120px]

            transition-all
            duration-300

            focus:ring-4
            focus:ring-pink-200

        "
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* RIGHT */}

                            <div
                                className="
        space-y-6
    "
                            >
                                {/* PREVIEW CARD */}

                                <motion.div

                                    whileHover={{
                                        y: -4,
                                    }}

                                    className="

        relative
        overflow-hidden

        rounded-[24px]
        sm:rounded-[32px]

        bg-gradient-to-br
        from-pink-500
        via-rose-500
        to-orange-400

        text-white

        p-4
        sm:p-6
        lg:p-7

        shadow-[0_20px_60px_rgba(255,80,120,0.25)]

    "
                                >

                                    {/* GLOW */}

                                    <div
                                        className="
            absolute
            -top-16
            -right-16
            w-56
            h-56
            rounded-full
            bg-white/20
            blur-3xl
        "
                                    />

                                    {/* CONTENT */}

                                    <div
                                        className="
            relative
            z-10
        "
                                    >

                                        {/* TITLE */}

                                        <div
                                            className="
                flex
                items-center
                gap-3
            "
                                        >

                                            <Sparkles
                                                size={18}
                                            />

                                            <p
                                                className="
                    font-bold
                    text-sm
                    sm:text-base
                "
                                            >

                                                Preview Produk

                                            </p>

                                        </div>

                                        {/* IMAGE */}

                                        <div
                                            className="

                mt-5

                rounded-[24px]

                overflow-hidden

                bg-white/10

                border
                border-white/10

                backdrop-blur-xl

            "
                                        >

                                            {form.image_url ? (

<motion.img
    loading="lazy"
    decoding="async"

    whileHover={{
        scale: 1.03,
    }}

    src={
        typeof form.image_url === 'string'
            ? form.image_url
            : ''
    }

    alt="preview"

    onError={(e) => {
        console.log(
            'IMAGE ERROR:',
            form.image_url
        );

        e.currentTarget.style.display =
            'none';
    }}

    className="
        w-full
        aspect-square
        object-cover
        transition-all
        duration-700
    "
/>

                                            ): (

                                                    <div
                                                    className = "

                        aspect-square

                                            flex
                                            flex-col
                                            items-center
                                            justify-center

                                            text-white/50

                                            "
                                                >

                                            <ShoppingBag
                                                size={36}
                                            />

                                            <p
                                                className="
                            mt-4
                            text-sm
                        "
                                            >

                                                No Image

                                            </p>

                                        </div>

                                            )}

                                    </div>

                                    {/* BADGES */}

                                    <div
                                        className="
                mt-4
                flex
                flex-wrap
                gap-2
            "
                                    >

                                        {form.is_new && (

                                            <div
                                                className="

                        h-8
                        sm:h-9

                        px-3
                        sm:px-4

                        rounded-full

                        bg-white/20
                        backdrop-blur-xl

                        text-white

                        text-[11px]
                        sm:text-xs

                        font-black

                        flex
                        items-center
                        gap-2

                    "
                                            >

                                                <Sparkles
                                                    size={13}
                                                />

                                                NEW

                                            </div>

                                        )}

                                        {form.is_preorder && (

                                            <div
                                                className="

                        h-8
                        sm:h-9

                        px-3
                        sm:px-4

                        rounded-full

                        bg-white/20
                        backdrop-blur-xl

                        text-white

                        text-[11px]
                        sm:text-xs

                        font-black

                        flex
                        items-center
                        gap-2

                    "
                                            >

                                                <Clock3
                                                    size={13}
                                                />

                                                PREORDER
                                                {Number(form.ready_after_days) > 0 && (
                                                    <>
                                                        {" "}H-
                                                        {form.ready_after_days}
                                                    </>
                                                )}
                                            </div>

                                        )}

                                        {form.discount_percentage > 0 && (

                                            <div
                                                className="

                        h-8
                        sm:h-9

                        px-3
                        sm:px-4

                        rounded-full

                        bg-white/20
                        backdrop-blur-xl

                        text-white

                        text-[11px]
                        sm:text-xs

                        font-black

                        flex
                        items-center
                        gap-2

                    "
                                            >

                                                <BadgePercent
                                                    size={13}
                                                />

                                                -
                                                {
                                                    form.discount_percentage
                                                }%

                                            </div>

                                        )}

                                    </div>

                                    {/* NAME */}

                                    <h2
                                        className="

                text-2xl
                sm:text-3xl

                font-black

                mt-5

                leading-tight

                break-words

            "
                                    >

                                        {
                                            form.name ||
                                            "Nama Produk"
                                        }

                                    </h2>

                                    {/* CATEGORY */}

                                    <p
                                        className="

                text-white/75

                mt-2

                text-sm
                sm:text-base

            "
                                    >

                                        {
                                            CATEGORIES.find(
                                                (c) =>
                                                    c.value ===
                                                    form.category
                                            )?.label
                                        }

                                    </p>

                                    {/* PRICE */}

                                    <div
                                        className="
                mt-6
                space-y-4
            "
                                    >

                                        {/* ORIGINAL */}

                                        <div
                                            className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
                                        >

                                            <div
                                                className="
                        flex
                        items-center
                        gap-2
                    "
                                            >

                                                <BadgePercent
                                                    size={17}
                                                />

                                                <span
                                                    className="
                            text-sm
                            sm:text-base
                        "
                                                >

                                                    Harga

                                                </span>

                                            </div>

                                            <span
                                                className="
                        font-bold
                        text-sm
                        sm:text-base
                        text-right
                    "
                                            >

                                                {
                                                    formatPrice(
                                                        form.price
                                                    )
                                                }

                                            </span>

                                        </div>

                                        {/* FINAL */}

                                        <div
                                            className="

                    rounded-2xl

                    bg-white/10

                    border
                    border-white/10

                    backdrop-blur-xl

                    p-4
                    sm:p-5

                "
                                        >

                                            <p
                                                className="
                        text-white/70
                        text-xs
                        sm:text-sm
                    "
                                            >

                                                Harga Setelah Diskon

                                            </p>

                                            <h3
                                                className="

                        text-2xl
                        sm:text-3xl
                        lg:text-4xl

                        font-black

                        mt-2

                        break-words

                    "
                                            >

                                                {
                                                    formatPrice(
                                                        finalPrice
                                                    )
                                                }

                                            </h3>

                                        </div>

                                        {/* STOCK */}

                                        <div
                                            className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
                                        >

                                            <div
                                                className="
                        flex
                        items-center
                        gap-2
                    "
                                            >

                                                <Boxes
                                                    size={17}
                                                />

                                                <span
                                                    className="
                            text-sm
                            sm:text-base
                        "
                                                >

                                                    Stok

                                                </span>

                                            </div>

                                            <span
                                                className="
                                                        font-bold
                                                        text-sm
                                                        sm:text-base
                                                    "
                                            >

                                                {form.stock || 0}

                                                {Number(form.stock || 0) <= 5 && (

                                                    <span className="
                                                            ml-2
                                                            text-yellow-200
                                                            font-black
                                                        ">
                                                        LOW
                                                    </span>

                                                )}

                                            </span>

                                        </div>

                                    </div>

                            </div>

                        </motion.div>
                        {/* EXISTING PRODUCTS */}

                        <div
                            className="

        rounded-[24px]
        sm:rounded-[32px]

        border
        border-white/30

        bg-white/80
        backdrop-blur-xl

        p-4
        sm:p-6

        shadow-lg

    "
                        >

                            {/* HEADER */}

                            <div
                                className="
            flex
            items-start
            justify-between
            gap-4
            mb-5
        "
                            >

                                <div className="
            min-w-0
        ">

                                    <h3
                                        className="
                    text-lg
                    sm:text-xl
                    font-black
                    text-slate-900
                "
                                    >

                                        Produk Dalam Kategori

                                    </h3>

                                    <p
                                        className="
                    text-slate-500
                    text-xs
                    sm:text-sm
                    mt-1
                "
                                    >

                                        {
                                            CATEGORIES.find(
                                                (c) =>
                                                    c.value ===
                                                    form.category
                                            )?.label
                                        }

                                    </p>

                                </div>

                                <div
                                    className="

                h-10
                sm:h-11

                px-4

                rounded-full

                bg-pink-100

                text-pink-600

                text-sm

                font-black

                flex
                items-center
                justify-center

                shrink-0

            "
                                >

                                    {
                                        categoryProducts.length
                                    } Produk

                                </div>

                            </div>

                            {/* EMPTY */}

                            {categoryProducts.length === 0 && (

                                <div
                                    className="

                rounded-2xl

                border
                border-dashed
                border-slate-200

                p-6
                sm:p-8

                text-center

                text-[16px]
                sm:text-base

                text-slate-400

            "
                                >

                                    Belum ada produk di kategori ini.

                                </div>

                            )}

                            {/* LIST */}

                            <div
                                className="

            space-y-3

            max-h-[300px]
            sm:max-h-[420px]

            overflow-y-auto

            pr-1

        "
                            >

                                {categoryProducts.map((item) => (

                                    <motion.div

                                        key={item.id}

                                        whileHover={{
                                            scale: 1.01,
                                        }}

                                        className="

                    flex
                    gap-3
                    sm:gap-4

                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    p-3

                    hover:shadow-md

                    transition-all
                    duration-300

                "
                                    >

                                        {/* IMAGE */}

                                        <div
                                            className="

                        w-16
                        h-16

                        sm:w-20
                        sm:h-20

                        rounded-2xl

                        overflow-hidden

                        bg-slate-100

                        shrink-0

                    "
                                        >

                                            <img
                                                loading="lazy"

                                                src={
                                                    item.image_url ||

                                                    "https://via.placeholder.com/150"
                                                }

                                                alt=""

                                                className="
                            w-full
                            h-full
                            object-cover
                        "
                                            />

                                        </div>

                                        {/* INFO */}

                                        <div
                                            className="
                        flex-1
                        min-w-0
                    "
                                        >

                                            {/* TOP */}

                                            <div
                                                className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                                            >

                                                <div className="
                            min-w-0
                        ">

                                                    <h4
                                                        className="
                                    font-black
                                    text-slate-900
                                    text-sm
                                    sm:text-base
                                    truncate
                                "
                                                    >

                                                        {item.name}

                                                    </h4>

                                                    <p
                                                        className="
                                    text-xs
                                    sm:text-sm
                                    text-slate-500
                                    mt-1
                                "
                                                    >

                                                        {
                                                            formatPrice(
                                                                item.price
                                                            )
                                                        }

                                                    </p>

                                                </div>

                                                {item.is_new && (

                                                    <div
                                                        className="

                                    h-7
                                    sm:h-8

                                    px-3

                                    rounded-full

                                    bg-pink-100

                                    text-pink-600

                                    text-[10px]
                                    sm:text-xs

                                    font-black

                                    flex
                                    items-center
                                    justify-center

                                    shrink-0

                                "
                                                    >

                                                        NEW

                                                    </div>

                                                )}

                                            </div>

                                            {/* FOOTER */}

                                            <div
                                                className="

                            mt-3
                            sm:mt-4

                            flex
                            items-center
                            justify-between

                            gap-3

                            text-xs
                            sm:text-sm

                        "
                                            >

                                                <span
                                                    className="
                                text-slate-500
                            "
                                                >

                                                    Stock:
                                                    {" "}
                                                    {item.stock || 0}

                                                </span>

                                                <span
                                                    className="
                                text-slate-400
                                text-right
                            "
                                                >

                                                    {
                                                        item.created_date

                                                            ? new Date(
                                                                item.created_date
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )

                                                            : "-"
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    </motion.div>

                                ))}

                            </div>

                        </div>

                        {/* ACTIONS */}

                        <div
                            className="

        sticky
        bottom-0

        pb-[max(env(safe-area-inset-bottom),16px)]

        bg-white/80
        backdrop-blur-xl

        border-t
        border-slate-200

        mt-6

        pt-4

    "
                        >

                            <div
                                className="
            flex
            flex-col-reverse
            sm:flex-row
            gap-3
        "
                            >

                                {/* CANCEL */}

                                <Button

                                    type="button"

                                    variant="outline"

                                    onClick={onClose}

                                    className="

                flex-1

                h-12
                sm:h-14

                rounded-2xl

                border-slate-200

                bg-white/80

                hover:bg-slate-100

                font-bold

                text-sm
                sm:text-base

            "
                                >

                                    Batal

                                </Button>

                                {/* SAVE */}

                                <Button

                                    type="submit"

                                    disabled={saving}

                                    className="

                shimmer-btn

                flex-1

                h-12
                sm:h-14

                rounded-2xl

                bg-gradient-to-r
                from-pink-500
                via-rose-500
                to-pink-600

                hover:scale-[0.98]

                active:scale-[0.98]

                shadow-[0_15px_35px_rgba(255,80,120,0.35)]

                hover:shadow-[0_20px_45px_rgba(255,80,120,0.45)]

                transition-all
                duration-300

                font-black

                text-sm
                sm:text-base

            "
                                >

                                    {saving && (

                                        <Loader2
                                            className="
                        w-4
                        h-4
                        animate-spin
                        mr-2
                    "
                                        />

                                    )}

                                    {
                                        product
                                            ? "Simpan Produk"
                                            : "Tambah Produk"
                                    }

                                </Button>

                            </div>

                        </div>

                </div>

            </div>

        </form>

                </div >

            </DialogContent >

        </Dialog >

    );

}
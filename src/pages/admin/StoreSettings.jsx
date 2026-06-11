import React, {
    useEffect,
    useState,
} from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import {
    Button
} from "@/components/ui/button";

import {
    Input
} from "@/components/ui/input";

import {
    Label
} from "@/components/ui/label";

import {
    Textarea
} from "@/components/ui/textarea";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Switch
} from "@/components/ui/switch";

import {

    Store,

    Save,

    Loader2,

    Clock,

    Image as ImageIcon,

    QrCode,

    Plus,

    X,

    Sparkles,

    Mail,

    Images,

    LayoutDashboard,

    Wand2,

    MonitorSmartphone,

} from "lucide-react";

import {
    toast
} from "sonner";

import ImageUploader from "@/components/ImageUploader";
import { api } from "@/lib/api";

// ========================================
// FIELD
// ========================================

function Field({
    label,
    children
}) {

    return (

        <div>

            <Label className="
                text-sm
                font-semibold
                text-slate-700
                mb-2
                block
            ">

                {label}

            </Label>

            {children}

        </div>

    );

}

// ========================================
// DEFAULT
// ========================================

const defaultForm = {

    store_name:
        "VezBerry",

    tagline:
        "Unforgettable Taste",

    logo_url:
        "",

    store_photo_url:
        "",

    address:
        "Rawa Lumbu, Bekasi",

    whatsapp:
        "6282120012025",

    whatsapp_link:
        "https://wa.me/6282120012025",

    instagram:
        "@vezberry",

    instagram_link:
        "https://instagram.com/vezberry",

    email:
        "",

    banner_images:
        [],

    default_category:
        "sweet_fluffy_bread",

    operational_hours: [

        {
            day: "Senin",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Selasa",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Rabu",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Kamis",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Jumat",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Sabtu",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

        {
            day: "Ahad",
            is_open: true,
            open: "08:00",
            close: "21:00",
        },

    ],

    is_open:
        true,

    qris_image_url:
        "",
    maintenance_mode: false,

    maintenance_message:
        "Website sedang diperbarui. Silakan kembali beberapa saat lagi.",
};

// ========================================
// COMPONENT
// ========================================

export default function StoreSettingsPage() {

    const [form,
        setForm] =
        useState(defaultForm);

    const [saving,
        setSaving] =
        useState(false);

    const [newBannerUrl,
        setNewBannerUrl] =
        useState("");

    // ========================================
    // LOAD SETTINGS
    // ========================================

    useEffect(() => {

        api.settings.get()
            .then(stored => {

                if (stored && Object.keys(stored).length > 0) {

                    setForm({
                        ...defaultForm,
                        ...stored,
                    });

                }

            })
            .catch(err => console.error("Gagal load settings:", err));

    }, []);

    // ========================================
    // SET FIELD
    // ========================================

    const set = (
        field,
        value
    ) => {

        setForm(f => ({

            ...f,

            [field]: value,

        }));

    };

    // ========================================
    // UPDATE DAY
    // ========================================

    const updateOperationalDay = (
        index,
        field,
        value
    ) => {

        const updated = [
            ...(form.operational_hours || [])
        ];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        set(
            "operational_hours",
            updated
        );

    };

    // ========================================
    // BANNER
    // ========================================

    const addBanner = (
        url
    ) => {

        // VALIDATION

        if (
            !url ||
            !url.trim()
        ) {

            toast.error(
                "URL banner wajib diisi"
            );

            return;

        }

        // CLEAN URL

        const cleanUrl =
            url.trim();

        // LIMIT BASE64 SIZE

        if (
            cleanUrl.startsWith("data:image") &&
            cleanUrl.length > 500000
        ) {

            toast.error(
                "Ukuran gambar terlalu besar"
            );

            return;

        }

        // DUPLICATE CHECK

        const alreadyExists =

            (form.banner_images || [])
                .includes(cleanUrl);

        if (alreadyExists) {

            toast.error(
                "Banner sudah ada"
            );

            return;

        }

        // UPDATED ARRAY - append to existing

        const updatedBanners = [
            ...(form.banner_images || []),
            cleanUrl,
        ];

        // UPDATE FORM

        const updatedForm = {

            ...form,

            banner_images:
                updatedBanners,

        };

        // UPDATE STATE

        setForm(updatedForm);

        // AUTO SAVE KE SERVER

        api.settings.save(updatedForm)
            .catch(err => console.error("Gagal simpan banner:", err));

        // RESET INPUT

        setNewBannerUrl("");

        toast.success(
            "Banner berhasil ditambahkan 🎉"
        );

    };

    const removeBanner = (
        idx
    ) => {

        set(

            "banner_images",

            form.banner_images.filter(
                (_, i) => i !== idx
            )

        );

    };

    // ========================================
    // SAVE
    // ========================================

    const handleSave = async () => {

        console.log("SAVE CLICKED");

        try {

            setSaving(true);

            console.log(form);

            await api.settings.save(form);

            window.dispatchEvent(
                new Event(
                    "vezberry-settings-updated"
                )
            );

            console.log("SAVE SUCCESS");

            toast.success(
                "Pengaturan toko berhasil disimpan 🎉"
            );

            setTimeout(() => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth",

                });

            }, 300);

            window.dispatchEvent(
                new Event("vezberry-settings-updated")
            );

        } catch (err) {

            console.error(err);

            toast.error(
                "Gagal menyimpan pengaturan"
            );

        } finally {

            setSaving(false);

        }

    };

    // ========================================
    // UI
    // ========================================

    return (

        <AdminLayout>

            <div className="
                space-y-8
                max-w-6xl
                pb-24
            ">

                {/* HERO */}

                <div className="
                    relative

                    overflow-hidden

                    rounded-[32px]
                    md:rounded-[42px]

                    bg-gradient-to-r
                    from-[#31d0c6]
                    via-[#5b8def]
                    to-[#8b5cf6]

                    p-6
                    sm:p-8
                    md:p-12

                    text-white

                    shadow-[0_20px_80px_rgba(80,120,255,0.25)]
                ">

                    <div className="
                        absolute
                        top-0
                        right-0

                        w-72
                        h-72

                        rounded-full

                        bg-white/10

                        blur-3xl
                    " />

                    <div className="
                        absolute
                        bottom-0
                        left-0

                        w-72
                        h-72

                        rounded-full

                        bg-cyan-300/10

                        blur-3xl
                    " />

                    <div className="
                        relative
                        z-10
                    ">

                        <div className="
                            inline-flex
                            items-center

                            gap-2

                            rounded-full

                            bg-white/15

                            backdrop-blur-xl

                            px-4
                            py-2

                            text-xs
                            sm:text-sm

                            font-black
                        ">

                            <LayoutDashboard
                                size={16}
                            />

                            STORE MANAGEMENT

                        </div>

                        <h1 className="
                            mt-5

                            text-4xl
                            sm:text-5xl
                            md:text-7xl

                            font-black

                            tracking-tight
                        ">

                            Store Settings

                        </h1>

                        <p className="
                            mt-4

                            max-w-3xl

                            text-sm
                            sm:text-lg
                            md:text-2xl

                            text-white/85

                            leading-relaxed
                        ">

                            Kelola branding,
                            homepage banner,
                            slideshow promosi,
                            identitas toko,
                            kontak,
                            operasional,
                            dan pembayaran QRIS.

                        </p>

                    </div>

                </div>
                {/* STORE INFO */}

                <Card className="
                    rounded-[32px]
                    border-0
                    shadow-xl
                ">

                    <CardHeader>

                        <CardTitle className="
                            flex
                            items-center
                            gap-3
                            text-2xl
                            font-black
                        ">

                            <Store
                                className="
                                    text-pink-500
                                "
                            />

                            Informasi Toko

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="
                        grid
                        md:grid-cols-2
                        gap-6
                    ">

                        <Field
                            label="Nama Toko"
                        >

                            <Input

                                value={
                                    form.store_name || ""
                                }

                                onChange={(e) =>

                                    set(
                                        "store_name",
                                        e.target.value
                                    )

                                }

                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <Field label="Kategori Awal Homepage">

                            <select
                                value={form.default_category}
                                onChange={(e) =>
                                    set(
                                        "default_category",
                                        e.target.value
                                    )
                                }
                                className="
            h-14
            rounded-2xl
            border
            px-4
            w-full
        "
                            >

                                <option value="pizza">
                                    Pizza
                                </option>

                                <option value="sweet_fluffy_bread">
                                    Fluffy Bread
                                </option>

                                <option value="naturally_bread">
                                    Natural Bread
                                </option>

                                <option value="kitchen_snack">
                                    Kitchen Snack
                                </option>

                                <option value="fingery_snack">
                                    Fingery Snack
                                </option>

                                <option value="authentic_drink">
                                    Authentic Drink
                                </option>

                            </select>

                        </Field>

                        <Field
                            label="Tagline"
                        >

                            <Input
                                value={
                                    form.tagline
                                }
                                onChange={(e) =>
                                    set(
                                        "tagline",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <div className="
                            md:col-span-2
                        ">

                            <Field
                                label="Alamat"
                            >

                                <Textarea
                                    rows={4}
                                    value={
                                        form.address
                                    }
                                    onChange={(e) =>
                                        set(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    className="
                                        rounded-2xl
                                    "
                                />

                            </Field>

                        </div>

                        <Field
                            label="WhatsApp"
                        >

                            <Input

                                type="tel"

                                placeholder="6281234567890"

                                value={
                                    form.whatsapp || ""
                                }

                                onChange={(e) =>

                                    set(
                                        "whatsapp",

                                        e.target.value
                                            .replace(/\D/g, "")
                                    )

                                }

                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <Field
                            label="Link WhatsApp"
                        >

                            <Input
                                value={
                                    form.whatsapp_link
                                }
                                onChange={(e) =>
                                    set(
                                        "whatsapp_link",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <Field
                            label="Instagram"
                        >

                            <Input
                                value={
                                    form.instagram
                                }
                                onChange={(e) =>
                                    set(
                                        "instagram",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <Field
                            label="Link Instagram"
                        >

                            <Input
                                value={
                                    form.instagram_link
                                }
                                onChange={(e) =>
                                    set(
                                        "instagram_link",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-14
                                    rounded-2xl
                                "
                            />

                        </Field>

                        <Field
                            label="Email"
                        >

                            <div className="
                                relative
                            ">

                                <Mail
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                    size={18}
                                />

                                <Input
                                    className="
                                        pl-11
                                        h-14
                                        rounded-2xl
                                    "
                                    value={
                                        form.email
                                    }
                                    onChange={(e) =>
                                        set(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </Field>

                    </CardContent>

                </Card>

                {/* LOGO */}

                <Card className="
                    rounded-[32px]
                    border-0
                    shadow-xl
                ">

                    <CardHeader>

                        <CardTitle className="
                            flex
                            items-center
                            gap-3
                            text-2xl
                            font-black
                        ">

                            <ImageIcon
                                className="
                                    text-pink-500
                                "
                            />

                            Logo & Foto Toko

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="
                        grid
                        md:grid-cols-2
                        gap-8
                    ">

                        <div>

                            <Label className="
                                mb-3
                                block
                                font-bold
                            ">
                                Logo Toko
                            </Label>

                            <ImageUploader
                                value={
                                    form.logo_url
                                }
                                onChange={(url) =>
                                    set(
                                        "logo_url",
                                        url
                                    )
                                }
                            />

                        </div>

                        <div>

                            <Label className="
                                mb-3
                                block
                                font-bold
                            ">
                                Foto Toko
                            </Label>

                            <ImageUploader
                                value={
                                    form.store_photo_url
                                }
                                onChange={(url) =>
                                    set(
                                        "store_photo_url",
                                        url
                                    )
                                }
                            />

                        </div>

                    </CardContent>

                </Card>
                {/* HOMEPAGE BANNER */}

                <Card className="
                    rounded-[32px]
                    border-0
                    shadow-xl

                    overflow-hidden
                ">

                    <CardHeader className="
                        bg-gradient-to-r
                        from-pink-50
                        via-rose-50
                        to-orange-50

                        border-b
                    ">

                        <CardTitle className="
                            flex
                            items-center
                            gap-3

                            text-2xl
                            font-black
                        ">

                            <Images
                                className="
                                    text-pink-500
                                "
                            />

                            Homepage Banner Slideshow

                        </CardTitle>

                        <p className="
                            text-slate-500
                            mt-2
                            leading-relaxed
                        ">

                            Banner ini akan tampil
                            pada HeroSlider homepage user/customer.

                        </p>

                    </CardHeader>

                    <CardContent className="
                        p-6
                        md:p-8

                        space-y-8
                    ">

                        {/* ADD BANNER */}

                        <div className="
                            rounded-[28px]

                            border
                            border-dashed
                            border-pink-200

                            bg-pink-50/50

                            p-5
                            md:p-7
                        ">

                            <div className="
                                flex
                                items-center

                                gap-3

                                mb-5
                            ">

                                <div className="
                                    w-12
                                    h-12

                                    rounded-2xl

                                    bg-pink-500

                                    text-white

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Plus
                                        size={24}
                                    />

                                </div>

                                <div>

                                    <h3 className="
                                        text-xl

                                        font-black

                                        text-slate-800
                                    ">

                                        Tambah Banner Baru

                                    </h3>

                                    <p className="
                                        text-slate-500
                                        mt-1
                                    ">

                                        Tambahkan slideshow promosi homepage

                                    </p>

                                </div>

                            </div>

                            <div className="
                                flex
                                flex-col
                                lg:flex-row

                                gap-4
                            ">

                                <div className="
    flex-1
">

                                    <ImageUploader

                                        value={newBannerUrl}

                                        onChange={(url) => {

                                            setNewBannerUrl(url);

                                        }}

                                    />

                                </div>

                                <Button

                                    type="button"

                                    disabled={!newBannerUrl}

                                    onClick={() => {

                                        addBanner(
                                            newBannerUrl
                                        );

                                    }}

                                    className="
                                h-14

                                px-8

                                rounded-2xl

                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500

                                hover:from-pink-600
                                hover:to-rose-600

                                font-black

                                shadow-lg
                                "
                                >

                                    <Plus
                                        className="
                                            w-5
                                            h-5
                                            mr-2
                                        "
                                    />

                                    Tambah Banner

                                </Button>

                            </div>

                        </div>

                        {/* EMPTY */}

                        {(form.banner_images || []).length === 0 && (

                            <div className="
                                rounded-[32px]

                                bg-slate-50

                                border
                                border-slate-100

                                p-10
                                md:p-14

                                text-center
                            ">

                                <div className="
                                    w-24
                                    h-24

                                    rounded-full

                                    bg-pink-100

                                    mx-auto

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Images
                                        className="
                                            text-pink-500
                                        "
                                        size={42}
                                    />

                                </div>

                                <h3 className="
                                    mt-7

                                    text-3xl

                                    font-black

                                    text-slate-800
                                ">

                                    Banner belum tersedia

                                </h3>

                                <p className="
                                    mt-3

                                    text-slate-500

                                    leading-relaxed

                                    max-w-xl

                                    mx-auto
                                ">

                                    Tambahkan banner promosi
                                    untuk membuat homepage
                                    lebih menarik dan premium.

                                </p>

                            </div>

                        )}

                        {/* BANNER GRID */}

                        <div className="
                            grid

                            sm:grid-cols-2
                            xl:grid-cols-3

                            gap-6
                        ">

                            {(form.banner_images || [])
                                .map((img, idx) => (

                                    <div
                                        key={idx}
                                        className="
                                            group

                                            relative

                                            overflow-hidden

                                            rounded-[30px]

                                            bg-white

                                            border

                                            shadow-lg

                                            hover:shadow-2xl

                                            transition-all
                                            duration-500
                                        "
                                    >

                                        {/* IMAGE */}

                                        <div className="
                                            relative
                                            overflow-hidden
                                        ">

                                            <img

                                                src={img}

                                                alt={`Banner ${idx + 1}`}

                                                className="
                                                    w-full
                                                    h-[240px]

                                                    object-cover

                                                    transition-transform
                                                    duration-700

                                                    group-hover:scale-105
                                                "
                                            />

                                            {/* OVERLAY */}

                                            <div className="
                                                absolute
                                                inset-0

                                                bg-gradient-to-t
                                                from-black/60
                                                via-black/0
                                                to-black/0
                                            " />

                                            {/* BADGE */}

                                            <div className="
                                                absolute
                                                left-4
                                                top-4

                                                h-10

                                                px-4

                                                rounded-full

                                                bg-white/15

                                                backdrop-blur-xl

                                                flex
                                                items-center

                                                text-sm

                                                font-black

                                                text-white
                                            ">

                                                Banner
                                                {" "}
                                                {idx + 1}

                                            </div>

                                            {/* DELETE */}

                                            <button

                                                onClick={() =>
                                                    removeBanner(idx)
                                                }

                                                className="
                                                    absolute
                                                    top-4
                                                    right-4

                                                    w-11
                                                    h-11

                                                    rounded-full

                                                    bg-red-500

                                                    text-white

                                                    flex
                                                    items-center
                                                    justify-center

                                                    shadow-lg

                                                    hover:scale-110

                                                    transition-all
                                                "
                                            >

                                                <X
                                                    size={18}
                                                />

                                            </button>

                                        </div>

                                        {/* FOOTER */}

                                        <div className="
                                            p-5
                                        ">

                                            <p className="
                                                text-xs

                                                font-bold

                                                text-slate-400

                                                uppercase

                                                tracking-wide
                                            ">

                                                Homepage Slider

                                            </p>

                                            <p className="
    mt-2

    text-sm

    text-slate-500

    leading-relaxed

    truncate
">

                                                Banner image saved

                                            </p>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    </CardContent>

                </Card>
                {/* OPERATIONAL */}

                <Card className="
                    rounded-[32px]
                    border-0
                    shadow-xl
                ">

                    <CardHeader>

                        <CardTitle className="
                            flex
                            items-center
                            gap-3
                            text-2xl
                            font-black
                        ">

                            <Clock
                                className="
                                    text-pink-500
                                "
                            />

                            Jam Operasional

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="
                        space-y-5
                    ">

                        {(form.operational_hours || []).map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={item.day}
                                    className="
                                        rounded-[30px]

                                        border
                                        border-slate-100

                                        p-5
                                        md:p-6

                                        bg-slate-50
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-col
                                        xl:flex-row

                                        xl:items-center
                                        xl:justify-between

                                        gap-6
                                    ">

                                        {/* DAY */}

                                        <div>

                                            <h3 className="
                                                text-2xl
                                                md:text-3xl

                                                font-black

                                                text-slate-800
                                            ">

                                                {item.day}

                                            </h3>

                                            <p className="
                                                text-slate-400
                                                mt-2
                                            ">

                                                Pengaturan operasional harian toko

                                            </p>

                                        </div>

                                        {/* FORM */}

                                        <div className="
                                            flex
                                            flex-wrap

                                            items-center

                                            gap-4
                                        ">

                                            {/* STATUS */}

                                            <div className="
                                                flex
                                                items-center

                                                gap-3

                                                px-5

                                                h-14

                                                rounded-2xl

                                                bg-white

                                                border

                                                shadow-sm
                                            ">

                                                <Switch
                                                    checked={
                                                        item.is_open
                                                    }
                                                    onCheckedChange={(v) =>
                                                        updateOperationalDay(
                                                            index,
                                                            "is_open",
                                                            v
                                                        )
                                                    }
                                                />

                                                <span className="
                                                    font-black

                                                    text-slate-700
                                                ">

                                                    {item.is_open
                                                        ? "Buka"
                                                        : "Libur"}

                                                </span>

                                            </div>

                                            {/* OPEN */}

                                            <div className="
                                                flex
                                                items-center

                                                gap-3

                                                px-5

                                                h-14

                                                rounded-2xl

                                                bg-white

                                                border

                                                shadow-sm
                                            ">

                                                <span className="
                                                    text-sm

                                                    text-slate-400

                                                    font-bold
                                                ">

                                                    Buka

                                                </span>

                                                <Input
                                                    type="time"
                                                    value={
                                                        item.open
                                                    }
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value
                                                                .slice(0, 5);

                                                        updateOperationalDay(
                                                            index,
                                                            "open",
                                                            value
                                                        );

                                                    }}
                                                    className="
                                                        border-0
                                                        shadow-none

                                                        h-auto

                                                        p-0

                                                        font-black
                                                    "
                                                />

                                            </div>

                                            {/* CLOSE */}

                                            <div className="
                                                flex
                                                items-center

                                                gap-3

                                                px-5

                                                h-14

                                                rounded-2xl

                                                bg-white

                                                border

                                                shadow-sm
                                            ">

                                                <span className="
                                                    text-sm

                                                    text-slate-400

                                                    font-bold
                                                ">

                                                    Tutup

                                                </span>

                                                <Input
                                                    type="time"
                                                    value={
                                                        item.close
                                                    }
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value
                                                                .slice(0, 5);

                                                        updateOperationalDay(
                                                            index,
                                                            "close",
                                                            value
                                                        );

                                                    }}
                                                    className="
                                                        border-0
                                                        shadow-none

                                                        h-auto

                                                        p-0

                                                        font-black
                                                    "
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </CardContent>

                </Card>


                {/* MAINTENANCE MODE */}

                <Card className="
    rounded-[32px]
    border-0
    shadow-xl
">

                    <CardHeader>

                        <CardTitle className="
            flex
            items-center
            gap-3
            text-2xl
            font-black
        ">
                            🛠️ Maintenance Mode
                        </CardTitle>

                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div className="
            flex
            items-center
            justify-between
        ">

                            <div>

                                <div className="font-bold">
                                    Aktifkan Maintenance
                                </div>

                                <div className="
                    text-sm
                    text-slate-500
                ">
                                    Customer akan melihat halaman Under Construction
                                </div>

                            </div>

                            <Switch
                                checked={form.maintenance_mode}
                                onCheckedChange={(value) =>
                                    set("maintenance_mode", value)
                                }
                            />

                        </div>

                        <div>

                            <Label>
                                Pesan Maintenance
                            </Label>

                            <Textarea
                                rows={4}
                                value={form.maintenance_message}
                                onChange={(e) =>
                                    set(
                                        "maintenance_message",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </CardContent>

                </Card>

                {/* QRIS */}

                <Card className="
                    rounded-[32px]
                    border-0
                    shadow-xl
                ">

                    <CardHeader>

                        <CardTitle className="
                            flex
                            items-center
                            gap-3

                            text-2xl

                            font-black
                        ">

                            <QrCode
                                className="
                                    text-pink-500
                                "
                            />

                            QRIS Pembayaran

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="
                        space-y-6
                    ">

                        <div className="
                            rounded-[30px]

                            border
                            border-dashed
                            border-pink-200

                            bg-pink-50/40

                            p-6
                        ">

                            <h3 className="
                                text-xl

                                font-black

                                text-slate-800
                            ">

                                Upload QRIS

                            </h3>

                            <p className="
                                mt-2

                                text-slate-500

                                leading-relaxed
                            ">

                                QRIS ini akan tampil
                                otomatis saat customer checkout.

                            </p>

                            <div className="
                                mt-6
                            ">

                                <ImageUploader
                                    value={
                                        form.qris_image_url
                                    }
                                    onChange={(url) =>
                                        set(
                                            "qris_image_url",
                                            url
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Maintenance Mode
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="flex items-center justify-between">

                            <div>

                                <div className="font-bold">
                                    Aktifkan Maintenance
                                </div>

                                <div className="text-sm text-slate-500">
                                    Customer akan melihat halaman Under Construction
                                </div>

                            </div>

                            <Switch
                                checked={form.maintenance_mode}
                                onCheckedChange={(value) =>
                                    set("maintenance_mode", value)
                                }
                            />

                        </div>

                        <Textarea
                            className="mt-4"
                            rows={4}
                            value={form.maintenance_message}
                            onChange={(e) =>
                                set(
                                    "maintenance_message",
                                    e.target.value
                                )
                            }
                        />

                    </CardContent>

                </Card>

                {/* SAVE */}

                <div className="
                    sticky
                    bottom-6

                    z-30

                    flex
                    justify-end
                ">

                    <Button

                        onClick={handleSave}

                        disabled={saving}

                        style={{
                            opacity: saving ? 0.8 : 1
                        }}

                        className="
                            h-16

                            px-10

                            rounded-[26px]

                            bg-gradient-to-r
                            from-pink-500
                            to-rose-500

                            hover:from-pink-600
                            hover:to-rose-600

                            shadow-[0_20px_50px_rgba(255,0,120,0.25)]

                            text-lg

                            font-black
                        "
                    >

                        {saving ? (

                            <Loader2
                                className="
                                    w-5
                                    h-5
                                    mr-3

                                    animate-spin
                                "
                            />

                        ) : (

                            <Save
                                className="
                                    w-5
                                    h-5
                                    mr-3
                                "
                            />

                        )}

                        Simpan Pengaturan

                    </Button>

                </div>

            </div>

        </AdminLayout >

    );

}
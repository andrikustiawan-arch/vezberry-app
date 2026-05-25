import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { api } from "@/lib/api";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import AdminLayout from "@/components/admin/AdminLayout";

import ProductFormModal from "@/components/admin/ProductFormModal";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {

    Plus,
    Search,
    Package,
    Pencil,
    Trash2,
    Star,
    Clock3,
    Sparkles,
    Eye,

} from "lucide-react";



// ========================================
// FORMAT PRICE
// ========================================

const formatPrice = (price) =>

    new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }
    ).format(price || 0);


// ========================================
// PAGE
// ========================================

export default function Products() {

    // ========================================
    // STATES
    // ========================================

    const [
        products,
        setProducts,
    ] = useState([]);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        selectedProduct,
        setSelectedProduct,
    ] = useState(null);

    const [
        openModal,
        setOpenModal,
    ] = useState(false);

    // ========================================
    // LOAD PRODUCTS
    // ========================================

    useEffect(() => {

        api.products.list()
            .then(data => setProducts(data))
            .catch(err => console.error("Gagal load produk:", err));

    }, []);

    // ========================================
    // SAVE PRODUCT
    // ========================================

    const handleSaveProduct = async (
        productData
    ) => {

        try {

            if (selectedProduct) {

                // EDIT
                const updated = await api.products.update(
                    selectedProduct.id,
                    productData
                );

                setProducts(prev =>
                    prev.map(p =>
                        p.id === selectedProduct.id
                            ? updated
                            : p
                    )
                );

            } else {

                // ADD
                const created = await api.products.create(productData);

                setProducts(prev => [created, ...prev]);

            }

        } catch (err) {

            console.error("Gagal simpan produk:", err);

        }

        setOpenModal(false);

        setSelectedProduct(null);

    };

    // ========================================
    // DELETE PRODUCT
    // ========================================

    const handleDelete = async (
        productId
    ) => {

        const confirmDelete =
            window.confirm(
                "Hapus produk ini?"
            );

        if (!confirmDelete) return;

        try {

            await api.products.delete(productId);

            setProducts(prev =>
                prev.filter(p => p.id !== productId)
            );

        } catch (err) {

            console.error("Gagal hapus produk:", err);

        }

    };

    // ========================================
    // FILTERED PRODUCTS
    // ========================================

    const filteredProducts =
        useMemo(() => {

            return products.filter(
                product =>

                    product.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||

                    product.category
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

        }, [products, search]);

    // ========================================
    // UI
    // ========================================

    return (

        <AdminLayout>

            <div className="
                relative
                space-y-5
                sm:space-y-6
                md:space-y-8

pb-[140px]
md:pb-24
            ">

                {/* FLOATING GLOW */}

                <div className="
                    fixed
                    -top-32
                    -right-32
                    w-[450px]
                    h-[450px]
                    rounded-full
                    bg-pink-500/10
                    blur-3xl
                    pointer-events-none
                " />

                <div className="
                    fixed
                    -bottom-32
                    -left-32
                    w-[450px]
                    h-[450px]
                    rounded-full
                    bg-violet-500/10
                    blur-3xl
                    pointer-events-none
                " />

                {/* HERO */}

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
                        relative
                        overflow-hidden
                        rounded-[28px]
                        md:rounded-[40px]                        
                        bg-gradient-to-r
                        from-indigo-500
                        via-purple-500
                        to-pink-400

                        shadow-[0_20px_60px_rgba(140,90,255,0.25)]

                        border
                        border-white/10
                        p-5
                        sm:p-6
                        md:p-10  
                        text-white
                        shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                    "
                >

                    <div className="
                        absolute
                        top-0
                        right-0
                        w-72
                        h-56
                        sm:h-64
                        md:h-72         
                        rounded-full
                        bg-pink-500/20
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
                            h-11
                            sm:h-12
                            px-5
                            rounded-full
                            bg-white/10
                            border
                            border-white/10
                            backdrop-blur-xl
                            text-white
                            font-bold
                        ">

                            <Sparkles
                                size={18}
                            />

                            VEZBERRY PRODUCTS

                        </div>

                        <h1 className="
                            mt-8
                            text-3xl
                            sm:text-5xl
                            md:text-7xl  
                            font-black
                            leading-tight
                        ">

                            Products

                        </h1>

                        <p className="
                            mt-6
                            max-w-2xl
                            text-sm
                            sm:text-lg
                            md:text-2xl                          
                            text-white/80
                            leading-relaxed
                        ">

                            Kelola seluruh produk,
                            harga,
                            stok,
                            dan banner toko
                            Anda secara modern.

                        </p>

                    </div>

                </motion.div>

                {/* TOP BAR */}

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-4
                    justify-between
                ">

                    {/* SEARCH */}

                    <div className="
                        relative
                        w-full
                        md:max-w-md
                    ">

                        <Search
                            className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                w-5
                                h-5
                            "
                        />

                        <Input

                            value={search}

                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            placeholder="
                            Cari produk..."

                            className="
                                h-11
                                sm:h-12
                                sm:h-14
                                pl-14
                                rounded-2xl
                                border-white/30
                                bg-white/80
                                backdrop-blur-xl
                                shadow-lg
                            "
                        />

                    </div>

                    {/* ADD BUTTON */}

                    <Button

                        onClick={() => {

                            setSelectedProduct(null);

                            setOpenModal(true);

                        }}

                        className="
                            h-11
                            sm:h-12
                            sm:h-14

                            px-5
                            sm:px-8
                            rounded-2xl
                            bg-gradient-to-r
                            from-pink-500
                            to-rose-500
                            hover:scale-105
                            shadow-[0_15px_35px_rgba(255,80,120,0.35)]
                            text-sm
                            sm:text-base
                            font-black
                        "
                    >

                        <Plus
                            className="
                                w-5
                                h-5
                                mr-2
                            "
                        />

                        Tambah Produk

                    </Button>

                </div>

                {/* PRODUCTS GRID */}

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    2xl:grid-cols-3
                    gap-6
                ">

                    <AnimatePresence>

                        {filteredProducts.map(
                            product => (

                                <motion.div

                                    key={
                                        product.id
                                    }

                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}

                                    exit={{
                                        opacity: 0,
                                    }}

                                    whileHover={{
                                        y: -8,
                                    }}
                                >

                                    <Card className="
                                        overflow-hidden
                                        rounded-[28px]
                                        md:rounded-[36px]
                                        border-white/30
                                        bg-white/80
                                        backdrop-blur-2xl
                                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                                    ">

                                        {/* IMAGE */}

                                        <div className="
                                            relative
                                            h-56
                                            sm:h-64
                                            md:h-72
                                            overflow-hidden
                                        ">

                                            <img

                                                src={
                                                    product.image_url
                                                }

                                                alt={
                                                    product.name
                                                }
                                                loading="lazy"
                                                decoding="async"
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                    transition-all
                                                    duration-700
                                                    hover:scale-110
                                                "
                                            />

                                            {/* BADGES */}

                                            <div className="
                                                absolute
                                                top-4
                                                left-4
                                                flex
                                                gap-2
                                                flex-wrap
                                            ">

                                                {product.is_new && (

                                                    <div className="
                                                        h-9
                                                        px-4
                                                        rounded-full
                                                        bg-gradient-to-r
                                                        from-pink-500
                                                        to-rose-500
                                                        text-white
                                                        text-xs
                                                        font-black
                                                        flex
                                                        items-center
                                                        gap-1
                                                    ">

                                                        <Sparkles
                                                            size={14}
                                                        />

                                                        NEW

                                                    </div>

                                                )}

                                                {product.is_preorder && (

                                                    <div className="
                                                        h-9
                                                        px-4
                                                        rounded-full
                                                        bg-gradient-to-r
                                                        from-amber-500
                                                        to-orange-500
                                                        text-white
                                                        text-xs
                                                        font-black
                                                        flex
                                                        items-center
                                                        gap-1
                                                    ">

                                                        <Clock3
                                                            size={14}
                                                        />

                                                        PREORDER
                                                        {product.ready_after_days > 0 && (
                                                            <>
                                                                {" "}H-
                                                                {product.ready_after_days}
                                                            </>
                                                        )}
                                                    </div>

                                                )}

                                                {product.discount_percentage > 0 && (

                                                    <div className="
                                                        h-9
                                                        px-4
                                                        rounded-full
                                                        bg-gradient-to-r
                                                        from-red-500
                                                        to-orange-500
                                                        text-white
                                                        text-xs
                                                        font-black
                                                    ">

                                                        -
                                                        {
                                                            product.discount_percentage
                                                        }%

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                        {/* CONTENT */}

                                        <CardContent className="
                                            p-6
                                        ">

                                            {/* CATEGORY */}

                                            <div className="
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                font-bold
                                                text-pink-500
                                            ">

                                                {
                                                    product.category
                                                }

                                            </div>

                                            {/* NAME */}

                                            <h2 className="
                                                mt-3
                                                text-2xl
                                                font-black
                                                text-slate-800
                                                line-clamp-2
                                            ">

                                                {
                                                    product.name
                                                }

                                            </h2>

                                            {/* DESCRIPTION */}

                                            <p className="
                                                mt-3
                                                text-slate-500
                                                line-clamp-3
                                            ">

                                                {
                                                    product.description
                                                }

                                            </p>

                                            {/* PRICE */}

                                            <div className="
                                                mt-6
                                                text-3xl
                                                font-black
                                                text-pink-600
                                            ">

                                                {
                                                    formatPrice(
                                                        product.price
                                                    )
                                                }

                                            </div>

                                            {/* STOCK */}

                                            <div className="
                                                mt-3
                                                inline-flex
                                                items-center
                                                gap-2
                                                h-10
                                                px-4
                                                rounded-full
                                                bg-slate-100
                                                text-slate-700
                                                text-sm
                                                font-bold
                                            ">

                                                <Package
                                                    size={14}
                                                />

                                                Stock:
                                                {
                                                    product.stock || 0
                                                }

                                                {product.stock <= 5 && (
                                                    <span className="
                                                    text-red-500
                                                    font-black
                                                ">
                                                        • LOW
                                                    </span>
                                                )}

                                            </div>

                                            {/* ACTIONS */}

                                            <div className="
                                                mt-6
                                                flex
                                                flex
                                                gap-2
                                                sm:gap-3
                                            ">

                                                <Button

                                                    onClick={() => {

                                                        setSelectedProduct(product);

                                                        setOpenModal(true);

                                                    }}

                                                    className="
                                                        flex-1
                                                        h-12
                                                        rounded-2xl
                                                        bg-gradient-to-r
                                                        bg-gradient-to-r
                                                        from-indigo-500
                                                        via-purple-500
                                                        to-pink-400
                                                        shadow-[0_20px_60px_rgba(140,90,255,0.25)]
                                                        border
                                                        border-white/10
                                                    "
                                                >

                                                    <Pencil
                                                        className="
                                                            w-4
                                                            h-4
                                                            mr-2
                                                        "
                                                    />

                                                    Edit

                                                </Button>

                                                <Button

                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id
                                                        )
                                                    }

                                                    className="
                                                        h-12
                                                        w-12
                                                        rounded-2xl
                                                        bg-red-500
                                                        hover:bg-red-600
                                                    "
                                                >

                                                    <Trash2
                                                        className="
                                                            w-5
                                                            h-5
                                                        "
                                                    />

                                                </Button>

                                            </div>

                                        </CardContent>

                                    </Card>

                                </motion.div>

                            )
                        )}

                    </AnimatePresence>

                </div>

                {/* EMPTY */}

                {filteredProducts.length === 0 && (

                    <div className="
                    py-16
                    sm:py-24
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

                            <Eye
                                className="
                                    text-pink-500
                                "
                                size={40}
                            />

                        </div>

                        <h2 className="
                            mt-6
                            text-3xl
                            font-black
                            text-slate-800
                        ">

                            Produk tidak ditemukan

                        </h2>

                    </div>

                )}

                {/* MODAL */}

                <ProductFormModal
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedProduct(null);
                    }}
                    onSaved={handleSaveProduct}   // ✅ FIX
                    product={selectedProduct}     // ✅ FIX
                />

            </div>

        </AdminLayout>

    );

}

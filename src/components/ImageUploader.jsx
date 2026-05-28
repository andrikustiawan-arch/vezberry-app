import React, {
    useState,
    useEffect,
    useRef,
} from "react";

import {
    Upload,
    AlertTriangle,
    CheckCircle,
    X,
    ImageIcon,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;

// =========================
// COMPRESS IMAGE
// =========================

function compressImage(
    file,
    maxSizePx = 1600
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = (e) => {

                const img =
                    new Image();

                img.onload = () => {

                    const {
                        naturalWidth: w,
                        naturalHeight: h,
                    } = img;

                    let targetW = w;
                    let targetH = h;

                    // resize
                    if (
                        w > maxSizePx ||
                        h > maxSizePx
                    ) {

                        if (w > h) {

                            targetW =
                                maxSizePx;

                            targetH =
                                Math.round(
                                    (h / w) *
                                    maxSizePx
                                );

                        } else {

                            targetH =
                                maxSizePx;

                            targetW =
                                Math.round(
                                    (w / h) *
                                    maxSizePx
                                );

                        }

                    }

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    canvas.width =
                        targetW;

                    canvas.height =
                        targetH;

                    const ctx =
                        canvas.getContext("2d");

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        targetW,
                        targetH
                    );

                    canvas.toBlob(

                        (blob) => {

                            if (!blob) {

                                reject(
                                    new Error(
                                        "Compress failed"
                                    )
                                );

                                return;

                            }

                            const compressed =
                                new File(
                                    [blob],
                                    file.name.replace(
                                        /\.\w+$/,
                                        ".jpg"
                                    ),
                                    {
                                        type:
                                            "image/jpeg",
                                    }
                                );

                            resolve({
                                file: compressed,
                                width: w,
                                height: h,
                                targetW,
                                targetH,
                            });

                        },

                        "image/jpeg",
                        0.85

                    );

                };

                img.onerror = reject;

                img.src = e.target.result;

            };

            reader.onerror = reject;

            reader.readAsDataURL(file);

        }
    );

}

// =========================
// COMPONENT
// =========================

export default function ImageUploader({

    value,

    onChange,

    label = "Gambar",

    aspectHint = "",

}) {

    const [uploading,
        setUploading] =
        useState(false);

    const [preview,
        setPreview] =
        useState(value || "");

    useEffect(() => {
        setPreview(value || "");
    }, [value]);

    const [warning,
        setWarning] =
        useState("");

    const [info,
        setInfo] =
        useState("");

    const [dragging,
        setDragging] =
        useState(false);

    const inputRef =
        useRef();

    // =========================
    // HANDLE FILE
    // =========================

    const processFile =
        async (file) => {

            if (!file) return;

            setUploading(true);

            setWarning("");

            setInfo("");

            try {

                // preview instant

                const {
                    file: compressed,
                    width,
                    height,
                    targetW,
                    targetH,
                } =
                    await compressImage(file);

                // warning
                if (
                    width < MIN_WIDTH ||
                    height < MIN_HEIGHT
                ) {

                    setWarning(
                        `Resolusi ${width}×${height}px terlalu kecil. Minimum disarankan ${MIN_WIDTH}×${MIN_HEIGHT}px`
                    );

                }

                // info
                const reduction =
                    Math.round(
                        (
                            1 -
                            (
                                compressed.size /
                                file.size
                            )
                        ) * 100
                    );

                setInfo(
                    `${width}×${height}px → ${targetW}×${targetH}px • ukuran berkurang ${reduction}%`
                );

                // =========================
                // UPLOAD KE SERVER
                // =========================

                const response =
                    await api.upload(
                        compressed
                    );

                const url =
                    response?.url ||
                    response?.imageUrl ||
                    "";

                setPreview(url);

                onChange(url);

                toast.success(
                    "Gambar berhasil diupload"
                );

            } catch (err) {

                console.log(err);

                toast.error(
                    "Gagal memproses gambar"
                );

                setPreview(value || "");

            } finally {

                setUploading(false);

                if (inputRef.current) {

                    inputRef.current.value =
                        "";

                }

            }

        };

    // =========================
    // INPUT CHANGE
    // =========================

    const handleFile =
        async (e) => {

            const file =
                e.target.files[0];

            processFile(file);

        };

    // =========================
    // CLEAR
    // =========================

    const clear = () => {

        setPreview("");

        setWarning("");

        setInfo("");

        onChange("");

    };

    // =========================
    // DRAG DROP
    // =========================

    const handleDrop =
        async (e) => {

            e.preventDefault();

            setDragging(false);

            const file =
                e.dataTransfer.files[0];

            processFile(file);

        };

    return (

        <div className="space-y-3">

            {/* LABEL */}

            {label && (

                <div>

                    <p className="
                        text-sm
                        font-bold
                        text-slate-700
                    ">
                        {label}
                    </p>

                    {aspectHint && (

                        <p className="
                            text-xs
                            text-slate-400
                            mt-1
                        ">
                            {aspectHint}
                        </p>

                    )}

                </div>

            )}

            {/* DROPZONE */}

            <div

                onDrop={handleDrop}

                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}

                onDragLeave={() =>
                    setDragging(false)
                }

                className={`
                    relative
                    rounded-[28px]
                    border-2
                    border-dashed
                    transition-all
                    overflow-hidden

                    ${dragging
                        ? `
                                border-pink-400
                                bg-pink-50
                              `
                        : `
                                border-slate-200
                                bg-white
                              `
                    }
                `}
            >

                <label className="
                    block
                    cursor-pointer
                ">

                    <div className="
                        px-6
                        py-12
                        text-center
                    ">

                        {uploading ? (

                            <div className="
                                flex
                                flex-col
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-full
                                    border-4
                                    border-pink-200
                                    border-t-pink-500
                                    animate-spin
                                " />

                                <div>

                                    <p className="
                                        font-bold
                                        text-pink-600
                                    ">
                                        Mengkompres gambar...
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-400
                                        mt-1
                                    ">
                                        Mohon tunggu sebentar
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="
                                flex
                                flex-col
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-20
                                    h-20
                                    rounded-[24px]
                                    bg-gradient-to-br
                                    from-pink-500
                                    to-rose-500
                                    flex
                                    items-center
                                    justify-center
                                    shadow-xl
                                ">

                                    <Upload
                                        className="
                                            text-white
                                        "
                                        size={36}
                                    />

                                </div>

                                <div>

                                    <p className="
                                        text-lg
                                        font-bold
                                        text-slate-700
                                    ">
                                        Upload Gambar
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-400
                                        mt-2
                                    ">
                                        Klik atau drag gambar ke sini
                                    </p>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mt-1
                                    ">
                                        JPG • PNG • WEBP
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFile}
                    />

                </label>

            </div>

            {/* WARNING */}

            {warning && (

                <div className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    px-4
                    py-3
                ">

                    <AlertTriangle
                        className="
                            text-amber-500
                            flex-shrink-0
                            mt-0.5
                        "
                        size={18}
                    />

                    <p className="
                        text-sm
                        text-amber-700
                    ">
                        {warning}
                    </p>

                </div>

            )}

            {/* INFO */}

            {info && !warning && (

                <div className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                ">

                    <CheckCircle
                        className="
                            text-emerald-500
                            flex-shrink-0
                            mt-0.5
                        "
                        size={18}
                    />

                    <p className="
                        text-sm
                        text-emerald-700
                    ">
                        {info}
                    </p>

                </div>

            )}

            {/* PREVIEW */}

            {preview && (

                <div className="
                    relative
                    rounded-[28px]
                    overflow-hidden
                    border
                    border-slate-200
                    bg-slate-50
                ">

                    <img
                        src={preview}
                        alt="Preview"
                        className="
                            w-full
                            max-h-[900px]
                            object-contain
                        "
                    />

                    {/* DELETE */}

                    <button

                        onClick={clear}

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
                            shadow-xl
                            hover:bg-red-600
                            transition-all
                        "
                    >

                        <X size={20} />

                    </button>

                    {/* BADGE */}

                    <div className="
                        absolute
                        left-4
                        bottom-4
                        px-4
                        py-2
                        rounded-full
                        bg-black/50
                        backdrop-blur-xl
                        text-white
                        text-xs
                        font-bold
                        flex
                        items-center
                        gap-2
                    ">

                        <ImageIcon size={14} />

                        Preview Gambar

                    </div>

                </div>

            )}

        </div>

    );

}
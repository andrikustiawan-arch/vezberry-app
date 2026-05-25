import React, {
    useRef,
    useState,
} from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Download,
    Printer,
    MessageSquare,
    Mail,
    ReceiptText,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";

import { toast } from "sonner";

const formatPrice = (p) =>
    new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }
    ).format(p);

export default function InvoiceModal({

    open,

    onClose,

    order,

    type = "invoice",

}) {

    const printRef =
        useRef();

    const [sending,
        setSending] =
        useState(false);

    if (!order) return null;

    const isPaid =
        order.status === "paid" ||
        order.status === "completed";

    const docTitle =
        type === "invoice"
            ? "INVOICE"
            : "STRUK PEMBAYARAN";

    const docNumber =
        `VZB-${order.id
            ?.slice(0, 8)
            ?.toUpperCase()}`;

    // =========================
    // PRINT
    // =========================

    const handlePrint = () => {

        const content =
            printRef.current.innerHTML;

        const w =
            window.open(
                "",
                "_blank"
            );

        w.document.write(`

<html>

<head>

<title>${docTitle}</title>

<style>

body{
font-family:Arial,sans-serif;
background:#fff;
padding:30px;
}

table{
width:100%;
border-collapse:collapse;
}

td,th{
padding:12px;
}

th{
background:#f8fafc;
text-align:left;
}

.total{
font-size:24px;
font-weight:900;
color:#e11d48;
}

.stamp{
display:inline-block;
padding:12px 30px;
border:4px solid ${isPaid
                ? "#16a34a"
                : "#f59e0b"
            };
color:${isPaid
                ? "#16a34a"
                : "#f59e0b"
            };
font-size:34px;
font-weight:900;
transform:rotate(-12deg);
border-radius:14px;
margin-top:20px;
opacity:0.8;
}

</style>

</head>

<body>

${content}

</body>

</html>

        `);

        w.document.close();

        w.print();

    };

    // =========================
    // PDF
    // =========================

    const handleDownloadPDF =
        () => {

            toast.info(
                "Membuka mode print untuk simpan PDF"
            );

            handlePrint();

        };

    // =========================
    // WHATSAPP
    // =========================

    const handleSendWhatsApp =
        () => {

            if (
                !order.customer_phone
            ) {

                toast.error(
                    "Nomor WhatsApp tidak tersedia"
                );

                return;

            }

            const msg =
                encodeURIComponent(

                    `*${docTitle} VEZBERRY*

No:
${docNumber}

Nama:
${order.customer_name}

Total:
${formatPrice(order.total_amount)}

Status:
${isPaid ? "LUNAS" : "IN-ORDER"}

Terima kasih telah berbelanja di VEZBERRY.`

                );

            window.open(

                `https://wa.me/${order.customer_phone.replace(/^0/, "62")}?text=${msg}`,

                "_blank"

            );

        };

    // =========================
    // EMAIL
    // =========================

    const handleSendEmail =
        async () => {

            if (
                !order.customer_email
            ) {

                toast.error(
                    "Email pelanggan tidak tersedia"
                );

                return;

            }

            setSending(true);

            const subject =
                `${docTitle} ${docNumber}`;

            const body =

                `
Halo ${order.customer_name},

Berikut invoice pesanan Anda di VEZBERRY.

Total:
${formatPrice(order.total_amount)}

Status:
${isPaid ? 'LUNAS' : 'IN-ORDER'}

Terima kasih telah berbelanja.
                `;

            window.location.href =
                `mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setSending(false);

        };

    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent className="
                sm:max-w-4xl
                max-h-[92vh]
                overflow-y-auto
                rounded-[32px]
                border-0
                p-0
                bg-white
            ">

                {/* HEADER */}

                <div className="
                    bg-gradient-to-r
                    from-pink-500
                    via-rose-500
                    to-orange-400
                    px-8
                    py-7
                    text-white
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-[22px]
                            bg-white/20
                            backdrop-blur-xl
                            flex
                            items-center
                            justify-center
                        ">

                            <ReceiptText
                                size={34}
                            />

                        </div>

                        <div>

                            <h2 className="
                                text-3xl
                                font-black
                            ">
                                {docTitle}
                            </h2>

                            <p className="
                                text-white/80
                                mt-1
                            ">
                                VEZBERRY Premium Bakery
                            </p>

                        </div>

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="
                    px-8
                    py-5
                    border-b
                    flex
                    flex-wrap
                    gap-3
                ">

                    <Button
                        variant="outline"
                        onClick={
                            handleDownloadPDF
                        }
                    >
                        <Download
                            className="
                                w-4
                                h-4
                                mr-2
                            "
                        />
                        PDF
                    </Button>

                    <Button
                        variant="outline"
                        onClick={
                            handlePrint
                        }
                    >
                        <Printer
                            className="
                                w-4
                                h-4
                                mr-2
                            "
                        />
                        Print
                    </Button>

                    <Button
                        variant="outline"
                        onClick={
                            handleSendWhatsApp
                        }
                        className="
                            text-green-600
                            border-green-300
                        "
                    >
                        <MessageSquare
                            className="
                                w-4
                                h-4
                                mr-2
                            "
                        />
                        WhatsApp
                    </Button>

                    <Button
                        variant="outline"
                        onClick={
                            handleSendEmail
                        }
                        disabled={sending}
                        className="
                            text-blue-600
                            border-blue-300
                        "
                    >
                        <Mail
                            className="
                                w-4
                                h-4
                                mr-2
                            "
                        />

                        {
                            sending
                                ? "Mengirim..."
                                : "Email"
                        }

                    </Button>

                </div>

                {/* CONTENT */}

                <div
                    ref={printRef}
                    className="
                        p-8
                    "
                >

                    {/* TOP */}

                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-start
                        md:justify-between
                        gap-8
                        mb-8
                    ">

                        {/* BRAND */}

                        <div>

                            <h2 className="
                                text-4xl
                                font-black
                                bg-gradient-to-r
                                from-pink-500
                                to-rose-500
                                bg-clip-text
                                text-transparent
                            ">
                                VEZBERRY
                            </h2>

                            <p className="
                                text-slate-500
                                mt-2
                            ">
                                Premium Bakery &
                                Dessert
                            </p>

                        </div>

                        {/* DOC INFO */}

                        <div className="
                            text-right
                        ">

                            <h3 className="
                                text-2xl
                                font-black
                                text-slate-800
                            ">
                                {docTitle}
                            </h3>

                            <p className="
                                text-slate-500
                                mt-2
                            ">
                                {docNumber}
                            </p>

                            <p className="
                                text-slate-500
                            ">
                                {
                                    format(
                                        new Date(
                                            order.created_date
                                        ),
                                        "dd MMM yyyy HH:mm"
                                    )
                                }
                            </p>

                        </div>

                    </div>

                    {/* CUSTOMER */}

                    <div className="
                        rounded-[28px]
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                        mb-8
                    ">

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">
                            Pelanggan
                        </p>

                        <h3 className="
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            {
                                order.customer_name
                            }
                        </h3>

                        {order.customer_phone && (

                            <p className="
                                text-slate-500
                                mt-2
                            ">
                                {
                                    order.customer_phone
                                }
                            </p>

                        )}

                        {order.customer_email && (

                            <p className="
                                text-slate-500
                            ">
                                {
                                    order.customer_email
                                }
                            </p>

                        )}

                    </div>

                    {/* TABLE */}

                    <div className="
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                        ">

                            <thead>

                                <tr className="
                                    border-b-2
                                ">

                                    <th className="
                                        text-left
                                        py-4
                                    ">
                                        Item
                                    </th>

                                    <th className="
                                        text-center
                                    ">
                                        Qty
                                    </th>

                                    <th className="
                                        text-right
                                    ">
                                        Harga
                                    </th>

                                    <th className="
                                        text-right
                                    ">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {order.items?.map(
                                    (item, i) => (

                                        <tr
                                            key={i}
                                            className="
                                                border-b
                                            "
                                        >

                                            <td className="
                                                py-5
                                                font-medium
                                            ">
                                                {
                                                    item.product_name
                                                }
                                            </td>

                                            <td className="
                                                text-center
                                            ">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="
                                                text-right
                                            ">
                                                {
                                                    formatPrice(
                                                        item.price
                                                    )
                                                }
                                            </td>

                                            <td className="
                                                text-right
                                                font-bold
                                            ">
                                                {
                                                    formatPrice(
                                                        item.quantity *
                                                        item.price
                                                    )
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* TOTAL */}

                    <div className="
                        mt-8
                        flex
                        justify-end
                    ">

                        <div className="
                            w-full
                            max-w-sm
                            rounded-[28px]
                            bg-gradient-to-r
                            from-pink-500
                            to-rose-500
                            text-white
                            p-6
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-white/80
                                ">
                                    Total Pembayaran
                                </p>

                                <CheckCircle2 />

                            </div>

                            <h3 className="
                                text-4xl
                                font-black
                                mt-3
                            ">
                                {
                                    formatPrice(
                                        order.total_amount
                                    )
                                }
                            </h3>

                        </div>

                    </div>

                    {/* STAMP */}

                    <div className="
                        flex
                        justify-center
                        mt-12
                    ">

                        <div className={`
                            px-10
                            py-4
                            border-[5px]
                            rounded-2xl
                            rotate-[-12deg]
                            font-black
                            text-4xl
                            tracking-[0.25em]

                            ${isPaid
                                ? `
                                        border-green-600
                                        text-green-600
                                      `
                                : `
                                        border-amber-500
                                        text-amber-500
                                      `
                            }
                        `}>

                            {
                                isPaid
                                    ? "LUNAS"
                                    : "IN-ORDER"
                            }

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="
                        mt-14
                        pt-8
                        border-t
                        text-center
                    ">

                        <p className="
                            text-slate-500
                        ">
                            Terima kasih telah
                            berbelanja di VEZBERRY
                        </p>

                        <p className="
                            text-xs
                            text-slate-400
                            mt-2
                        ">
                            Dokumen dibuat otomatis
                            oleh sistem
                        </p>

                    </div>

                </div>

            </DialogContent>

        </Dialog>

    );

}
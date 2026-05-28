
import React, { useState } from "react";

export default function ImageUploader({
    onUploadSuccess,
}) {

    const [uploading, setUploading] =
        useState(false);

    const [preview, setPreview] =
        useState("");

    const handleUpload = async (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        try {

            setUploading(true);

            // preview image
            setPreview(
                URL.createObjectURL(file)
            );

            const formData =
                new FormData();

            formData.append(
                "image",
                file
            );

            const response =
                await fetch(
                    "/api/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

            const data =
                await response.json();

            if (data.success) {

                if (onUploadSuccess) {

                    onUploadSuccess(
                        data.imageUrl
                    );

                }

            } else {

                alert(
                    data.error ||
                    "Upload gagal"
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Upload error"
            );

        } finally {

            setUploading(false);

        }

    };

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >

            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
            />

            {uploading && (
                <div>
                    Uploading...
                </div>
            )}

            {preview && (

                <img
                    src={preview}
                    alt="preview"
                    style={{
                        width: "140px",
                        borderRadius: "12px",
                        objectFit: "cover",
                    }}
                />

            )}

        </div>

    );

}
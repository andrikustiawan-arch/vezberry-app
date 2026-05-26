export const resizeImage = (
  file,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
) => {

  return new Promise((resolve, reject) => {

    // =========================
    // VALIDASI FILE
    // =========================

    if (
      !file ||
      !(
        file instanceof File ||
        file instanceof Blob
      )
    ) {

      console.error(
        'File tidak valid:',
        file
      );

      reject(
        new Error(
          'Invalid file'
        )
      );

      return;

    }

    // =========================
    // CREATE OBJECT URL
    // =========================

    let objectUrl = '';

    try {

      objectUrl =
        URL.createObjectURL(file);

    } catch (err) {

      console.error(
        'Gagal createObjectURL:',
        err
      );

      reject(err);

      return;

    }

    // =========================
    // IMAGE
    // =========================

    const img =
      new Image();

    img.onload = () => {

      try {

        let width =
          img.width;

        let height =
          img.height;

        // =========================
        // RESIZE CALCULATION
        // =========================

        if (width > height) {

          if (width > maxWidth) {

            height =
              Math.round(
                height *
                (
                  maxWidth / width
                )
              );

            width =
              maxWidth;

          }

        } else {

          if (height > maxHeight) {

            width =
              Math.round(
                width *
                (
                  maxHeight / height
                )
              );

            height =
              maxHeight;

          }

        }

        // =========================
        // CANVAS
        // =========================

        const canvas =
          document.createElement(
            'canvas'
          );

        canvas.width =
          width;

        canvas.height =
          height;

        const ctx =
          canvas.getContext('2d');

        if (!ctx) {

          URL.revokeObjectURL(
            objectUrl
          );

          reject(
            new Error(
              'Canvas context gagal'
            )
          );

          return;

        }

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        // =========================
        // CONVERT TO BLOB
        // =========================

        canvas.toBlob(

          (blob) => {

            URL.revokeObjectURL(
              objectUrl
            );

            if (!blob) {

              reject(
                new Error(
                  'Resize gagal'
                )
              );

              return;

            }

            const resizedFile =
              new File(
                [blob],

                file.name
                  ? file.name.replace(
                    /\.\w+$/,
                    '.jpg'
                  )
                  : `image-${Date.now()}.jpg`,

                {
                  type:
                    'image/jpeg',
                }
              );

            resolve(
              resizedFile
            );

          },

          'image/jpeg',
          quality

        );

      } catch (err) {

        URL.revokeObjectURL(
          objectUrl
        );

        reject(err);

      }

    };

    // =========================
    // ERROR LOAD IMAGE
    // =========================

    img.onerror = (err) => {

      URL.revokeObjectURL(
        objectUrl
      );

      console.error(
        'Gagal load image:',
        err
      );

      reject(
        new Error(
          'Gagal membaca gambar'
        )
      );

    };

    // =========================
    // LOAD IMAGE
    // =========================

    img.src =
      objectUrl;

  });

};

// =========================
// SAFE PREVIEW
// =========================

export function safePreview(
  value
) {

  if (!value) {

    return '';

  }

  // =========================
  // FILE / BLOB
  // =========================

  if (
    value instanceof File ||
    value instanceof Blob
  ) {

    try {

      return URL.createObjectURL(
        value
      );

    } catch (err) {

      console.error(
        'Preview gagal:',
        err
      );

      return '';

    }

  }

  // =========================
  // STRING URL
  // =========================

  if (
    typeof value === 'string'
  ) {

    return value;

  }

  // =========================
  // INVALID
  // =========================

  console.warn(
    'safePreview menerima value invalid:',
    value
  );

  return '';

}
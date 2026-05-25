export const resizeImage = (
  file,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
) => {

  return new Promise((resolve, reject) => {

    // VALIDASI FILE
    if (
      !(file instanceof File) &&
      !(file instanceof Blob)
    ) {

      console.error(
        'File tidak valid:',
        file
      );

      reject(
        new Error('Invalid file')
      );

      return;
    }

    const img =
      new Image();

    const canvas =
      document.createElement('canvas');

    const ctx =
      canvas.getContext('2d');

    export function safePreview(value) {

      if (!value)
        return '';

      if (
        value instanceof File ||
        value instanceof Blob
      ) {

        return safePreview(value);

      }

      if (typeof value === 'string') {

        return value;

      }

      return '';

    }

    img.onload = () => {

      let width =
        img.width;

      let height =
        img.height;

      // RESIZE
      if (width > height) {

        if (width > maxWidth) {

          height *=
            maxWidth / width;

          width =
            maxWidth;

        }

      } else {

        if (height > maxHeight) {

          width *=
            maxHeight / height;

          height =
            maxHeight;

        }

      }

      canvas.width =
        width;

      canvas.height =
        height;

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(

        (blob) => {

          // RELEASE MEMORY
          URL.revokeObjectURL(
            objectUrl
          );

          if (!blob) {

            console.error(
              'Resize gagal: blob null'
            );

            resolve(file);

            return;

          }

          const resizedFile =
            new File(
              [blob],
              file.name,
              {
                type: 'image/jpeg',
              }
            );

          resolve(
            resizedFile
          );

        },

        'image/jpeg',
        quality
      );

    };

    img.onerror = (err) => {

      URL.revokeObjectURL(
        objectUrl
      );

      console.error(
        'Gagal load image',
        err
      );

      reject(err);

    };

    img.src = objectUrl;

  });

};
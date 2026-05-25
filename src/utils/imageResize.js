export const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Resize gagal: blob null")
            resolve(file)
            return
          }

          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
          })

          resolve(resizedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      console.error("Gagal load image")
      resolve(file)
    }

    img.src = URL.createObjectURL(file)
  })
}
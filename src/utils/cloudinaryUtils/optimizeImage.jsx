// src/utils/optimizeImage.jsx

export const optimizeImage = async (file) => {

    if (!file) {
        console.error("No file provided for optimization.");
        return null;
    }

    // Check if the file is already in WebP format
    const isWebp = file.type === "image/webp";
//    console.log(`File is ${isWebp ? "already" : "not"} in WebP format.`);

    // If the file is already WebP, return it as-is
    if (isWebp) {
  //      console.log("File is already in WebP format. Skipping conversion.");
        return file;
    }

    // Create an image element and load the file
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

//    console.log("Loading image for processing...");
    await new Promise((resolve) => (img.onload = resolve));

    // Create a canvas element for resizing and conversion
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Define maximum dimensions to control file size
    const maxWidth = 1000;
    const maxHeight = 1000;

    let { width, height } = img;
//    console.log(`Original dimensions: ${width}x${height}`);

    // Maintain aspect ratio while resizing
    if (width > height) {
        if (width > maxWidth) {
//            console.log(`Resizing width from ${width} to ${maxWidth}`);
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
//            console.log(`Resizing height from ${height} to ${maxHeight}`);
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
        }
    }

//    console.log(`Resized dimensions: ${width}x${height}`);

    // Resize the image
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Convert the image to WebP format with 70% quality
//    console.log("Converting image to WebP format...");
    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.7)
    );

    // Clean up the object URL
    URL.revokeObjectURL(img.src);

//    console.log("Image optimization complete.");
    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
        type: "image/webp",
    });
};

// Add to src/utils/optimizeImage.jsx

export const cloudinaryLoader = (imageUrl, { width, quality = 75 }) => {
    // Check if this is a Cloudinary URL
    if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
        return imageUrl;
    }

    try {
        // Extract Cloudinary details from URL
        const matches = imageUrl.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)/);
        if (!matches) return imageUrl;

        const [, cloudName, imagePath] = matches;

        // Use Cloudinary's own transformations
        // This bypasses Next.js image optimization which is causing timeouts
        return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},q_${quality}/f_auto/${imagePath}`;
    } catch (error) {
        console.error('Error in cloudinaryLoader:', error);
        return imageUrl;
    }
};
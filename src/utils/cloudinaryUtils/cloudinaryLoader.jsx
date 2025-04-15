// src/utils/cloudinaryLoader.js
export default function cloudinaryLoader({ src, width, quality }) {
    // Parse the Cloudinary URL
    const isCloudinaryUrl = src.includes('res.cloudinary.com');

    if (!isCloudinaryUrl) {
        // For non-Cloudinary images, return as is or use a default optimization
        return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`;
    }

    // Extract the Cloudinary details
    const match = src.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)/);

    if (!match) {
        console.warn('Could not parse Cloudinary URL:', src);
        return src;
    }

    const [, cloudName, imagePath] = match;

    // Build a Cloudinary URL with optimizations
    // Use Cloudinary's own transformations instead of Next.js optimization
    return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},q_${quality || 75}/f_auto/${imagePath}`;
}
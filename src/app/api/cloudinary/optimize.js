// Create a new file: src/pages/api/cloudinary/optimize.js
export default async function handler(req, res) {
    const { url, width, quality = 75 } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Check if this is a Cloudinary URL
        if (!url.includes('res.cloudinary.com')) {
            // For non-Cloudinary URLs, just redirect
            return res.redirect(url);
        }

        // Extract Cloudinary details from URL
        const matches = url.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)/);
        if (!matches) {
            return res.redirect(url);
        }

        const [, cloudName, imagePath] = matches;

        // Create an optimized Cloudinary URL
        const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width || 800},q_${quality}/f_auto/${imagePath}`;

        // Redirect to the optimized URL
        return res.redirect(optimizedUrl);
    } catch (error) {
        console.error('Error optimizing image:', error);
        return res.status(500).json({ error: 'Failed to optimize image' });
    }
}
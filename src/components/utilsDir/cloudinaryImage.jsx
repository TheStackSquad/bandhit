// Create a new file: src/components/CloudinaryImage.jsx
import Image from 'next/image';
import { useState } from 'react';
import { cloudinaryLoader } from '@/utils/cloudinaryUtils/optimizeImage';

export default function CloudinaryImage({
    src,
    alt,
    className = '',
    objectFit = 'cover',
    priority = false,
    width,
    height,
    ...props
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Simple blur data URL placeholder
    const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';

    const handleError = () => {
        console.warn('Image failed to load:', src);
        setHasError(true);
        setIsLoading(false);
    };

    // For Cloudinary images, use our custom loader
    const isCloudinaryImage = src && typeof src === 'string' && src.includes('res.cloudinary.com');

    // Use responsive approach - container with proper aspect ratio
    const hasExplicitDimensions = width && height;

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={hasExplicitDimensions ? { width, height } : { aspectRatio: '16/9' }}
            >
                <span className="text-sm text-gray-500">Image unavailable</span>
            </div>
        );
    }

    // For Cloudinary images, optimize with our loader
    if (isCloudinaryImage) {
        // If we have explicit dimensions, use them
        if (hasExplicitDimensions) {
            return (
                <div className={`relative ${className}`} style={{ width, height }}>
                    <Image
                        src={src}
                        alt={alt || 'Image'}
                        width={width}
                        height={height}
                        loader={({ src, width }) => cloudinaryLoader(src, { width })}
                        priority={priority}
                        loading={priority ? 'eager' : 'lazy'}
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoadingComplete={() => setIsLoading(false)}
                        onError={handleError}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        {...props}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            );
        }

        // Otherwise use a responsive approach with fill
        return (
            <div className={`relative w-full ${className}`} style={{ aspectRatio: '16/9', ...props.style }}>
                <Image
                    src={src}
                    alt={alt || 'Image'}
                    fill
                    loader={({ src, width }) => cloudinaryLoader(src, { width })}
                    priority={priority}
                    loading={priority ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    style={{ objectFit }}
                    onLoadingComplete={() => setIsLoading(false)}
                    onError={handleError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    {...props}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        );
    }

    // For non-Cloudinary images, use the regular Next.js Image
    return (
        <div className={`relative ${className}`} style={hasExplicitDimensions ? { width, height } : { aspectRatio: '16/9' }}>
            <Image
                src={src}
                alt={alt || 'Image'}
                {...(hasExplicitDimensions
                    ? { width, height }
                    : { fill: true, style: { objectFit } }
                )}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={blurDataURL}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoadingComplete={() => setIsLoading(false)}
                onError={handleError}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
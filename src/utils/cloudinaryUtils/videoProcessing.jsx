//src/utils/videoProcessing.js

export const validateVideo = (file, options = {}) => {
    return new Promise((resolve) => {
        const {
            maxDurationSecs = 60,
            acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime']
        } = options;

        // Check file type
        if (!file.type.startsWith('video/')) {
            resolve({ valid: false, message: 'File is not a video' });
            return;
        }

        // Check accepted formats
        if (!acceptedFormats.includes(file.type)) {
            resolve({
                valid: false,
                message: `Unsupported format. Please upload ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`
            });
            return;
        }

        // Create a URL for the video file
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');

        video.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(videoUrl);

            // Check duration
            if (video.duration > maxDurationSecs) {
                resolve({
                    valid: false,
                    message: `Video exceeds maximum duration of ${maxDurationSecs} seconds (current: ${Math.round(video.duration)}s)`
                });
                return;
            }

            resolve({ valid: true, message: 'Video is valid', duration: video.duration });
        });

        video.addEventListener('error', () => {
            URL.revokeObjectURL(videoUrl);
            resolve({ valid: false, message: 'Error loading video file' });
        });

        video.src = videoUrl;
        video.load();
    });
};


export const getVideoThumbnail = (file, seekTo = 1) => {
    return new Promise((resolve, reject) => {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.addEventListener('loadedmetadata', () => {
            // Set appropriate time to grab thumbnail
            const safeSeekTime = Math.min(seekTo, video.duration / 2);
            video.currentTime = safeSeekTime;
        });

        video.addEventListener('seeked', () => {
            // Draw video frame to canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to base64
            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            URL.revokeObjectURL(videoUrl);
            resolve(thumbnail);
        });

        video.addEventListener('error', (error) => {
            URL.revokeObjectURL(videoUrl);
            reject(new Error('Error generating thumbnail: ' + error));
        });

        video.src = videoUrl;
        video.load();
    });
};


export const determineBestFormat = (file) => {
    // MP4 with H.264 offers the best compatibility across browsers and devices
    if (file.type === 'video/mp4') {
        return 'Keep as MP4 (recommended for web)';
    }

    // WebM has good compression but slightly less universal support
    if (file.type === 'video/webm') {
        return 'Keep as WebM (good compression, good support)';
    }

    // Default recommendation for other formats
    return 'Convert to MP4 (recommended for best compatibility)';
};

export const estimateCompressedSize = (file, duration) => {
    if (!duration) return null;

    // Basic size estimation based on file size per second
    const bytesPerSecond = file.size / duration;

    // Estimate different quality levels
    return {
        high: Math.round((bytesPerSecond * 0.7 * duration) / (1024 * 1024) * 10) / 10, // MB
        medium: Math.round((bytesPerSecond * 0.5 * duration) / (1024 * 1024) * 10) / 10, // MB
        low: Math.round((bytesPerSecond * 0.3 * duration) / (1024 * 1024) * 10) / 10 // MB
    };
};

export const getVideoMetadata = async (file) => {
    return new Promise((resolve, reject) => {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');

        video.addEventListener('loadedmetadata', () => {
            const metadata = {
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
                aspectRatio: video.videoWidth / video.videoHeight,
            };

            URL.revokeObjectURL(videoUrl);
            resolve(metadata);
        });

        video.addEventListener('error', (error) => {
            URL.revokeObjectURL(videoUrl);
            reject(new Error('Error reading video metadata: ' + error));
        });

        video.src = videoUrl;
        video.load();
    });
};
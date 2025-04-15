// src/utils/reelUtils.jsx

import {  showError, showInfo } from '@/lib/alertManager';
import { uploadReelCloudinary, uploadThumbnailCloudinary } from '@/lib/cloudinaryUpload';
import {
    validateVideo,
    getVideoMetadata,
    getVideoThumbnail,
    estimateCompressedSize
} from '@/utils/cloudinaryUtils/videoProcessing';

export const handleReelUpload = async (
    file,
    stateSetters,
    callbacks = {},
    metadata = {}
) => {
    const {
        setFile,
        setVideoInfo,
        setThumbnail,
        setIsUploading,
        setUploadProgress,
        setUploadComplete,
        setError
    } = stateSetters;

    const {
        onStart = () => { },
        onProgress = () => { },
        onSuccess = () => { },
        onError = () => { }
    } = callbacks;

    const { caption = '', accessToken = '' } = metadata;

    let toastId = null;
    let localThumbnail = null;

    try {
        // console.log('🎬 handleReelUpload started:', {
        //     fileName: file.name,
        //     fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        //     fileType: file.type,
        //     caption,
        //     hasAccessToken: !!accessToken
        // });
        onStart();

        // Validate
        const validation = await validateVideo(file, {
            maxDurationSecs: 90,
            acceptedFormats: ['video/mp4', 'video/webm', 'video/quicktime'],
        });

        if (!validation.valid) {
            const errorMsg = `Video validation failed: ${validation.message}`;
            console.error('❌', errorMsg);
            showError(errorMsg, { toastId });
            onError(new Error(errorMsg));
            throw new Error(errorMsg);
        }

    //    console.log('✅ Video validation passed');


        // Process video metadata and thumbnail in parallel for performance
        const [videoMetadata, thumbnail] = await Promise.all([
            getVideoMetadata(file),
            getVideoThumbnail(file)
        ]);

        localThumbnail = thumbnail; // Store for state updates

        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const estimatedSizes = estimateCompressedSize(file, videoMetadata.duration);

        // Convert Base64 to Blob (more efficient for uploads)
        const blob = await fetch(thumbnail).then(res => res.blob());
        blob.name = `thumbnail_${Date.now()}.jpg`; // Add timestamp to prevent caching issues

        // Set video info and thumbnail early for better UX
        if (setVideoInfo) {
            setVideoInfo({
                ...videoMetadata,
                sizeMB,
                estimatedSizes,
                preview: URL.createObjectURL(file)
            });
        }

        if (setThumbnail) setThumbnail(thumbnail);
        if (setFile) setFile(file);
        if (setIsUploading) setIsUploading(true);
        if (setUploadProgress) setUploadProgress(0);

        // Upload thumbnail to Cloudinary
        const thumbnailUrl = await uploadThumbnailCloudinary(blob, accessToken);

        const uploadMetadata = {
            ...videoMetadata,
            originalFilename: file.name,
            caption,
            thumbnail: thumbnailUrl, // Store the Cloudinary URL
            uploadedAt: new Date().toISOString(),
            fileSize: file.size,
            fileType: file.type
        };

        // Upload video to Cloudinary
        const response = await uploadReelCloudinary(
            file,
            uploadMetadata,
            file.name,
            (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (setUploadProgress) setUploadProgress(percent);
                onProgress(percent);

                // Clear "preparing" message when upload completes
                if (percent === 100) {
                    showInfo('Processing your upload...', { toastId });
                }
            },
            accessToken
        );

    //    console.log('✅ Upload complete! Response:', response);
        // showSuccess('Reel uploaded successfully!', { toastId });

        // Clear toast after success
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('clear-toast', { detail: { id: toastId } }));
        }, 3000);

        if (setUploadComplete) setUploadComplete(true);
        onSuccess(response);

        return response;
    } catch (err) {
        console.error('❌ Upload error:', err);
        const errorMsg = err.message || 'Upload failed. Please try again.';
        showError(errorMsg, { toastId });
        if (setError) setError(errorMsg);
        onError(err);
        throw err;
    } finally {
        if (setIsUploading) setIsUploading(false);

        // Clean up any object URLs to prevent memory leaks
        if (localThumbnail && localThumbnail.startsWith('blob:')) {
            URL.revokeObjectURL(localThumbnail);
        }
    }
};






































// import { showInfo, showSuccess, showError, showWarning } from '@/lib/alertManager';
// import { uploadReelCloudinary, uploadThumbnailCloudinary } from '@/lib/cloudinaryUpload';
// import { 
//     validateVideo,
//     getVideoMetadata,
//     getVideoThumbnail,
//     estimateCompressedSize 
// } from '@/utils/videoProcessing';

// export const handleReelUpload = async (
//     file,
//     stateSetters,
//     callbacks = {},
//     metadata = {}
// ) => {
//     const {
//         setFile,
//         setVideoInfo,
//         setThumbnail,
//         setIsUploading,
//         setUploadProgress,
//         setUploadComplete,
//         setError
//     } = stateSetters;

//     const {
//         onStart = () => { },
//         onProgress = () => { },
//         onSuccess = () => { },
//         onError = () => { }
//     } = callbacks;

//     const { caption = '', accessToken = '' } = metadata;

//     let toastId = null;
//     let localThumbnail = null;

//     try {
//         console.log('🎬 handleReelUpload started:', {
//             fileName: file.name,
//             fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//             fileType: file.type,
//             caption,
//             hasAccessToken: !!accessToken
//         });

//         toastId = showInfo('Preparing your reel for upload...');
//         onStart();

//         // Validate
//         const validation = await validateVideo(file, {
//             maxDurationSecs: 90,
//             acceptedFormats: ['video/mp4', 'video/webm', 'video/quicktime'],
//         });

//         if (!validation.valid) {
//             const errorMsg = `Video validation failed: ${validation.message}`;
//             console.error('❌', errorMsg);
//             showError(errorMsg, { toastId });
//             onError(new Error(errorMsg));
//             throw new Error(errorMsg);
//         }

//         console.log('✅ Video validation passed');
//         showInfo('Video validated successfully', { toastId });

//         // Process video metadata and thumbnail in parallel for performance
//         const [videoMetadata, thumbnail] = await Promise.all([
//             getVideoMetadata(file),
//             getVideoThumbnail(file)
//         ]);

//         localThumbnail = thumbnail; // Store for state updates
        
//         const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
//         const estimatedSizes = estimateCompressedSize(file, videoMetadata.duration);

//         // Convert Base64 to Blob (more efficient for uploads)
//         const blob = await fetch(thumbnail).then(res => res.blob());
//         blob.name = `thumbnail_${Date.now()}.jpg`; // Add timestamp to prevent caching issues

//         // Set video info and thumbnail early for better UX
//         if (setVideoInfo) {
//             setVideoInfo({
//                 ...videoMetadata,
//                 sizeMB,
//                 estimatedSizes,
//                 preview: URL.createObjectURL(file)
//             });
//         }

//         if (setThumbnail) setThumbnail(thumbnail);
//         if (setFile) setFile(file);
//         if (setIsUploading) setIsUploading(true);
//         if (setUploadProgress) setUploadProgress(0);

//         showInfo('Uploading your reel...', { toastId });

//         // Upload thumbnail to Cloudinary
//         const thumbnailUrl = await uploadThumbnailCloudinary(blob, accessToken);

//         const uploadMetadata = {
//             ...videoMetadata,
//             originalFilename: file.name,
//             caption,
//             thumbnail: thumbnailUrl // Store the Cloudinary URL
//         };

//         // Upload video to Cloudinary
//         const response = await uploadReelCloudinary(
//             file,
//             uploadMetadata,
//             file.name,
//             (progressEvent) => {
//                 const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 if (setUploadProgress) setUploadProgress(percent);
//                 onProgress(percent);
                
//                 // Update toast message with progress
//                 showInfo(`Uploading... ${percent}%`, {
//                     toastId,
//                     progress: percent / 100
//                 });
                
//                 // Clear "preparing" message when upload completes
//                 if (percent === 100) {
//                     showInfo('Processing your upload...', { toastId });
//                 }
//             },
//             accessToken
//         );

//         console.log('✅ Upload complete! Response:', response);
//         showSuccess('Reel uploaded successfully!', { toastId });

//         // Clear toast after success
//         setTimeout(() => {
//             document.dispatchEvent(new CustomEvent('clear-toast', { detail: { id: toastId } }));
//         }, 3000);

//         if (setUploadComplete) setUploadComplete(true);
//         onSuccess(response);

//         return response;
//     } catch (err) {
//         console.error('❌ Upload error:', err);
//         const errorMsg = err.message || 'Upload failed. Please try again.';
//         showError(errorMsg, { toastId });
//         if (setError) setError(errorMsg);
//         onError(err);
//         throw err;
//     } finally {
//         if (setIsUploading) setIsUploading(false);
        
//         // Clean up any object URLs to prevent memory leaks
//         if (localThumbnail && localThumbnail.startsWith('blob:')) {
//             URL.revokeObjectURL(localThumbnail);
//         }
//     }
// };
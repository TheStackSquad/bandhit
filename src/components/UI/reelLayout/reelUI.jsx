// src/components/UI/reelUI.jsx

import React, { useState, useEffect } from 'react';
import { Upload, XCircle, Film } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { handleReelUpload } from '@/utils/reelUtils/reelUtils';
import {  showSuccess, showError, showWarning } from '@/lib/alertManager';
import { useSocialAuth } from "@/context/socialAuthContext";
import { useDispatch } from 'react-redux';
//eslint-disable-next-line
import { uploadedReel } from '@/reduxStore/actions/reelActions';

const ReelUI = () => {
    // State for file upload and UI
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);
    //eslint-disable-next-line no-unused-vars
    const [thumbnail, setThumbnail] = useState(null);
    const [videoInfo, setVideoInfo] = useState(null);
    const [error, setError] = useState(null);

    const [isVisible, 
        //eslint-disable-next-line no-unused-vars
        setIsVisible] = useState(true);
    const [localAccessToken, setLocalAccessToken] = useState(null);
    const dispatch = useDispatch();

    const { user, accessToken } = useSocialAuth();

    // Reset all states to initial for fresh upload
    const resetUpload = () => {
        setFile(null);
        setCaption('');
        setUploadProgress(0);
        setIsUploading(false);
        setUploadComplete(false);
        setThumbnail(null);
        setVideoInfo(null);
        setError(null);
    };

    // Sync access token from context or localStorage
    useEffect(() => {
        if (accessToken) {
            setLocalAccessToken(accessToken);
        } else if (typeof window !== "undefined") {
            try {
                const storedAuth = localStorage.getItem("sb-utriuuqjqfbwufazpetl-auth-token");
                const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
                const storedToken = parsedAuth?.access_token || null;
                setLocalAccessToken(storedToken);
            } catch (err) {
                console.error("Failed to parse token:", err);
                showError('Failed to load user session');
            }
        }
    }, [accessToken]);

    // Handle video file drop
    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return showWarning('No file selected');

        if (!user) {
            const msg = 'Please sign in to upload reels';
            showError(msg);
            setError(msg);
            return;
        }

        const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!validTypes.includes(selectedFile.type)) {
            const msg = 'Invalid file type. Please upload MP4, WebM, or MOV files.';
            showError(msg);
            setError(msg);
            return;
        }

        const previewUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setVideoInfo({
            preview: previewUrl,
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type
        });
        setError('');
    };

    // Handle actual upload to server
    const handleSubmit = async () => {
        if (!file) return showWarning('No file selected');
        if (!localAccessToken) return showError('Please sign in to upload reels');

        setIsUploading(true);
        setError(null);

        try {
            // Wrap handleReelUpload with dispatch
            //eslint-disable-next-line no-unused-vars
            const uploadedReel = await handleReelUpload(
                file,
                {
                    setFile,
                    setVideoInfo,
                    setThumbnail,
                    setIsUploading,
                    setUploadProgress,
                    setUploadComplete,
                    setError
                },
                {
                    onStart: () => {},
                    onProgress: (progress) => {
                        // Keep progress updates local (no Redux needed)
                        setUploadProgress(progress);
                    },
                    //eslint-disable-next-line no-unused-vars
                    onSuccess: (result) => {

                        showSuccess('Reel uploaded successfully!');
                        resetUpload();
                    },
                    onError: (error) => {
                        // Dispatch error action
                        dispatch({
                            type: 'UPLOAD_ERROR',
                            payload: error.message
                        });

                        showError(error.message || 'Failed to upload reel');
                    }
                },
                {
                    caption,
                    accessToken: localAccessToken
                }
            );

            // Alternative: Dispatch after handleReelUpload completes
            // dispatch({ type: 'ADD_REEL', payload: uploadedReel });

        } catch (error) {
            setIsUploading(false);
            dispatch({
                type: 'UPLOAD_ERROR',
                payload: error.message
            });
            showError(error.message || 'An unexpected error occurred');
        }
    };
    // Dropzone configuration
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'video/*': ['.mp4', '.webm', '.mov'] },
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
        onDropAccepted: () => setIsDragging(false),
        onDropRejected: () => showError('File rejected. Only MP4, WebM, or MOV files allowed.')
    });

    if (!isVisible) {
        return null;
    }

    return (
        <div className="w-full animate-fadeIn transition-all duration-500 ease-in-out">
            <h2 className="text-xl font-semibold mb-4">Upload New Reel</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                    {error}
                </div>
            )}

            {!file ? (
                // Dropzone for file input
                <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-64 cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                    <input {...getInputProps()} />
                    <Upload size={48} className="mb-4 text-blue-400" />
                    <p className="text-center text-gray-600">Drag & drop a video file here, or click to browse.</p>
                    <p className="text-sm text-gray-400 mt-2">Max 90 seconds • MP4, WebM, MOV</p>
                </div>
            ) : (
                // Preview card for selected video
                <div className="border rounded-lg p-6 animate-slideUp">
                    <div className="flex gap-4 mb-4">
                        {videoInfo?.preview && (
                            <div className="w-24 h-24 rounded-md overflow-hidden border bg-black flex items-center justify-center">
                                <video
                                    src={videoInfo.preview}
                                    className="w-full h-full object-contain"
                                    muted
                                    autoPlay
                                    loop
                                />
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Film size={24} className="mr-2 text-blue-500" />
                                    <span className="font-medium text-gray-800 truncate">{file.name}</span>
                                </div>
                                {!uploadComplete && (
                                    <button onClick={resetUpload} className="text-red-500 hover:text-red-700">
                                        <XCircle size={24} />
                                    </button>
                                )}
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                {(file.size / (1024 * 1024)).toFixed(2)}MB
                            </div>
                        </div>
                    </div>

                    {/* Caption input */}
                    <div className="mb-4">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                            Caption your reel
                        </label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add a caption to your reel..."
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            maxLength="500"
                            disabled={isUploading || uploadComplete}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">{caption.length}/500</div>
                    </div>

                    {/* Upload progress bar */}
                    {isUploading && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                    {uploadProgress === 100 ? 'Processing...' : 'Uploading...'}
                                </span>
                                <span>{uploadProgress}%</span>
                            </div>
                        </div>
                    )}

                    {/* Upload or next options */}
                    {!isUploading && !uploadComplete && (
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Upload Reel
                        </button>
                    )}

                    {uploadComplete && (
                        <div className="flex gap-2">
                            <button
                                onClick={resetUpload}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Upload Another Video
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReelUI;
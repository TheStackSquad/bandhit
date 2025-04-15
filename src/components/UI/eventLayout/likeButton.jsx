// src/components/UI/eventLayout/LikeButton.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { getOrCreateSessionId } from '@/utils/eventUtils/eventsUtils';
import likeService from '@/utils/eventUtils/likeService';
import { toggleEventLike, fetchEventLikeStatus } from '@/reduxStore/actions/likeActions';

export default function LikeButton({ eventId, initialLiked = false, likesCount = 0 }) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [count, setCount] = useState(likesCount);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dispatch = useDispatch();

    // Check status on mount
    useEffect(() => {
        let isMounted = true;
        const sessionId = getOrCreateSessionId();

        const fetchStatus = async () => {
            try {
                const data = await likeService.getLikeStatus(
                    eventId,
                    sessionId,
                    dispatch,
                    (data) => fetchEventLikeStatus(data.eventId, data.liked, data.likesCount)
                );

                if (isMounted) {
                    setIsLiked(data.liked);
                    setCount(data.likesCount || 0);
                }
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchStatus();

        return () => {
            isMounted = false;
        };
    }, [eventId, dispatch]);

    // Handle like button click with animation
    const handleClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setIsAnimating(true);

        // Optimistic update
        const previousState = isLiked;
        const previousCount = count;
        setIsLiked(!isLiked);
        setCount(isLiked ? count - 1 : count + 1);

        // Trigger animation
        setTimeout(() => setIsAnimating(false), 300);

        try {
            const sessionId = getOrCreateSessionId();
            const result = await likeService.toggleLike(
                eventId,
                sessionId,
                dispatch,
                (data) => toggleEventLike(data.eventId, data.liked, data.likesCount)
            );

            // Update with actual server response
            setIsLiked(result.liked);
            setCount(result.likesCount || 0);
        } catch (error) {
            // Revert on error
            setIsLiked(previousState);
            setCount(previousCount);
            console.error('Like operation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all duration-300 transform ${isAnimating ? 'scale-125' : 'hover:scale-110'
                } ${isLiked ? 'bg-red-50' : 'bg-white/80 hover:bg-white'} relative`}
            aria-label={isLiked ? 'Unlike this event' : 'Like this event'}
        >
            <Heart
                size={24}
                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'
                    } ${isAnimating ? 'animate-pulse' : ''}`}
            />

            {count > 0 && (
                <span className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {count > 99 ? '99+' : count}
                </span>
            )}

            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-full">
                    <span className="h-3 w-3 rounded-full animate-ping bg-red-500 opacity-75"></span>
                </span>
            )}
        </button>
    );
}
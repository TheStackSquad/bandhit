// src/utils/eventUtils/LikeService.js
import { debouncePromise } from "@/utils/eventUtils/debounceUtils";
import CacheManager from "@/utils/eventUtils/cacheManager";

class LikeService {
    constructor() {
        this.cache = new CacheManager('event_likes', 1800000); // 30 minutes TTL
        this.pendingOperations = new Map();
        this.retryQueue = [];
        this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

        // Setup network listeners
        if (typeof window !== 'undefined') {
            window.addEventListener('online', this.handleOnline.bind(this));
            window.addEventListener('offline', this.handleOffline.bind(this));
        }

        // Debounced API calls
        this.debouncedToggleLike = debouncePromise(this._toggleLike.bind(this), 300);
        this.debouncedFetchStatus = debouncePromise(this._fetchLikeStatus.bind(this), 500);
    }

    // Toggle like with debounce, caching and offline support
    async toggleLike(eventId, sessionId, dispatch, actionCreator) {
        const cacheKey = `toggle_${eventId}_${sessionId}`;

        // Check if operation is already pending
        if (this.pendingOperations.has(cacheKey)) {
            return this.pendingOperations.get(cacheKey);
        }

        try {
            // Create new promise for this operation
            const operationPromise = this.debouncedToggleLike(eventId, sessionId, dispatch, actionCreator);
            this.pendingOperations.set(cacheKey, operationPromise);

            const result = await operationPromise;
            this.pendingOperations.delete(cacheKey);
            return result;
        } catch (error) {
            this.pendingOperations.delete(cacheKey);

            // Queue for retry if offline
            if (!this.isOnline) {
                this.retryQueue.push({
                    type: 'toggle',
                    eventId,
                    sessionId,
                    dispatch,
                    actionCreator
                });
            }

            throw error;
        }
    }

    // Internal method for API call
    async _toggleLike(eventId, sessionId, dispatch, actionCreator) {
        // If offline, throw error to be caught by toggleLike
        if (!this.isOnline) {
            throw new Error('No internet connection');
        }

        try {
            const response = await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, sessionId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Like operation failed');
            }

            const data = await response.json();

            // Update cache
            this.cache.set(`status_${eventId}_${sessionId}`, {
                liked: data.liked,
                likesCount: data.likesCount
            });

            // Update Redux if dispatch provided
            if (dispatch && actionCreator) {
                dispatch(actionCreator(data));
            }

            return data;
        } catch (error) {
            console.error('Toggle like API error:', error);
            throw error;
        }
    }

    // Fetch like status with caching
    async getLikeStatus(eventId, sessionId, dispatch, actionCreator) {
        const cacheKey = `status_${eventId}_${sessionId}`;

        // Check cache first
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            // Return cached data but refresh in background
            this.refreshCacheInBackground(eventId, sessionId, dispatch, actionCreator);
            return cachedData;
        }

        // No cache, fetch fresh data
        return this.debouncedFetchStatus(eventId, sessionId, dispatch, actionCreator);
    }

    // Internal method for fetch API call
    async _fetchLikeStatus(eventId, sessionId, dispatch, actionCreator) {
        // If offline, return default data
        if (!this.isOnline) {
            return { liked: false, likesCount: 0, offline: true };
        }

        try {
            const response = await fetch(`/api/like?eventId=${eventId}&sessionId=${sessionId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch like status');
            }

            const data = await response.json();

            // Update cache
            this.cache.set(`status_${eventId}_${sessionId}`, {
                liked: data.liked,
                likesCount: data.likesCount
            });

            // Update Redux if dispatch provided
            if (dispatch && actionCreator) {
                dispatch(actionCreator(data));
            }

            return data;
        } catch (error) {
            console.error('Fetch like status API error:', error);
            throw error;
        }
    }

    // Refresh cache in background without blocking UI
    refreshCacheInBackground(eventId, sessionId, dispatch, actionCreator) {
        if (!this.isOnline) return;

        this._fetchLikeStatus(eventId, sessionId, dispatch, actionCreator)
            .catch(error => console.error('Background refresh error:', error));
    }

    // Process retry queue when back online
    handleOnline() {
        this.isOnline = true;
        this.processRetryQueue();
    }

    // Update online status
    handleOffline() {
        this.isOnline = false;
    }

    // Process operations queued during offline period
    async processRetryQueue() {
        if (!this.isOnline || this.retryQueue.length === 0) return;

    //    console.log(`Processing ${this.retryQueue.length} pending operations`);

        // Clone and clear queue
        const operations = [...this.retryQueue];
        this.retryQueue = [];

        for (const op of operations) {
            try {
                if (op.type === 'toggle') {
                    await this._toggleLike(op.eventId, op.sessionId, op.dispatch, op.actionCreator);
                }
                // Add other operation types as needed
            } catch (error) {
                console.error('Retry operation failed:', error);
                // Re-queue only a limited number of times
                if (!op.retryCount || op.retryCount < 3) {
                    this.retryQueue.push({
                        ...op,
                        retryCount: (op.retryCount || 0) + 1
                    });
                }
            }
        }
    }

    // Clear service resources on cleanup
    cleanup() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleOnline);
            window.removeEventListener('offline', this.handleOffline);
        }
        this.pendingOperations.clear();
        this.retryQueue = [];
    }
}

// Singleton instance
const likeService = new LikeService();
export default likeService;
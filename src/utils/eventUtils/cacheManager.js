// src/eventUtils/utils/CacheManager.js
export default class CacheManager {
    constructor(namespace = 'app_cache', ttl = 3600000) { // Default TTL: 1 hour
        this.namespace = namespace;
        this.defaultTTL = ttl;
    }

    // Get item from cache
    get(key) {
        if (typeof window === 'undefined') return null;

        try {
            const item = localStorage.getItem(`${this.namespace}_${key}`);
            if (!item) return null;

            const { value, expiry } = JSON.parse(item);

            // Check if expired
            if (expiry && expiry < Date.now()) {
                this.remove(key);
                return null;
            }

            return value;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    // Set item in cache with optional TTL
    set(key, value, ttl = this.defaultTTL) {
        if (typeof window === 'undefined') return;

        try {
            const item = {
                value,
                expiry: ttl ? Date.now() + ttl : null
            };

            localStorage.setItem(`${this.namespace}_${key}`, JSON.stringify(item));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    // Remove item from cache
    remove(key) {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(`${this.namespace}_${key}`);
    }

    // Clear all items under this namespace
    clear() {
        if (typeof window === 'undefined') return;

        Object.keys(localStorage)
            .filter(key => key.startsWith(this.namespace))
            .forEach(key => localStorage.removeItem(key));
    }

    // Check if item exists and is not expired
    has(key) {
        return this.get(key) !== null;
    }
}
// src/utils/textUtils.js

// Character counting function (to be used by both the hook and validation)
export const countCharacters = (text) => {
    return text ? text.length : 0;
};

// Word counting function (to be used by both the hook and validation)
export const countWords = (text) => {
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
};

// Character limits (single source of truth)
export const CHAR_LIMITS = {
    content: 2000,
    excerpt: 250
};

// Word limits
export const WORD_LIMITS = {
    content: 1500,
    excerpt: 200
};
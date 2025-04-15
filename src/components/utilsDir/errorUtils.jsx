// src/components/utilsDir/errorUtils.js

export const isCriticalError = (error) => {
    if (!error) return false;

    const status = error?.response?.status || error?.status;

    // Treat server errors or no response as critical
    return (
        status >= 500 ||                           // Internal server errors
        status === 401 || status === 403 ||       // Auth/permission issues
        error.message === 'Network Error' ||      // Network failure
        !error.response                           // Possibly offline
    );
};

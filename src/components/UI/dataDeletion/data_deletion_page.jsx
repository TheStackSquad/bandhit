//src/components/UI/dataDeletion/data_deletion_page.jsx

import React, { useState, useEffect } from 'react';
import ConfirmationModal from '@/components/modal/confirmation_modal';
import { deleteUserData } from '@/utils/dataDelete/dataDeleteUtils';

const DataDeletionPage = () => {
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [deletionStatus, setDeletionStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const handleConfirmDeletion = async () => {
        setIsLoading(true);
        setDeletionStatus(null);

        try {
            await deleteUserData(); // Removed unused result variable
            setDeletionStatus({ type: 'success', message: 'Your data deletion request has been submitted and is being processed.' });
        } catch (error) {
            console.error('Error submitting data deletion request:', error);
            setDeletionStatus({ type: 'error', message: 'An error occurred while submitting your request. Please try again later.' });
        } finally {
            setIsLoading(false);
            closeConfirmationModal();
        }
    };

    // Apply Tailwind animation classes conditionally based on mount
    const animatedClass = hasMounted ? 'animate-fade-in' : 'opacity-0';
    const animatedSlideDown = hasMounted ? 'animate-slide-down-sm' : 'translate-y-[-10px] opacity-0';
    const animatedSlideUp = hasMounted ? 'animate-slide-up-sm' : 'translate-y-[10px] opacity-0';
    const animatedDelay100 = hasMounted ? 'animate-delay-100' : 'opacity-0';
    const animatedDelay200 = hasMounted ? 'animate-delay-200' : 'opacity-0';
    const animatedDelay300 = hasMounted ? 'animate-delay-300' : 'opacity-0';
    const animatedDelay400 = hasMounted && deletionStatus ? 'animate-delay-400' : 'opacity-0';

    return (
        <div className={`max-w-2xl mx-auto p-6 ${animatedClass} transition-opacity duration-300`}>
            <h1 className={`text-3xl font-bold mb-4 ${animatedSlideDown} transition-transform duration-300`}>Request Data Deletion</h1>
            <p className={`text-gray-600 mb-6 ${animatedClass} ${animatedDelay100} transition-opacity duration-300`}>
                By submitting this request, all personal information associated with your account will be permanently removed from our systems. This action is irreversible.
            </p>
            <p className={`text-gray-700 mb-8 ${animatedClass} ${animatedDelay200} transition-opacity duration-300`}>
                Are you sure you want to proceed with the permanent deletion of your data?
            </p>

            <button
                className={`bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${animatedSlideUp} ${animatedDelay300} transition-transform duration-300`}
                onClick={openConfirmationModal}
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit Data Deletion Request'}
            </button>

            {deletionStatus && (
                <div className={`mt-4 p-3 rounded-md ${deletionStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    } ${animatedClass} ${animatedDelay400} transition-opacity duration-300`}>
                    {deletionStatus.message}
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={closeConfirmationModal}
                onConfirm={handleConfirmDeletion}
                title="Confirm Data Deletion"
                message="Are you absolutely sure you want to permanently delete your account and all associated data? This action cannot be undone."
                confirmButtonText="Yes, Delete My Data"
                cancelButtonText="Cancel"
                isConfirmButtonDanger
                isLoading={isLoading}
            />
        </div>
    );
};

export default DataDeletionPage;
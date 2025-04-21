//src/components/modal/confirmation_modal.jsx

import React from 'react';
import styles from './confirmation_modal.module.css'; // Assuming you'll create this CSS file

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    isConfirmButtonDanger = false,
    isLoading = false,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
                        {cancelButtonText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${isConfirmButtonDanger ? styles.danger : ''}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
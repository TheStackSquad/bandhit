// //src/components/modal/toggleableCard.jsx


import { useState, useRef, useEffect } from "react";

export default function ToggleableCard({
    title = "Metrics Dashboard",
    leftButtonText = "View Metrics",
    // eslint-disable-next-line no-unused-vars
    rightButtonText = "Close",
    children,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null);

    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') closeModal();
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen]);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(true)}
                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${isOpen ? "hidden" : "block"}`}
            >
                {leftButtonText}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <button
                        className="absolute inset-0 w-full h-full cursor-default"
                        onClick={closeModal}
                        aria-label="Close modal"
                    />

                    <div
                        role="dialog"
                        ref={dialogRef}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col p-0 outline-none"
                        aria-labelledby="modal-title"
                        aria-modal="true"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold" id="modal-title">{title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close"
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path
                                        d="M18 6L6 18M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}























// export default function ToggleableCard({
//     title = "Metrics Dashboard",
//     leftButtonText = "View Metrics",
//     rightButtonText = "Close",
//     children,
// }) {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div className="w-full">
//             {/* Toggle Button - Always rendered but conditionally shown */}
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${isOpen ? 'hidden' : 'block'}`}
//             >
//                 {leftButtonText}
//             </button>

//             {/* Card Content - Modal when open */}
//             {isOpen && (
//                 <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col">
//                         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                             <h3 className="text-lg font-semibold">{title}</h3>
//                             <button
//                                 onClick={() => setIsOpen(false)}
//                                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                                 aria-label="Close"
//                             >
//                                 <svg viewBox="0 0 24 24" width="24" height="24">
//                                     <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <div className="p-6 overflow-y-auto flex-1">
//                             {children}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
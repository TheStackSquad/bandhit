'use client';

export const CheckoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="text-lg font-semibold mb-4">Clear Cart?</div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Yes, Clear
          </button>
        </div>
      </div>
    </div>
  );
};


//CartEmptyModal
export const CartEmptyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="text-lg font-semibold mb-4">Cart is Empty</div>
        <p className="text-gray-600 mb-6">Your cart is empty, there is nothing to clear.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

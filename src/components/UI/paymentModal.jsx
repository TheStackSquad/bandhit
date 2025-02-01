// src/components/UI/PaymentModal.jsx
 // eslint-disable-next-line

 import { useState } from "react"; // Fix for 'useState' is not defined
import { useRouter } from "next/router"; 
import { motion } from "framer-motion"; 
import { clearCart } from "@/reduxStore/actions/cartActions";

 // eslint-disable-next-line
export const PaymentModal = ({ isOpen, onClose, total, cartItems }) => {

    const router = useRouter();
        // eslint-disable-next-line
    const [isProcessing, setIsProcessing] = useState(false);
  
    // eslint-disable-next-line
    const handleSubmit = async (formData) => {
      setIsProcessing(true);
      try {
        // Save payment details to database
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            cartItems,
            total
          })
        });
  
        if (response.ok) {
          // Clear cart and redirect to success page
          clearCart();
          router.push('/payment/success');
        }
      } catch (error) {
        console.error('Payment error:', error);
      } finally {
        setIsProcessing(false);
      }
    };
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Modal content */}
      </motion.div>
    );
  };
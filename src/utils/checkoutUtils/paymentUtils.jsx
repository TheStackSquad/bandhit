// src/utils/paymentUtils.jsx
// Import toast directly from react-toastify instead of from alertManager
import { toast } from "react-toastify";
import { showInfo, showSuccess, showError } from "@/lib/alertManager";

export const submitPayment = async (paymentData, clearCart) => {
    // Show initial loading state to user
    const loadingAlertId = showInfo("Processing payment...", { autoClose: false });
  //  console.log("🟡 Payment submission initiated", { paymentData });
    
    try {
//        console.log("1️⃣ Preparing payment payload...");

         // Get cart items from Redux store
        const cartItems = JSON.parse(localStorage.getItem("persist:cart"));
        const parsedItems = JSON.parse(cartItems.items || "[]");

        // For now, we'll use the first event in the cart
        // In a real multi-item cart, you might need to create multiple payment records
        const eventId = parsedItems.length > 0 ? parsedItems[0].id : null;

        const payload = {
            event_id: eventId,
            amount: Number(paymentData.amount),
            card_last_four: paymentData.cardNumber.slice(-4),
            status: 'completed',
            email: paymentData.email,
            full_name: paymentData.fullName,
            user_type: paymentData.userId ? 'registered' : 'guest',
            ...(paymentData.userId && { user_id: paymentData.userId })
        };


        
    //    console.log("📦 Request payload:", payload);
    //    console.log("2️⃣ Making API request to /api/payments...");
        
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        // console.log("3️⃣ Received response:", {
        //     status: response.status,
        //     ok: response.ok
        // });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ API Error Response:", errorText);
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
     //   console.log("✅ Payment successful! Response data:", data);
        
        // Close loading toast before proceeding
        toast.dismiss(loadingAlertId);
        
        // Clear cart after successful payment
        if (typeof clearCart === 'function') {
         //   console.log("🛒 Clearing cart...");
            clearCart();
        }
        
        // Show success message with new toast ID (not reusing loadingAlertId)
        showSuccess("Payment processed successfully!", {
            autoClose: 5000
        });
        
        return {
            success: true,
            data,
            user: {
                fullName: paymentData.fullName,
                email: paymentData.email
            }
        };
    } catch (error) {
        console.error("🚨 Payment submission failed:", {
            error: error.message,
            stack: error.stack
        });
        
        // Close loading toast before showing error
        toast.dismiss(loadingAlertId);
        
        // Show error with new toast ID
        showError(
            `Payment failed: ${error.message || "Please try again later"}`,
            {
                autoClose: 8000
            }
        );
        
        return {
            success: false,
            error: error.message,
            rawError: process.env.NODE_ENV === 'development' ? error : undefined
        };
    }
};
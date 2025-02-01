//src/utils/checkoutUtils.jsx
// Calculate totals and check for bulk discount
export const calculateTotals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal > 1000 ? subtotal * 0.15 : 0; // Example: 15% bulk discount
  const total = subtotal - discount;
  return { subtotal, discount, total };
};

// Handle quantity updates
export const updateQuantity = (itemId, action, updateUI) => {
  try {
    const eventsData = localStorage.getItem("events");
    let events = eventsData ? JSON.parse(eventsData) : [];

    // Ensure every item has a quantity field before modification
    events = events.map((event) =>
      event.id === itemId
        ? {
            ...event,
            quantity: event.quantity ? event.quantity + (action === "increase" ? 1 : -1) : 1,
          }
        : event
    );

    // Remove items with quantity < 1
    events = events.filter((event) => event.quantity >= 1);

    localStorage.setItem("events", JSON.stringify(events));

    if (updateUI) {
      updateUI(events);
    }
  } catch (error) {
    console.error("Error updating event quantity:", error);
  }
};


// Clear entire cart
export const clearCart = (updateUI, setIsEmptyCartModalOpen) => {
  try {
    // Get events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    if (storedEvents.length === 0) {
      // If cart is empty, trigger the "Cart is empty" modal
      setIsEmptyCartModalOpen(true);
    } else {
      // Remove the events from localStorage
      localStorage.removeItem("events");

      // Trigger UI update after clearing cart
      if (updateUI) {
        updateUI([]);
      }
    }
  } catch (error) {
    console.error("Error clearing the cart:", error);
  }
};


// Remove item from cart
export const removeFromCart = (itemId, updateUI) => {
  if (!itemId) {
    console.error("Id is missing!");
    return;
  }

  try {
    // Retrieve existing events from localStorage
    const eventsData = localStorage.getItem("events");
    let events = eventsData ? JSON.parse(eventsData) : [];

    // Filter out the event with the matching id
    const updatedEvents = events.filter((event) => event.id !== itemId);

    // Save the updated list back to localStorage
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Call the updateUI function to refresh the state in checkoutUI.jsx
    if (updateUI) {
      updateUI(updatedEvents);
    }
  } catch (error) {
    console.error("Error removing event from cart:", error);
  }
};

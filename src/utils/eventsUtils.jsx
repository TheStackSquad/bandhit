//src/utils/eventsUtils.jsx

import { addToCart } from "@/reduxStore/actions/cartActions";

export const handleCartSubmit = (eventDetails, token, dispatch) => {
  dispatch(addToCart(eventDetails, token));
};

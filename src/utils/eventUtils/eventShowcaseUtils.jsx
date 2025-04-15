//src/utils/eventShowcaseUtils.jsx

"use client";
import { addToCart } from "@/reduxStore/actions/cartActions";

export const submitToCart = (dispatch, eventDetails) => {
 // console.log('Dispatching to cart:', eventDetails);
  dispatch(addToCart(eventDetails));
};
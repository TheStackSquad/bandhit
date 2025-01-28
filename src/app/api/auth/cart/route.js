//src/app/api/auth/cart/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import CartItems from '@/schemas/models/Cart';
import { verifyToken } from '@/utils/tokenManager';

// Connect to the database
await dbConnect();

// POST: Add item to the cart
export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    const data = await req.json();
    const { eventId, quantity } = data;

    if (!eventId || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the item already exists in the user's cart
    let cartItem = await CartItems.findOne({ userId: user.id, eventId });

    if (cartItem) {
      // Update quantity if the item already exists
      cartItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cartItem = new CartItems({
        userId: user.id,
        eventId,
        quantity,
      });
    }

    await cartItem.save();

    return NextResponse.json({ message: 'Item added to cart successfully', cartItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch all cart items for the authenticated user
export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    const cartItems = await CartItems.find({ userId: user.id }).populate('eventId'); // Populate event details
    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

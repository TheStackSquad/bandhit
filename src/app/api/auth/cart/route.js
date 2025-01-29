//src/app/api/auth/cart/route.js
import mongoose from 'mongoose';
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
    // console.log('cart token in route:', token);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }
    // console.log('user cart token in route:', user);

    const data = await req.json();
   // console.log('user cart data in route:', data);

    // Convert the string ID to ObjectId for userId
    const userId = new mongoose.Types.ObjectId(user.userId);

    // Validate required fields
    const requiredFields = ['id', 'name', 'time', 'date', 'price', 'status', 'venue'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if the item already exists in the user's cart
    let cartItem = await CartItems.findOne({ 
      userId: userId,
      id: data.id 
    });

    if (cartItem) {
      // Update quantity if the item already exists
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      // Create new cart item with the correct structure
      cartItem = new CartItems({
        userId: userId,
        id: data.id,
        name: data.name,
        time: data.time,
        date: data.date,
        price: data.price,
        status: data.status,
        venue: data.venue,
        quantity: 1
      });
      await cartItem.save();
    }

    return NextResponse.json({ 
      message: 'Item added to cart successfully', 
      cartItem 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    // Send back the actual error message for debugging
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 });
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

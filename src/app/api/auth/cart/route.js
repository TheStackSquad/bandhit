//src/app/api/auth/cart/route.js
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import CartItems from '@/schemas/models/Cart';
import { verifyToken } from '@/utils/tokenManager';

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

    await dbConnect();

    const data = await req.json();
    // console.log('user cart data in route:', data);

    // Convert the string ID to ObjectId for userId
    const userId = new mongoose.Types.ObjectId(user.userId);

    // Check if the item already exists in the user's cart
    let cartItem = await CartItems.findOne({ 
      userId: userId,
      eventId: data._id  // Changed from id to _id to match incoming data
    });

    if (cartItem) {
      // Update quantity if the item already exists
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      // Create new cart item with the correct structure
      cartItem = new CartItems({
        userId: userId,
        eventId: data._id,
        eventName: data.eventName,  // Changed from name to eventName
        time: data.time,
        date: data.date,
        price: data.price,
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
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE: Remove item from the cart
export async function DELETE(req, { params }) {
  // console.log('=== DELETE Route Handler Started ===');
  
  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 403 });

    // Connect to DB
    await dbConnect();
    
    // Extract `eventId` or `_id` from params
    let { eventId } = params;
    const userId = new mongoose.Types.ObjectId(user.userId);

    // console.log('Delete Query Params:', { eventId, userId });

    let query = { userId }; // Base query
    if (mongoose.Types.ObjectId.isValid(eventId)) {
      // If it's a valid ObjectId, use _id
      query._id = new mongoose.Types.ObjectId(eventId);
    } else {
      // Otherwise, use eventId field
      query.eventId = eventId;
    }

    // Attempt to delete item
    const deletedItem = await CartItems.findOneAndDelete(query);

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event removed successfully',
      deletedItem
    }, { status: 200 });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    // console.log('=== DELETE Route Handler Completed ===');
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

    await dbConnect();
    
    const cartItems = await CartItems.find({ userId: user.id }).populate('eventId'); // Populate event details
    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

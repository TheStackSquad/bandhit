// src/app/api/auth/dashboard/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Event from '@/schemas/models/dashboard';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinaryUpload';
import { verifyToken } from '@/utils/tokenManager'; 

export async function POST(req) {
  try {
  //  console.log("Incoming request headers:", req.headers);

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Unauthorized access: No token provided or invalid format");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verifying token using your custom verifyToken function
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      console.error("Invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  //  console.log("Decoded token:", decodedToken);

    await dbConnect();

    const formData = await req.formData();
  //  console.log("Received formData entries:");
  //  for (const pair of formData.entries()) {
    //  console.log(`${pair[0]}: ${pair[1]}`);
  //  }

    const imageFile = formData.get("coverImage");
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
    //  console.log("Uploading event image...");
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadToCloudinary(fileBuffer, "events");
    //  console.log("Image uploaded successfully. URL:", imageUrl);
    } else {
    //  console.log("No image provided or image size is zero.");
    }

    const eventData = {
      userId: decodedToken.userId, // Extract userId from the token
      eventName: formData.get("eventName"),
      time: formData.get("time"),
      date: formData.get("date"),
      price: formData.get("price"),
      venue: formData.get("venue"),
      capacity: formData.get("capacity"),
      imageUrl,
    };

  //  console.log("Constructed eventData:", eventData);

    const newEvent = await Event.create(eventData);
 //   console.log("New event created:", newEvent);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Unauthorized access: No token provided or invalid format");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      console.error("Invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse form data
    const formData = await req.formData();
    const eventId = formData.get('eventId');

    // Find existing event
    const event = await Event.findOne({ _id: eventId, userId: decodedToken.userId });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {};

    // Only include fields that are present in the form data
    const fields = ['eventName', 'time', 'date', 'price', 'venue', 'capacity'];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        updateData[field] = value;
      }
    });

    // Handle image update
    const imageFile = formData.get('eventImage');
    if (imageFile && imageFile.size > 0) {
      try {
        // Delete old image if it exists
        if (event.imageUrl) {
          const oldImageId = event.imageUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(oldImageId);
        }
        
        // Upload new image
        const imageUrl = await uploadToCloudinary(imageFile, 'events');
        updateData.imageUrl = imageUrl;
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        return NextResponse.json(
          { error: 'Failed to process image upload' },
          { status: 500 }
        );
      }
    }

    // Update the event with new data while preserving existing fields
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, userId: decodedToken.userId },
      { $set: updateData },
      { 
        new: true,        // Return the updated document
        runValidators: true // Run model validators
      }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedEvent, { status: 200 });

  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json(
      { error: 'Internal server error during event update' },
      { status: 500 }
    );
  }
}
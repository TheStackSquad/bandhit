// src/app/api/auth/dashboard/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Event from '@/schemas/models/dashboard';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinaryUpload';
import { verifyToken } from '@/utils/tokenManager'; 

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    // console.log("DB Connected successfully");
    
    const formData = await req.formData();
    // console.log("Received FormData:", Object.fromEntries(formData));
    
    const imageFile = formData.get("coverImage");
    // console.log("Image file received:", imageFile ? "yes" : "no", imageFile?.size);
    
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
      const cloudinaryResponse = await uploadToCloudinary(fileBuffer, "events");
      // console.log("Cloudinary response:", cloudinaryResponse);
      
      imageUrl = {
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        uploadedAt: new Date(),
      };
      // console.log("Constructed imageUrl object:", imageUrl);
    }

    const eventData = {
      userId: decodedToken.userId,
      eventName: formData.get("eventName"),
      time: formData.get("time"),
      date: formData.get("date"),
      price: formData.get("price"),
      venue: formData.get("venue"),
      capacity: formData.get("capacity"),
      imageUrl: imageUrl ? {
        url: imageUrl.url,
        publicId: imageUrl.publicId,
        uploadedAt: imageUrl.uploadedAt
      } : null,
    };
    
    // console.log("Final eventData being sent to MongoDB:", JSON.stringify(eventData, null, 2));
    
    // Let's also check the schema
    // console.log("Event model schema:", Event.schema.obj);
    
    const newEvent = await Event.create(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    // Log the full error object
    console.error("Full error object:", JSON.stringify(error, null, 2));
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
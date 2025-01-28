// src/app/api/auth/profile-image/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/tokenManager'; 
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinaryUpload';

export async function POST(req) {
  try {
    // 1. Authentication
//    console.log("Incoming request headers:", req.headers);
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Unauthorized access: No token provided or invalid format");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);
    
    if (!decodedToken || !decodedToken.userId) {
      console.error("Invalid or malformed token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // 2. Database Connection
    await dbConnect();

    // 3. Form Data Validation
    const formData = await req.formData();
  //  console.log("Received formData entries:");
  //  for (const pair of formData.entries()) {
    //  console.log(`${pair[0]}: ${pair[1]}`);
  //  }

    const profileImageFile = formData.get('profileImage');
    if (!profileImageFile || profileImageFile.size === 0) {
      console.error("No image provided or image size is zero");
      return NextResponse.json(
        { error: "Profile image is required" },
        { status: 400 }
      );
    }

    // 4. User Validation
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Image Processing
    const fileBuffer = Buffer.from(await profileImageFile.arrayBuffer());

    // 6. Delete Old Image
    if (user.profileImage && user.profileImage.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId);
    }

    // 7. Upload New Image
    const cloudinaryResponse = await uploadToCloudinary(fileBuffer, 'users');
  //  console.log("Cloudinary Response:", cloudinaryResponse);

    // 8. Create New Profile Image Object
    const newProfileImage = {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      uploadedAt: new Date(),
    };
 //   console.log("New Profile Image Object:", newProfileImage);

    // 9. Validate Profile Image Data
    if (!newProfileImage.url || !newProfileImage.publicId) {
      console.error("Invalid profile image data:", newProfileImage);
      throw new Error("Invalid profile image data received from Cloudinary");
    }

    // 10. Update Database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: newProfileImage },
      { new: true }
    );
  //  console.log("Updated User:", updatedUser);

    // 11. Return Response
    return NextResponse.json(
      { profileImage: updatedUser.profileImage },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
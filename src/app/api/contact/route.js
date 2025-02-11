
// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Contact from '@/schemas/models/contact';
import contactValidationSchema from '@/schemas/validationSchema/contactValidation';

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    await contactValidationSchema.validate(body);
    const newContact = await Contact.create(body);
    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// src/app/api/payments/route.js
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';

export async function POST(request) {
//  console.log('🔵 PAYMENTS API ROUTE HIT');

  try {
    // Log the incoming request method and URL
    // console.log('ℹ️ Incoming request:', {
    //   method: request.method,
    //   url: request.url,
    //   headers: Object.fromEntries(request.headers)
    // });

    // Parse the request body
    const paymentData = await request.json();
  //  console.log('📦 Request body:', paymentData);

    // 🔒 Validate required fields for both guest and registered flows
    const requiredFields = ['amount', 'card_last_four', 'email', 'full_name'];
    const missingFields = requiredFields.filter((field) => !paymentData[field]);

    if (missingFields.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // ✅ Determine user type
    paymentData.user_type = paymentData.user_type || (paymentData.user_id ? 'registered' : 'guest');

    // 🛠️ Initialize Supabase client
//    console.log('🛠️ Creating Supabase client...');
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 💾 Insert into DB
   // console.log('💾 Attempting to insert payment:', paymentData);

    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();

    if (error) {
      console.error('❌ Supabase error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

 //   console.log('✅ Payment successfully recorded:', data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('🚨 Error in payments API:', {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
 // console.log('🛩️ CORS preflight request received');
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
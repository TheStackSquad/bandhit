// src/app/api/events/route.js
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";


// In your route.js file
export async function POST(request) {
//    console.log("📡 Route Handler: POST /api/dashboard request received");
    
    try {
        // Create Supabase client
        const supabase = createServerSupabaseClient();

        // Parse incoming request body
        const eventData = await request.json();
        
  //      console.log("📝 Incoming Event Creation Data:", eventData);

        // Validate event data
        if (!eventData) {
            return NextResponse.json(
                { error: "No event data provided" }, 
                { status: 400 }
            );
        }

        // Insert new event into Supabase
        const { data, error } = await supabase
            .from("events")
            .insert(eventData)
            .select();

        if (error) {
            console.error("❌ Event Creation Error:", error);
            return NextResponse.json(
                { 
                    error: "Failed to create event", 
                    details: error.message 
                }, 
                { status: 500 }
            );
        }

    //    console.log("✅ Event Created Successfully:", data[0]);

        return NextResponse.json(data[0], { status: 201 });

    } catch (error) {
        console.error("💥 Unexpected Error in Event Creation:", error);
        return NextResponse.json(
            { 
                error: "Unexpected server error", 
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}

// Add new PATCH method for updating events
export async function PATCH(request) {
  //  console.log("🔄 Route Handler: PATCH /api/events request received");

    try {
        // Create Supabase client
        const supabase = createServerSupabaseClient();

        // Parse the request body
        const requestBody = await request.json();
        // console.log("📝 Route Handler: Received Update Payload", {
        //     payload: requestBody
        // });

        // Validate required fields
        const { id, ...updateData } = requestBody;

        if (!id) {
            console.error("❌ Route Handler: Missing Event ID");
            return NextResponse.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        // Perform the update
        const { data, error } = await supabase
            .from("events")
            .update(updateData)
            .eq('id', id)
            .select();

        // Handle potential errors
        if (error) {
            console.error("❌ Route Handler: Supabase Update Error", {
                message: error.message,
                code: error.code,
                details: error.details,
                fullError: error
            });
            return NextResponse.json(
                {
                    error: "Failed to update event",
                    details: error.message
                },
                { status: 500 }
            );
        }

        // Check if any rows were updated
        if (!data || data.length === 0) {
            console.warn("⚠️ Route Handler: No event found to update", { id });
            return NextResponse.json(
                { error: "No event found with the specified ID" },
                { status: 404 }
            );
        }

        // // Success response
        // console.log("✅ Route Handler: Event Updated Successfully", {
        //     updatedEvent: data[0],
        //     id
        // });

        return NextResponse.json(data[0], { status: 200 });

    } catch (error) {
        console.error("💥 Route Handler: Unexpected Server Error", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return NextResponse.json(
            {
                error: "Unexpected server error during event update",
                details: error.message
            },
            { status: 500 }
        );
    }
}

// Optionally, add PUT method as an alternative
export async function PUT(request) {
    // Reuse the PATCH logic
    return PATCH(request);
}
// src/app/api/events/route.js
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

export async function GET() {
//    console.log("🌈 Route Handler: GET /api/events request received");

    try {
  //      console.log("🔑 Route Handler: Creating Supabase Client");
        const supabase = createServerSupabaseClient();

    //    console.log("🔍 Route Handler: Attempting to Fetch Events");
        const { data: events, error } = await supabase
            .from("events")
            .select("*");

        // console.log("🕵️ Route Handler: Query Execution Details", {
        //     eventsReceived: !!events,
        //     eventCount: events?.length || 0,
        //     error
        // });

        if (error) {
            console.error("❌ Route Handler: Supabase Query Error", {
                message: error.message,
                code: error.code,
                details: error.details,
                fullError: error
            });
            return NextResponse.json({
                error: "Failed to fetch events",
                details: error.message
            }, { status: 500 });
        }

        if (!events || events.length === 0) {
            console.warn("⚠️ Route Handler: No events found");
            return NextResponse.json([], { status: 200 });
        }

    //    console.log(`✅ Route Handler: Retrieved ${events.length} events`);
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error("💥 Route Handler: Unexpected Server Error", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return NextResponse.json(
            {
                error: "Unexpected server error",
                details: error.message
            },
            { status: 500 }
        );
    }
}
